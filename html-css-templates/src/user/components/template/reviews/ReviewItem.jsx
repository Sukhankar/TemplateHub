import { useState, useRef, useEffect } from "react";

const ReviewItem = ({ review, isUserReview, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <li className="relative bg-gray-50 p-4 rounded-md shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">
            {review.user.name}
            {isUserReview && <span className="ml-2 text-blue-600">📝 You reviewed this</span>}
          </div>
          <span className="text-yellow-500 text-sm">
            {"⭐".repeat(review.rating)}
          </span>
          <p className="text-gray-700 mt-2">{review.comment}</p>
        </div>

        {isUserReview && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none text-xl px-2"
              title="Options"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-28 bg-white border rounded shadow-md">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(review);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  ✏️ Update
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(review._id);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

export default ReviewItem;
