import { useState } from "react";
import ReviewItem from "./ReviewItem";

const ReviewList = ({ reviews, userReviewId, onEdit, onDelete, loading }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews yet.</p>;

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {visibleReviews.map((review) => (
          <ReviewItem
            key={review._id}
            review={review}
            isUserReview={review._id === userReviewId}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="bg-gray-100 text-sm text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
