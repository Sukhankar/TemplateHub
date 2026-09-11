import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaExternalLinkAlt,
  FaCheck,
  FaDownload,
  FaShieldAlt,
  FaCode,
  FaStore,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";

const TemplateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], total: 0, ratingBreakdown: {} });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // License multiplier state
  const [license, setLicense] = useState("personal");

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewErr, setReviewErr] = useState("");

  const { addToCart, isInCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [tplRes, revRes] = await Promise.all([
          axiosInstance.get(`/templates/${id}`),
          axiosInstance.get(`/reviews/${id}`),
        ]);

        setData(tplRes.data);
        setReviewsData(revRes.data);

        const imgs = tplRes.data.template?.previewImages || [];
        if (imgs.length > 0) {
          setSelectedImage(imgs[0]);
        }
      } catch (err) {
        console.error("Error loading template details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const template = data?.template;
  const developerStore = data?.developerStore;
  const relatedTemplates = data?.relatedTemplates || [];

  const isWishlisted = wishlist?.some((item) => item._id === template?._id);

  // License price calculation
  const getLicensePrice = () => {
    if (!template || template.isFree || template.price === 0) return 0;
    if (license === "commercial") return template.price * 2;
    if (license === "extended") return template.price * 5;
    return template.price;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");

    setReviewSubmitting(true);
    setReviewMsg("");
    setReviewErr("");

    try {
      const res = await axiosInstance.post("/reviews", {
        templateId: id,
        rating: newRating,
        comment: newComment,
      });

      setReviewMsg(res.data.message || "Review submitted successfully!");
      setNewComment("");

      // Refresh reviews list
      const revRes = await axiosInstance.get(`/reviews/${id}`);
      setReviewsData(revRes.data);
    } catch (err) {
      setReviewErr(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Template Not Found</h2>
          <p className="text-xs text-slate-500">The template you are looking for does not exist or has been removed.</p>
          <Link to="/templates" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const computedPrice = getLicensePrice();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Check out "${template.title}" on TemplateHub!`);

  // Structured Data Schema for Google Rich Snippets
  const jsonLdSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: template.title,
    image: template.previewImages || [template.image],
    description: template.description,
    sku: template._id,
    category: template.category,
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "USD",
      price: template.isFree ? "0.00" : computedPrice,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: template.averageRating || 5.0,
      reviewCount: template.totalReviews || 1,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <SEO
        title={template.title}
        description={template.description}
        image={template.previewImages?.[0]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Header Breadcrumb */}
      <section className="pt-24 pb-6 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/templates" className="hover:text-indigo-400">Marketplace</Link>
            <span>/</span>
            <span className="capitalize text-indigo-300 font-semibold">{template.category}</span>
            <span>/</span>
            <span className="text-slate-200">{template.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{template.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                  <FaStore /> {developerStore?.storeName || template.sellerId?.name || "Verified Developer"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <FaStar /> {template.averageRating ? template.averageRating.toFixed(1) : "New"} ({template.totalReviews || 0} reviews)
                </span>
                <span>•</span>
                <span>{template.downloadCount || 0} Downloads</span>
              </div>

              {/* Social Share Bar */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400">Share:</span>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition relative"
                  title="Copy link"
                >
                  <FaLink />
                  {copied && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-sky-600 text-slate-200 rounded-lg text-xs transition"
                  title="Share on Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-blue-700 text-slate-200 rounded-lg text-xs transition"
                  title="Share on LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-200 rounded-lg text-xs transition"
                  title="Share on Facebook"
                >
                  <FaFacebook />
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 rounded-lg text-xs transition"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {template.livePreviewUrl && (
              <Link
                to={`/preview/${template._id}`}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition self-start md:self-auto"
              >
                <FaExternalLinkAlt /> Live Demo Preview
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Lightbox & Tabs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshot Lightbox Gallery */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative">
                <img
                  src={selectedImage || template.previewImages?.[0] || "/placeholder.jpg"}
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {template.previewImages && template.previewImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {template.previewImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-24 aspect-video rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === img
                          ? "border-indigo-600 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-600 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-3.5 transition whitespace-nowrap ${
                    activeTab === "overview"
                      ? "border-b-2 border-indigo-600 text-indigo-600 bg-white"
                      : "hover:text-slate-900"
                  }`}
                >
                  Overview & Features
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-6 py-3.5 transition whitespace-nowrap ${
                    activeTab === "specs"
                      ? "border-b-2 border-indigo-600 text-indigo-600 bg-white"
                      : "hover:text-slate-900"
                  }`}
                >
                  Tech Specifications
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-3.5 transition whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "border-b-2 border-indigo-600 text-indigo-600 bg-white"
                      : "hover:text-slate-900"
                  }`}
                >
                  Reviews ({reviewsData.total})
                </button>
              </div>

              <div className="p-6 text-sm text-slate-700">
                {/* Tab 1: Overview */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 mb-2">Description</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {template.description}
                      </p>
                    </div>

                    {template.features && template.features.length > 0 && (
                      <div>
                        <h3 className="font-bold text-base text-slate-900 mb-3">Key Features</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {template.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <FaCheck className="text-emerald-500 text-xs shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Specs */}
                {activeTab === "specs" && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-semibold">Tech Stack</span>
                        <div className="font-bold text-slate-900">
                          {template.techStack?.join(", ") || "HTML, CSS, JS"}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-semibold">Browser Support</span>
                        <div className="font-bold text-slate-900">{template.compatibility}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-semibold">License Model</span>
                        <div className="font-bold text-slate-900 capitalize">{template.license} License</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-semibold">Version</span>
                        <div className="font-bold text-slate-900">{template.version || "1.0.0"}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Reviews */}
                {activeTab === "reviews" && (
                  <div className="space-y-8">
                    {/* Write a Review Form */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <h4 className="font-bold text-sm text-slate-900">Leave a Rating & Review</h4>

                      {reviewErr && (
                        <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
                          {reviewErr}
                        </div>
                      )}

                      {reviewMsg && (
                        <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-medium">
                          {reviewMsg}
                        </div>
                      )}

                      <form onSubmit={handleReviewSubmit} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">Rating:</span>
                          <div className="flex items-center gap-1 text-amber-400 cursor-pointer">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={star <= newRating ? "text-amber-400" : "text-slate-300"}
                                onClick={() => setNewRating(star)}
                              />
                            ))}
                          </div>
                        </div>

                        <textarea
                          rows={3}
                          placeholder="Write your detailed experience with this template..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                          required
                        />

                        <button
                          type="submit"
                          disabled={reviewSubmitting || !newComment}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                        >
                          {reviewSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviewsData.reviews?.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">
                          No reviews yet for this template. Be the first to leave a review!
                        </p>
                      ) : (
                        reviewsData.reviews.map((rev) => (
                          <div key={rev._id} className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">
                                  {rev.user?.name?.[0] || "U"}
                                </div>
                                <span className="font-bold text-xs text-slate-900">{rev.user?.name || "Buyer"}</span>
                              </div>
                              <div className="flex items-center text-amber-400 text-xs">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <FaStar key={i} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600">{rev.comment}</p>
                            <span className="text-[10px] text-slate-400 block">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Purchase Sidebar Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6 sticky top-24">
              {/* Price Tag */}
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">License Price</span>
                <div className="font-black text-3xl text-slate-900">
                  {template.isFree || computedPrice === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `$${computedPrice}`
                  )}
                </div>
              </div>

              {/* License Radio Selector */}
              {!template.isFree && template.price > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Select License</label>
                  <div className="space-y-2">
                    <label
                      onClick={() => setLicense("personal")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                        license === "personal"
                          ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-900 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div>Personal License</div>
                        <div className="text-[10px] text-slate-400 font-normal">Single website end-product</div>
                      </div>
                      <span>${template.price}</span>
                    </label>

                    <label
                      onClick={() => setLicense("commercial")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                        license === "commercial"
                          ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-900 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div>Commercial License</div>
                        <div className="text-[10px] text-slate-400 font-normal">Unlimited client projects</div>
                      </div>
                      <span>${template.price * 2}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => addToCart({ ...template, selectedLicense: license, calculatedPrice: computedPrice })}
                  className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition ${
                    isInCart(template._id)
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                  }`}
                >
                  <FaShoppingCart /> {isInCart(template._id) ? "Added to Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={() =>
                    isWishlisted(template._id)
                      ? removeFromWishlist(template._id)
                      : addToWishlist(template)
                  }
                  className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition"
                >
                  {isWishlisted(template._id) ? (
                    <>
                      <FaHeart className="text-rose-500" /> Saved in Wishlist
                    </>
                  ) : (
                    <>
                      <FaRegHeart /> Add to Wishlist
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-indigo-600 text-sm" /> 100% Virus & Malware Free Source Files
                </div>
                <div className="flex items-center gap-2">
                  <FaCode className="text-indigo-600 text-sm" /> Lifetime Free Updates & Code Maintenance
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TemplateDetails;
