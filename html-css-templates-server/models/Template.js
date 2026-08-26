import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const templateSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tempId: {
      type: String,
      unique: true,
      default: () => uuidv4().split("-")[0],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["landing-page", "portfolio", "ecommerce", "blog", "dashboard", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "archived"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    changelog: [
      {
        version: String,
        date: { type: Date, default: Date.now },
        notes: String,
      },
    ],
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    previewImages: [
      {
        type: String,
      },
    ],
    livePreviewUrl: {
      type: String,
      default: "",
    },
    sourceFileUrl: {
      type: String,
      required: true,
    },
    features: [String],
    techStack: [String],
    compatibility: {
      type: String,
      default: "All Modern Browsers",
    },
    license: {
      type: String,
      enum: ["personal", "commercial", "extended"],
      default: "personal",
    },
    tags: [String],
    downloadCount: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// MongoDB Atlas / Text index for search
templateSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Template", templateSchema);
