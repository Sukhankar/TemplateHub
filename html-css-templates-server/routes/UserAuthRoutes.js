import express from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import {
  register,
  verifyEmail,
  resendOTP,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/UserAuthController.js";
import { protect } from "../middleware/UserAuthMiddleware.js";

const router = express.Router();

// Helper middleware for validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5,
  message: { message: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: "Too many registration attempts. Please try again later." },
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: "Too many password reset requests. Please try again later." },
});

// Routes
router.post(
  "/register",
  registerLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
    body("role").optional().isIn(["user", "developer"]).withMessage("Invalid role"),
  ],
  validate,
  register
);

router.post(
  "/verify-email",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  ],
  validate,
  verifyEmail
);

router.post(
  "/resend-otp",
  [body("email").isEmail().withMessage("Valid email is required").normalizeEmail()],
  validate,
  resendOTP
);

router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.post(
  "/forgot-password",
  forgotLimiter,
  [body("email").isEmail().withMessage("Valid email is required").normalizeEmail()],
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("token").notEmpty().withMessage("Reset token is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
  ],
  validate,
  resetPassword
);

router.get("/me", protect, getMe);

export default router;
