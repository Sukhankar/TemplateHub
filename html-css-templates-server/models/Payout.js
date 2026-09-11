import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    developerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 50,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "processed"],
      default: "pending",
    },
    payoutMethod: {
      type: String,
      enum: ["stripe", "razorpay", "bank_transfer"],
      default: "bank_transfer",
    },
    accountDetails: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payout", payoutSchema);
