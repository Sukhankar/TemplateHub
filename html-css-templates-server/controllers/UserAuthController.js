import User from "../models/userModel.js";
import Developer from "../models/DeveloperModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOTPEmail, sendPasswordResetEmail } from "../services/emailService.js";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "access_secret_key_12345";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "refresh_secret_key_67890";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// 1. REGISTER
export const register = async (req, res) => {
  const { name, email, password, role = "user", storeName, storeDescription } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    if (role === "developer" && !storeName) {
      return res.status(400).json({ message: "Store name is required for developer accounts" });
    }

    if (role === "developer") {
      const existingStore = await Developer.findOne({ storeName });
      if (existingStore) {
        return res.status(400).json({ message: "Store name is already taken" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(rawOtp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: ["user", "developer", "admin"].includes(role) ? role : "user",
      isVerified: false,
      otp: {
        hash: otpHash,
        expiresAt: otpExpiresAt,
      },
    });

    if (role === "developer") {
      await Developer.create({
        userId: user._id,
        storeName,
        storeDescription: storeDescription || "",
      });
    }

    // Send OTP email
    await sendOTPEmail(user.email, rawOtp);

    res.status(201).json({
      message: "Registration successful! Verification OTP sent to your email.",
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server error during registration", error: err.message });
  }
};

// 2. VERIFY EMAIL (OTP)
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (!user.otp || !user.otp.hash || !user.otp.expiresAt) {
      return res.status(400).json({ message: "No OTP request found. Please request a new OTP." });
    }

    if (new Date() > new Date(user.otp.expiresAt)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp.hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Error verifying email", error: err.message });
  }
};

// RESEND OTP
export const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(rawOtp, 10);
    user.otp = {
      hash: otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await user.save();

    await sendOTPEmail(user.email, rawOtp);
    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Error resending OTP", error: err.message });
  }
};

// 3. LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated." });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email address before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// 4. REFRESH TOKEN
export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshToken || !user.isActive) {
      return res.status(401).json({ message: "Invalid refresh token session" });
    }

    const isMatch = await bcrypt.compare(token, user.refreshToken);
    if (!isMatch) {
      return res.status(401).json({ message: "Refresh token mismatch or revoked" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// 5. LOGOUT
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshToken = undefined;
          await user.save();
        }
      } catch (_) {}
    }

    res.clearCookie("refreshToken");
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout error", error: err.message });
  }
};

// 6. FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email?.toLowerCase() });
    // Always return generic message to prevent email enumeration
    const genericResponse = {
      message: "If an account exists with that email, a password reset link has been sent.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    user.resetPassword = {
      tokenHash: resetTokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    };
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      user.email
    )}`;

    await sendPasswordResetEmail(user.email, resetUrl);
    res.status(200).json(genericResponse);
  } catch (err) {
    res.status(500).json({ message: "Forgot password error", error: err.message });
  }
};

// 7. RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !user.resetPassword?.tokenHash || !user.resetPassword?.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired password reset request" });
    }

    if (new Date() > new Date(user.resetPassword.expiresAt)) {
      return res.status(400).json({ message: "Password reset link has expired" });
    }

    const isMatch = await bcrypt.compare(token, user.resetPassword.tokenHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPassword = undefined;
    user.refreshToken = undefined; // Invalidate all active sessions
    await user.save();

    res.status(200).json({ message: "Password reset successfully. Please log in with your new password." });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

// 8. GET ME
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    let developerInfo = null;

    if (user.role === "developer") {
      developerInfo = await Developer.findOne({ userId: user._id });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        bio: user.bio,
        socialLinks: user.socialLinks,
        developer: developerInfo,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "GetMe error", error: err.message });
  }
};
