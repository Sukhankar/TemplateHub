import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import API from "../userapi/userapi";

const TemplateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, addDownload } = useAuth();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    AOS.init({ duration: 800 });
    const fetchTemplate = async () => {
      try {
        if (!id) {
          throw new Error("Template ID is undefined");
        }
        const { data } = await API.get(`/templates/${id}`);
        setTemplate(data);
      } catch (error) {
        console.error('Error fetching template:', error);
        setError(error.message || "Failed to load template");
        navigate("/templates");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchTemplate();
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id, navigate]);

  const handlePreview = async () => {
    if (!template?._id) return;
    
    try {
      const { data } = await API.get(`/preview/${template._id}`);
      setPreviewUrl(data.previewUrl);
    } catch (error) {
      console.error('Error fetching preview:', error);
      alert("Failed to load preview");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please login to purchase templates.");
      navigate("/login");
      return;
    }
    addToCart(template);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }
    addToCart(template);
  };

  const handleDownload = () => {
    if (!user) {
      alert("Please log in to download this template.");
      navigate("/login");
      return;
    }
    addDownload(template._id);
    window.location.href = template.zipfile;
  };

  if (loading) {
    return <div className="text-center py-10">Loading template...</div>;
  }

  if (error || !template) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error || "Template not found"}</div>
        <button
          className="text-blue-600 underline"
          onClick={() => navigate("/templates")}
        >
          ← Back to Templates
        </button>
      </div>
    );
  }

  const imageHeight = Math.min(windowSize.height * 0.6, 600);
  const imageWidth = Math.min(windowSize.width * 0.8, 1200);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <button
          className="mb-4 text-blue-600 underline"
          onClick={() => navigate("/templates")}
        >
          ← Back to Templates
        </button>

        <div className="grid md:grid-cols-2 gap-10 items-start" data-aos="fade-up">
          <img
            src={template.image}
            alt={template.title}
            className="rounded-xl shadow-lg"
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
              objectFit: 'cover'
            }}
          />

          <div>
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

            <div className="flex gap-4">
              {template.price === 0 ? (
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
                >
                  Download Free
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
                  >
                    Buy Now
                  </button>
                </>
              )}
              <button
                onClick={handlePreview}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
                >
                  Live Preview
                </button>
              </div>

              {previewUrl && (
                <div className="mt-6 border rounded overflow-hidden">
                  <iframe
                    src={previewUrl}
                    title="Template Preview"
                    style={{
                      width: `${imageWidth}px`,
                      height: `${imageHeight}px`
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Related Templates */}
          <div className="mt-12" data-aos="fade-up">
            <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {template.relatedTemplates?.map((related) => (
                <div
                  key={related._id}
                  className="min-w-[220px] bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-bold truncate">{related.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{related.category}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">
                        {related.price === 0 ? "Free" : `$${related.price}`}
                      </span>
                      <button
                        onClick={() => navigate(`/template/${related._id}`)}
                        className="text-blue-500 text-xs underline"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  };

  export default TemplateDetails;
