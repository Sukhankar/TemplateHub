import Review from "../models/Review.js";
import Template from "../models/Template.js";

// Helper function to update template rating metrics
const updateTemplateRatingMetrics = async (templateId) => {
  const reviews = await Review.find({ template: templateId });
  const totalReviews = reviews.length;
  const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 0;

  await Template.findByIdAndUpdate(templateId, {
    averageRating,
    totalReviews,
  });
};

// POST /api/reviews
export const createReview = async (req, res) => {
  const { templateId, rating, comment } = req.body;

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5 stars" });
    }

    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ message: "Comment must be at least 5 characters long" });
    }

    // Check for existing review from same user
    const existingReview = await Review.findOne({
      user: req.user._id,
      template: templateId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this template." });
    }

    const review = await Review.create({
      user: req.user._id,
      template: templateId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    await updateTemplateRatingMetrics(templateId);

    const populatedReview = await Review.findById(review._id).populate("user", "name profilePicture");

    res.status(201).json({ message: "Review added successfully", review: populatedReview });
  } catch (error) {
    console.error("❌ Review create error:", error);
    res.status(500).json({ message: "Failed to post review", error: error.message });
  }
};

// GET /api/reviews/:id
export const getTemplateReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ template: req.params.id })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (ratingBreakdown[r.rating] !== undefined) {
        ratingBreakdown[r.rating] += 1;
      }
    });

    res.status(200).json({
      reviews,
      total,
      ratingBreakdown,
    });
  } catch (error) {
    console.error("❌ Fetch reviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// PUT /api/reviews/:reviewId
export const updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this review" });
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment.trim();
    await review.save();

    await updateTemplateRatingMetrics(review.template);

    res.status(200).json({ message: "Review updated", review });
  } catch (error) {
    console.error("❌ Review update error:", error);
    res.status(500).json({ message: "Failed to update review", error: error.message });
  }
};
