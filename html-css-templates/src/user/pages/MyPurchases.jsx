import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaDownload, FaShoppingBag, FaFileInvoice, FaExternalLinkAlt, FaStar } from "react-icons/fa";

const MyPurchases = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axiosInstance.get("/payment/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPurchases();
  }, [user]);

  const handleDownload = async (templateId) => {
    setDownloadingId(templateId);
    try {
      const res = await axiosInstance.get(`/payment/download/${templateId}`);
      if (res.data.sourceFileUrl) {
        window.open(res.data.sourceFileUrl, "_blank");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <section className="pt-28 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <h1 className="text-3xl font-black">My Purchased Templates</h1>
          <p className="text-xs text-slate-400">
            Access, redownload, and review all your purchased website source files anytime.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
            <FaShoppingBag className="text-4xl text-indigo-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">No Purchases Found</h3>
            <p className="text-xs text-slate-500">
              You have not purchased any website templates yet.
            </p>
            <Link
              to="/templates"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Order #{order.paymentId}</span>
                    <span className="text-slate-400 block sm:inline sm:ml-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 text-sm">
                      Total: ${order.totalAmount}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase border border-emerald-200">
                      Paid
                    </span>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items?.map((item, idx) => {
                    const tpl = item.template || {};
                    return (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={tpl.previewImages?.[0] || tpl.image || "/placeholder.jpg"}
                            alt={item.title}
                            className="w-16 h-12 object-cover rounded-xl border border-slate-200 bg-white"
                          />
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                              {item.title || tpl.title}
                            </h5>
                            <span className="text-[10px] text-slate-500 capitalize">
                              License: {item.license || "Personal"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {tpl._id && (
                            <Link
                              to={`/template/${tpl._id}`}
                              className="p-2 text-slate-400 hover:text-indigo-600 text-xs"
                              title="Leave a Review"
                            >
                              <FaStar />
                            </Link>
                          )}

                          <button
                            onClick={() => handleDownload(tpl._id || item.template)}
                            disabled={downloadingId === (tpl._id || item.template)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5 shadow-md transition"
                          >
                            <FaDownload /> Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyPurchases;
