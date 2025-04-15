import { useWishlist } from "../context/WishlistContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const TemplateCard = ({ template }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate(`/template/${template._id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] duration-300 ease-in-out relative" data-aos="fade-up">
      {template.featured && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-semibold">
          Featured
        </span>
      )}
      <Link to={`/template/${template._id}`}>
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{template.title}</h3>
          <button 
            className="text-red-500 hover:scale-110 transition-transform duration-200"
            onClick={() => toggleWishlist(template)}
            title={isInWishlist(template._id) ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isInWishlist(template._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
        <div className="flex justify-between items-center">
          <span className={`text-lg font-semibold ${template.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
            {template.price === 0 ? 'Free' : `₹${template.price}`}
          </span>
          <button 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-md transition-all"
            onClick={handlePreview}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;