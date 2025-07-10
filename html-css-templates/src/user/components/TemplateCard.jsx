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
<div className="w-full max-w-sm sm:max-w-full md:max-w-sm mx-auto rounded-xl overflow-hidden relative bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md">
  {/* Image with overlay */}
  <div className="relative w-full h-48 sm:h-56 md:h-48 overflow-hidden group cursor-pointer">
    <Link to={`/template/${template._id}`}>
      <img
        src={`${import.meta.env.VITE_API_BASE_URL}${template.image}`}
        alt={template.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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
      <div className="flex justify-between items-center w-full">
        <span className="text-black font-medium text-sm truncate max-w-[120px] sm:max-w-[160px] md:max-w-[120px]">
          {template.title}
        </span>
        <div className="flex gap-2">
          <button
            className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition"
            onClick={async (e) => {
              e.preventDefault();
              if (liked) return;
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
              e.preventDefault();
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

      {/* Full area navigation */}
 {/* Middle‐band navigation only */}
<Link
  to={`/template/${template._id}`}
  aria-label={`View details of ${template.title}`}
  className="absolute left-0 w-full" 
  style={{ top: '25%', height: '50%' }}
/>

    </div>
  </div>

  {/* Footer with brand/team/likes/views */}
  <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 text-sm sm:text-base">
    <div className="flex items-center gap-2 flex-wrap">
      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
        {template.title?.charAt(0) || "T"}
      </div>
      <span className="font-medium truncate max-w-[100px]">
        {template.brand || "Unknown"}
      </span>
      {template.team && (
        <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded font-semibold">
          TEAM
        </span>
      )}
    </div>

    <div className="flex items-center text-gray-600 gap-3 text-xs sm:text-sm">
      <span className="flex items-center gap-1">
        <FaHeart className="text-red-500" />
        {likes}
      </span>
      <span className="flex items-center gap-1">
        👁 {template.views || "0"}
      </span>
    </div>
  </div>

  {/* Bottom section with price & preview button */}
  <div className="px-4 pb-4 -mt-2 bg-gradient-to-br from-indigo-50 to-purple-50">
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
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-md transition-all whitespace-nowrap"
      >
        Preview
      </Link>
    </div>
  </div>
</div>

  );
};

export default TemplateCard;
