import { FaHeart, FaRegHeart } from "react-icons/fa";

const TemplateInfo = ({ template, user, isInWishlist, toggleWishlist, navigate }) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-4xl font-bold">{template.title}</h1>
      <button
        onClick={() => {
          if (!user) {
            alert("Please login to manage your wishlist.");
            navigate("/login");
            return;
          }
          toggleWishlist(template);
        }}
        title={isInWishlist(template._id) ? "Remove from Wishlist" : "Add to Wishlist"}
        className="text-red-500 hover:scale-110 transition-transform duration-200"
      >
        {isInWishlist(template._id) ? (
          <FaHeart className="text-red-500 text-xl" />
        ) : (
          <FaRegHeart className="text-gray-400 text-xl" />
        )}
      </button>
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

export default TemplateInfo;
