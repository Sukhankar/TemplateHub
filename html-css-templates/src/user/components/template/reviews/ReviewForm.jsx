import { useState, useEffect } from "react";
import API from "../../../userapi/userapi";
import { useAuth } from "../../../context/AuthContext";

const ReviewForm = ({ templateId, userReview, refreshReviews, onCancel }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(userReview?.rating || 5);
  const [comment, setComment] = useState(userReview?.comment || "");
  const editing = Boolean(userReview);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editing ? `/reviews/${userReview._id}` : "/reviews";

    try {
      await API[editing ? "put" : "post"](
        endpoint,
        editing
          ? { rating, comment }
          : { templateId, rating, comment, userId: user.id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setComment("");
      setRating(5);
      refreshReviews();
      if (onCancel) onCancel();
    } catch (err) {
      console.error("Review submission failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-2">
        {editing ? "Update your review" : "Leave a Review"}
      </h3>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full border rounded mb-4 p-2"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded mb-4 p-2"
        placeholder="Write your review..."
        rows={3}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editing ? "Update Review" : "Submit Review"}
      </button>
      {editing && (
        <button
          type="button"
          onClick={onCancel}
          className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ReviewForm;
