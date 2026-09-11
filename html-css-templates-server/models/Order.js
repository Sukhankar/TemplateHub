import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        template: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Template",
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        license: {
          type: String,
          enum: ["personal", "commercial", "extended"],
          default: "personal",
        },
        title: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    sellerEarnings: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "razorpay", "card", "paypal", "mock"],
      default: "card",
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },
    billingDetails: {
      name: String,
      email: String,
      address: String,
      country: String,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
