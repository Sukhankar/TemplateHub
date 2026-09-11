import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  downloadTemplateSource,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/UserAuthMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/create-order", createOrder);
router.get("/orders", getUserOrders);
router.get("/orders/:id", getOrderById);
router.get("/download/:templateId", downloadTemplateSource);

export default router;
