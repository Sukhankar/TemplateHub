import mongoose from "mongoose";

const developerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    storeDescription: {
      type: String,
      default: "",
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    stripeAccountId: {
      type: String,
      default: "",
    },
    razorpayAccountId: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    bankDetails: {
      type: String, // Encrypted payload or tokenized details
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Developer", developerSchema);
