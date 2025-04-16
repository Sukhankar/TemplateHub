import express from "express";
import { 
  createReview, 
  getTemplateReviews,
  updateReview 
} from "../controllers/reviewController.js";
import { protect } from "../middleware/UserAuthMiddleware.js";

const router = express.Router();

// Create new review (protected route)
router.post("/", protect, createReview);

// Get all reviews for a specific template
router.get("/:id", getTemplateReviews);

// Update existing review (protected route)
router.put("/:reviewId", protect, updateReview);

export default router;
