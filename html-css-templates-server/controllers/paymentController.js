import Order from "../models/Order.js";
import Template from "../models/Template.js";
import Developer from "../models/DeveloperModel.js";
import { createNotificationHelper } from "./notificationController.js";
import { sendOrderConfirmationEmail, sendSaleNotificationEmail } from "../services/emailService.js";
import path from "path";
import fs from "fs";

// POST /api/payment/create-order
export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod = "card", billingDetails } = req.body;
    const buyerId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const template = await Template.findById(item._id || item.templateId);
      if (!template) {
        return res.status(404).json({ message: `Template not found: ${item.title || item._id}` });
      }

      const price = template.isFree ? 0 : item.calculatedPrice || item.price || template.price;
      totalAmount += price;

      orderItems.push({
        template: template._id,
        seller: template.sellerId || req.user._id,
        price,
        license: item.selectedLicense || item.license || "personal",
        title: template.title,
      });
    }

    // 20% Platform Fee, 80% Seller Share
    const platformFee = Number((totalAmount * 0.2).toFixed(2));
    const sellerEarnings = Number((totalAmount * 0.8).toFixed(2));

    const paymentId = "PAY-" + Date.now() + "-" + Math.round(Math.random() * 1e6);

    const order = await Order.create({
      buyer: buyerId,
      items: orderItems,
      totalAmount,
      platformFee,
      sellerEarnings,
      paymentMethod,
      paymentId,
      paymentStatus: "completed",
      billingDetails: billingDetails || {
        name: req.user.name,
        email: req.user.email,
      },
    });

    // Update purchase counts and developer balances + send notifications
    for (const item of orderItems) {
      await Template.findByIdAndUpdate(item.template, {
        $inc: { purchaseCount: 1, downloadCount: 1 },
      });

      if (item.price > 0 && item.seller) {
        const itemSellerEarnings = Number((item.price * 0.8).toFixed(2));
        await Developer.findOneAndUpdate(
          { userId: item.seller },
          { $inc: { totalEarnings: itemSellerEarnings, totalSales: 1 } },
          { upsert: true }
        );

        // Notify Seller of Sale
        await createNotificationHelper({
          recipient: item.seller,
          type: "template_sale",
          title: "New Sale! 🎉",
          message: `Your template "${item.title}" was purchased for $${item.price}. You earned $${itemSellerEarnings}.`,
          link: "/developer/earnings",
        });
      }
    }

    // Notify Buyer of Purchase
    await createNotificationHelper({
      recipient: buyerId,
      type: "order_placed",
      title: "Order Confirmed! 🛒",
      message: `Your purchase #${paymentId} for $${totalAmount} has been processed. Download files now!`,
      link: "/my-purchases",
    });

    // Send Buyer Email
    sendOrderConfirmationEmail(req.user.email, order).catch((e) => console.error(e));

    const populatedOrder = await Order.findById(order._id).populate("items.template");

    res.status(201).json({
      message: "Payment processed and order placed successfully!",
      orderId: order._id,
      order: populatedOrder,
    });
  } catch (error) {
    console.error("❌ Payment create error:", error);
    res.status(500).json({ message: "Payment creation failed", error: error.message });
  }
};

// GET /api/payment/orders (User Purchases)
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id, paymentStatus: "completed" })
      .populate("items.template")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

// GET /api/payment/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id })
      .populate("items.template")
      .populate("buyer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order receipt not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payment/download/:templateId (VERIFIED DOWNLOAD)
export const downloadTemplateSource = async (req, res) => {
  try {
    const { templateId } = req.params;
    const userId = req.user._id;

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Free templates are downloadable by any logged-in user
    if (!template.isFree && template.price > 0) {
      const hasPurchased = await Order.findOne({
        buyer: userId,
        paymentStatus: "completed",
        "items.template": templateId,
      });

      if (!hasPurchased && req.user.role !== "admin" && String(template.sellerId) !== String(userId)) {
        return res.status(403).json({
          message: "Purchase required. You must purchase this template before downloading.",
        });
      }
    }

    // Track download metric
    await Template.findByIdAndUpdate(templateId, { $inc: { downloadCount: 1 } });

    res.status(200).json({
      message: "Download authorized",
      title: template.title,
      sourceFileUrl: template.sourceFileUrl || template.zipfile || "/uploads/sample-template.zip",
    });
  } catch (error) {
    console.error("❌ Error authorizing download:", error);
    res.status(500).json({ message: "Download authorization failed" });
  }
};
