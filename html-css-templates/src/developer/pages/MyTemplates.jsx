import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeveloperNavbar from "../components/DeveloperNavbar";
import TemplateStatusBadge from "../components/TemplateStatusBadge";
import { useDeveloper } from "../context/DeveloperContext";
import * as devApi from "../api/developerApi";
import { FaPlus, FaTrash, FaEdit, FaExternalLinkAlt, FaEye } from "react-icons/fa";

const MyTemplates = () => {
  const { templates, isLoading, fetchTemplates } = useDeveloper();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchTemplates(activeTab === "all" ? undefined : activeTab);
  }, [activeTab, fetchTemplates]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to archive "${title}"?`)) {
      try {
        await devApi.deleteTemplate(id);
        fetchTemplates(activeTab === "all" ? undefined : activeTab);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to archive template");
      }
    }
  };

  const tabs = [
    { id: "all", label: "All Templates" },
    { id: "approved", label: "Approved" },
    { id: "pending", label: "Pending Review" },
    { id: "rejected", label: "Rejected" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DeveloperNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">My Templates Catalog</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your uploaded HTML/CSS/React website templates and monitor status reviews.
            </p>
          </div>

          <Link
            to="/developer/upload"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            <FaPlus /> Submit New Template
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-800 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No templates found in category [{activeTab}].
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <div
                key={tpl._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-800 overflow-hidden">
                    <img
                      src={tpl.previewImages?.[0] || "/placeholder.jpg"}
                      alt={tpl.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <TemplateStatusBadge status={tpl.status} rejectionReason={tpl.rejectionReason} />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black text-emerald-400 border border-slate-700">
                      {tpl.isFree ? "Free" : `$${tpl.price}`}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-white line-clamp-1">{tpl.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{tpl.description}</p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <span className="capitalize font-medium text-indigo-400">{tpl.category}</span>
                      <span>{tpl.downloadCount || 0} Downloads</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {tpl.livePreviewUrl && (
                      <a
                        href={tpl.livePreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                        title="Live Demo"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                    <Link
                      to={`/template/${tpl._id}`}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                      title="View Public Page"
                    >
                      <FaEye />
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/developer/templates/edit/${tpl._id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition"
                    >
                      <FaEdit /> Edit
                    </Link>
                    {tpl.status !== "archived" && (
                      <button
                        onClick={() => handleDelete(tpl._id, tpl.title)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Archive Template"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTemplates;
