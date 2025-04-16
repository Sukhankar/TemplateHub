const ReviewSummaryCompact = ({ averageRating, totalReviews, onExpand }) => (
  <div
    onClick={onExpand}
    className="bg-white p-4 rounded-md shadow-md mb-6 cursor-pointer hover:bg-gray-50 transition"
  >
    <div className="flex items-center gap-4">
      <div className="text-4xl font-bold text-yellow-500">⭐ {averageRating}</div>
      <div className="text-gray-600">
        <p className="text-xl">{totalReviews} Reviews</p>
        <p className="text-sm text-gray-500">Click to view detailed summary</p>
      </div>
    </div>
  </div>
);

export default ReviewSummaryCompact;
