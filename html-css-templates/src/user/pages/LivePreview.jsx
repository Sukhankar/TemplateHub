import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useCart } from "../context/CartContext";
import {
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
  FaArrowLeft,
  FaShoppingCart,
  FaExternalLinkAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const LivePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'

  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axiosInstance.get(`/templates/${id}`);
        setTemplate(res.data.template);
      } catch (err) {
        console.error("Failed to load live preview", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-sm">
          <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold">Template Not Found</h2>
          <p className="text-xs text-slate-400">The requested template demo does not exist.</p>
          <Link
            to="/templates"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Width container dimensions based on device frame
  const getDeviceWidth = () => {
    if (device === "tablet") return "max-w-[768px]";
    if (device === "mobile") return "max-w-[375px]";
    return "w-full";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Device Toolbar Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-40 text-white shrink-0">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/template/${template._id}`)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition font-medium"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4">
            <span className="font-bold text-sm text-white line-clamp-1">{template.title}</span>
            <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-md">
              {template.category}
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-2 rounded-lg text-xs transition ${
              device === "desktop" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
            title="Desktop View (100%)"
          >
            <FaDesktop />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`p-2 rounded-lg text-xs transition ${
              device === "tablet" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
            title="Tablet View (768px)"
          >
            <FaTabletAlt />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-2 rounded-lg text-xs transition ${
              device === "mobile" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
            title="Mobile View (375px)"
          >
            <FaMobileAlt />
          </button>
        </div>

        {/* Right: Buy / Add to Cart CTA */}
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-sm text-emerald-400">
            {template.isFree || template.price === 0 ? "FREE" : `$${template.price}`}
          </div>

          <button
            onClick={() => addToCart(template)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
              isInCart(template._id)
                ? "bg-emerald-500 text-slate-950 font-black"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40"
            }`}
          >
            <FaShoppingCart /> {isInCart(template._id) ? "In Cart" : "Buy Now"}
          </button>
        </div>
      </header>

      {/* Main Preview iFrame Container */}
      <main className="flex-1 bg-slate-900 flex justify-center items-center p-0 sm:p-4 overflow-hidden">
        {template.livePreviewUrl ? (
          <div
            className={`${getDeviceWidth()} h-full bg-white transition-all duration-300 ${
              device !== "desktop"
                ? "rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[840px]"
                : "w-full h-full"
            }`}
          >
            <iframe
              src={template.livePreviewUrl}
              title={template.title}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 max-w-md">
            <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No External Live Demo Available</h3>
            <p className="text-xs text-slate-400">
              The seller did not provide a live preview URL for this template.
            </p>
            <button
              onClick={() => navigate(`/template/${template._id}`)}
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Return to Product Details
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default LivePreview;
