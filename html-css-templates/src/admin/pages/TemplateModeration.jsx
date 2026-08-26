import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axiosInstance from "../../user/utils/axiosInstance";
import { FaCheck, FaTimes, FaExternalLinkAlt, FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

const TemplateModeration = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("pending");

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/templates", {
        params: { status: activeStatus },
      });
      setTemplates(res.data.templates || []);
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [activeStatus]);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/admin/templates/${id}/approve`);
      fetchTemplates();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason for developer:", "File validation issue");
    if (!reason) return;

    try {
      await axiosInstance.put(`/admin/templates/${id}/reject`, { rejectionReason: reason });
      fetchTemplates();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <AdminNavbar />

      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-1">
          <h1 className="text-2xl font-black text-white">Template Moderation Queue</h1>
          <p className="text-xs text-slate-400">
            Review uploaded templates, inspect live previews, and approve or reject submissions.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Status Tabs */}
        <div className="flex border-b border-slate-800 text-xs font-bold text-slate-400 gap-2">
          {["pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveStatus(tab)}
              className={`px-5 py-3 transition capitalize ${
                activeStatus === tab
                  ? "border-b-2 border-indigo-500 text-indigo-400 bg-slate-900/50"
                  : "hover:text-white"
              }`}
            >
              {tab} Submissions
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-2">
            <FaBoxOpen className="text-4xl text-slate-700 mx-auto" />
            <p className="text-sm font-semibold">No {activeStatus} templates found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <div
                key={tpl._id}
                className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3 p-5">
                  <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden relative">
                    <img
                      src={tpl.previewImages?.[0] || tpl.image || "/placeholder.jpg"}
                      alt={tpl.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md">
                      {tpl.category}
                    </span>
                    <span className="font-black text-sm text-emerald-400">
                      {tpl.isFree ? "FREE" : `$${tpl.price}`}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{tpl.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      Seller: {tpl.sellerId?.name || "Developer"} ({tpl.sellerId?.email})
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{tpl.description}</p>
                </div>

                <div className="bg-slate-950 p-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {tpl.livePreviewUrl ? (
                    <a
                      href={tpl.livePreviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 font-bold flex items-center gap-1 hover:underline"
                    >
                      <FaExternalLinkAlt className="text-[10px]" /> Live Preview
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-600">No Demo URL</span>
                  )}

                  {activeStatus === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(tpl._id)}
                        className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white p-2 rounded-xl text-xs font-bold transition"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => handleApprove(tpl._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md transition"
                      >
                        <FaCheck /> Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TemplateModeration;
