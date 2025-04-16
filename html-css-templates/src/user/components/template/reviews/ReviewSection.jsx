import { useEffect, useState } from "react";
import API from "../../../userapi/userapi";
import { useAuth } from "../../../context/AuthContext";
import ReviewForm from "./ReviewForm";
import ReviewSummaryCompact from "./ReviewSummaryCompact";
import ReviewSummaryExpanded from "./ReviewSummaryExpanded";
import ReviewList from "./ReviewList";

const ReviewSection = ({ templateId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLoggedInUser = async () => {
    try {
      const res = await API.get("/user/me", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return res.data;
    } catch {
      return null;
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${templateId}`);
      setReviews(data);
      setAverageRating(
        data.length > 0
          ? (data.reduce((sum, r) => sum + r.rating, 0) / data.length).toFixed(1)
          : 0
      );

      if (user) {
        const currentUser = await fetchLoggedInUser();
        const existingReview = data.find((r) => r.user._id === currentUser.id);
        setUserReview(existingReview || null);
      }
    } catch (err) {
      console.error("Error loading reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await API.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEditingReview(null);
      await fetchReviews();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  useEffect(() => {
    if (templateId) fetchReviews();
  }, [templateId, user]);

  return (
    <div className="mt-12" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-4">User Reviews</h2>

      {showFullSummary ? (
        <ReviewSummaryExpanded
          averageRating={averageRating}
          reviews={reviews}
          onCollapse={() => setShowFullSummary(false)}
        />
      ) : (
        <ReviewSummaryCompact
          averageRating={averageRating}
          totalReviews={reviews.length}
          onExpand={() => setShowFullSummary(true)}
        />
      )}

      {user && !editingReview && (
        <ReviewForm
          templateId={templateId}
          refreshReviews={() => {
            fetchReviews();
          }}
        />
      )}

      {user && editingReview && (
        <ReviewForm
          templateId={templateId}
          userReview={editingReview}
          refreshReviews={() => {
            setEditingReview(null);
            fetchReviews();
          }}
          onCancel={() => setEditingReview(null)}
        />
      )}

      <ReviewList
        reviews={reviews}
        userReviewId={userReview?._id}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default ReviewSection;
