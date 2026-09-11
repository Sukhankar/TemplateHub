import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { FaCheckCircle, FaDownload, FaShoppingBag, FaArrowRight, FaFileInvoice } from "react-icons/fa";

const PurchaseSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, orderId } = location.state || {};

  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (templateId) => {
    setDownloadingId(templateId);
    try {
      const res = await axiosInstance.get(`/payment/download/${templateId}`);
      if (res.data.sourceFileUrl) {
        window.open(res.data.sourceFileUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to fetch download link:", err);
      alert(err.response?.data?.message || "Download failed. Please check your purchases tab.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (!order && !orderId) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <FaCheckCircle className="text-4xl text-emerald-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Thank You for Your Order</h2>
          <p className="text-xs text-slate-500">
            You can access all your purchased template files directly in your purchases portal.
          </p>
          <Link
            to="/my-purchases"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            Go to My Purchases
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <section className="pt-28 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center text-3xl mx-auto">
            <FaCheckCircle />
          </div>
          <h1 className="text-3xl font-black">Payment & Purchase Successful!</h1>
          <p className="text-xs text-slate-400">
            Transaction ID: <span className="font-mono text-emerald-400 font-bold">{order?.paymentId || orderId}</span>
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold">Order Receipt</span>
              <h3 className="text-lg font-bold text-slate-900">Summary & Downloads</h3>
            </div>
            <div className="text-xs text-slate-500">
              Total Amount: <span className="font-black text-slate-900 text-base">${order?.totalAmount || 0}</span>
            </div>
          </div>

          {/* Purchased Items List with Direct Downloads */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-700 uppercase">Purchased Items</h4>
            {order?.items?.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div>
                  <h5 className="font-bold text-sm text-slate-900">{item.title || item.template?.title}</h5>
                  <span className="text-[11px] text-slate-500 capitalize">
                    License: {item.license || "Personal"} • Price: ${item.price}
                  </span>
                </div>

                <button
                  onClick={() => handleDownload(item.template?._id || item.template)}
                  disabled={downloadingId === (item.template?._id || item.template)}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <FaDownload /> {downloadingId === (item.template?._id || item.template) ? "Authorizing..." : "Download Source ZIP"}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/my-purchases"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs text-center shadow-md transition"
            >
              <FaShoppingBag className="inline mr-2" /> View All My Purchases
            </Link>

            <Link
              to="/templates"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
            >
              Continue Shopping <FaArrowRight />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PurchaseSuccess;
