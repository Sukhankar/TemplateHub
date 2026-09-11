import { FaBookmark, FaRegBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";

const TemplateInfo = ({ template, user, isInWishlist, toggleWishlist, navigate }) => {
  const [likes, setLikes] = useState(template.totalLikes || 0);
  const [liked, setLiked] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">{template.title}</h1>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              if (!user) {
                alert("Please login to like templates.");
                navigate("/login");
                return;
              }
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
            className="text-red-500 hover:scale-110 transition-transform duration-200"
          >
            {liked ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-400 text-xl" />
            )}
          </button>
          <button
            onClick={() => {
              if (!user) {
                alert("Please login to manage your bookmarks.");
                navigate("/login");
                return;
              }
              toggleWishlist(template);
            }}
            title={isInWishlist(template._id) ? "Remove from Bookmarks" : "Add to Bookmarks"}
            className="text-blue-500 hover:scale-110 transition-transform duration-200"
          >
            {isInWishlist(template._id) ? (
              <FaBookmark className="text-blue-500 text-xl" />
            ) : (
              <FaRegBookmark className="text-gray-400 text-xl" />
            )}
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{template.description}</p>
      <span className="inline-block bg-gray-200 px-3 py-1 rounded text-sm mb-2">
        {template.category}
      </span>
      <p className="text-2xl font-semibold text-green-600 mb-6">
        {template.price === 0 ? "Free" : `₹${template.price}`}
      </p>

      <h2 className="text-xl font-semibold mb-2">What's included</h2>
      <ul className="list-disc list-inside mb-6 text-gray-700">
        {(template.features || []).map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </>
  );
};

export default TemplateInfo;
