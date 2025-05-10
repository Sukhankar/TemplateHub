import { useState } from "react";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";

const TemplateCard = ({ template }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [likes, setLikes] = useState(template.totalLikes || 0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="w-80 rounded-xl overflow-hidden relative bg-white">
      {/* Image with overlay */}
      <div className="relative w-full h-48 overflow-hidden group cursor-pointer">
        <Link to={`/template/${template._id}`}>
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${template.image}`}
            alt={template.title}
            className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Featured badge */}
        {template.featured && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-semibold z-10">
            Featured
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <div className="flex justify-between items-center">
            <span className="text-black font-medium text-sm line-clamp-1">
              {template.title}
            </span>
            <div className="flex gap-2">
              <button
                className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition"
                onClick={async (e) => {
                  e.preventDefault();
                  if (liked) return; // Prevent multiple likes per session (basic)

                  try {
                    const res = await axios.patch(
                      `${import.meta.env.VITE_API_BASE_URL}/api/templates/${template._id}/like`
                    );
                    setLikes(res.data.totalLikes);
                    setLiked(true);
                  } catch (err) {
                    console.error("Failed to like template:", err);
                  }
                }}
                title="Like this template"
              >
                {liked ? (
                  <FaHeart className="text-red-500 text-md" />
                ) : (
                  <FaRegHeart className="text-gray-700 text-md" />
                )}
              </button>
              <button
                className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition"
                onClick={(e) => {
                  e.preventDefault(); // Prevent page reload
                  toggleWishlist(template);
                }}
                title={
                  isInWishlist(template._id)
                    ? "Remove from Bookmarks"
                    : "Add to Bookmarks"
                }
              >
                {isInWishlist(template._id) ? (
                  <FaBookmark className="text-blue-500 text-md" />
                ) : (
                  <FaRegBookmark className="text-gray-700 text-md" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with brand/team/likes/views */}
      <div className="flex justify-between items-center px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
            {template.title?.charAt(0) || "T"}
          </div>
          <span className="text-sm font-medium line-clamp-1">
            {template.brand || "Unknown"}
          </span>
          {template.team && (
            <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded font-semibold">
              TEAM
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-600 text-sm gap-3">
          <span>
            <FaHeart className="inline text-red-500 mr-1" />
            {likes}
          </span>
          <span>👁 {template.views || "0"}</span>
        </div>
      </div>

      {/* Bottom section with price & preview button */}
      <div className="px-4 pb-4 -mt-2">
        <div className="flex justify-between items-center">
          <span
            className={`text-sm font-semibold ${
              template.price === 0 ? "text-green-600" : "text-blue-600"
            }`}
          >
            {template.price === 0 ? "Free" : `₹${template.price}`}
          </span>
          <Link
            to={`/template/${template._id}`}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-md transition-all"
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;

