import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import API from "../userapi/userapi";
import Loader from "../components/Loading";

import ImageDisplay from "../components/template/ImageDisplay";
import TemplateInfo from "../components/template/TemplateInfo";
import TemplateActions from "../components/template/TemplateActions";
import LivePreview from "../components/template/LivePreview";
import RelatedTemplates from "../components/template/RelatedTemplates";
import BackButton from "../components/template/BackButton";
import ReviewSection from "../components/template/reviews/ReviewSection";

const TemplateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, addDownload } = useAuth();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const imageHeight = Math.min(windowSize.height * 0.6, 600);
  const imageWidth = Math.min(windowSize.width * 0.8, 1200);

  useEffect(() => {
    AOS.init({ duration: 800 });

    const fetchTemplate = async () => {
      try {
        if (!id) throw new Error("Template ID is undefined");
        const { data } = await API.get(`/templates/${id}`);
        setTemplate({
          ...data,
          image: `${import.meta.env.VITE_API_BASE_URL}${data.image}`,
          zipfile: `${data.zipfile}`
        });
      } catch (error) {
        console.error("Error fetching template:", error);
        setError(error.message || "Failed to load template");
        navigate("/templates");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id, navigate]);

  const handlePreview = () => {
    if (template.demoUrl) {
      window.open(template.demoUrl, "_blank");
    } else {
      alert("Demo URL not available.");
    }
  };

  const handleBuyNow = () => {
    if (!user) return alert("Login first"), navigate("/login");
    addToCart(template);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    if (!user) return alert("Login first"), navigate("/login");
    addToCart(template);
  };

  const handleDownload = () => {
    if (!user) return alert("Login to download"), navigate("/login");
    addDownload(template._id);
    window.location.href = template.zipfile;
  };

  if (loading) return <Loader />;

  if (error || !template) {
    return (
      <div className="text-center py-10 bg-white">
        <div className="text-red-500 mb-4">{error || "Template not found"}</div>
        <BackButton navigate={navigate} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10 bg-white">
        <BackButton navigate={navigate} />
        <div className="grid md:grid-cols-2 gap-10 items-start" data-aos="fade-up">
          <ImageDisplay
            image={template.image}
            title={template.title}
            width={imageWidth}
            height={imageHeight}
          />
          <div>
            <TemplateInfo
              template={template}
              user={user}
              isInWishlist={isInWishlist}
              toggleWishlist={toggleWishlist}
              navigate={navigate}
            />
            <TemplateActions
              user={user}
              template={template}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              handleDownload={handleDownload}
              handlePreview={handlePreview}
            />
            <LivePreview/>
          </div>
        </div>
        <RelatedTemplates templates={template.relatedTemplates || []} navigate={navigate} />
        <ReviewSection templateId={template._id} />
      </div>
      <Footer />
    </>
  );
};

export default TemplateDetails;
