import Review from "../models/Review.js";

// Create new review
export const createReview = async (req, res) => {
  const { templateId, rating, comment } = req.body;

  try {
    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Create and save new review
    const review = new Review({
      user: req.user._id,
      template: templateId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    console.error("❌ Review create error:", error);
    res.status(500).json({ 
      message: "Failed to post review", 
      error: error.message 
    });
  }
};

// Get all reviews for a template
export const getTemplateReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ template: req.params.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Fetch reviews error:", error);
    res.status(500).json({ 
      message: "Failed to fetch reviews", 
      error: error.message 
    });
  }
};

// Update existing review
export const updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    // Find review and validate ownership
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is the owner of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this review" });
    }

    // Update review fields
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({ message: "Review updated", review });
  } catch (error) {
    console.error("❌ Review update error:", error);
    res.status(500).json({ 
      message: "Failed to update review", 
      error: error.message 
    });
  }
};
