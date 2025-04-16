const ReviewSummaryExpanded = ({ averageRating, reviews, onCollapse }) => {
    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
  
    const total = reviews.length;
  
    return (
      <div className="bg-white p-6 rounded-md shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-4xl font-bold text-yellow-500">⭐ {averageRating}</div>
          <button
            onClick={onCollapse}
            className="text-blue-600 text-sm underline hover:text-blue-800"
          >
            Hide Summary
          </button>
        </div>
  
        {ratingCounts.map(({ star, count }) => {
          const percentage = total ? (count / total) * 100 : 0;
          return (
            <div key={star} className="mb-2 flex items-center gap-2">
              <span className="w-8 text-sm font-medium">{star}★</span>
              <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                <div
                  className="bg-yellow-400 h-3"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-sm text-right">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default ReviewSummaryExpanded;
  