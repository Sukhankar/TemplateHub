import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "developer", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      hash: { type: String },
      expiresAt: { type: Date },
    },
    resetPassword: {
      tokenHash: { type: String },
      expiresAt: { type: Date },
    },
    refreshToken: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    socialLinks: {
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    likedTemplates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

