import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import DeveloperNavbar from "../components/DeveloperNavbar";
import TemplateStatusBadge from "../components/TemplateStatusBadge";
import { useDeveloper } from "../context/DeveloperContext";
import { FaBoxOpen, FaDownload, FaDollarSign, FaClock, FaPlus, FaArrowRight } from "react-icons/fa";

const DeveloperDashboard = () => {
  const { metrics, recentTemplates, isLoading, fetchDashboard } = useDeveloper();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DeveloperNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 border border-indigo-700/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Developer Dashboard
            </span>
            <h1 className="text-3xl font-black text-white mt-1">Manage Your Product Store</h1>
            <p className="text-sm text-indigo-100 mt-2">
              Track template approval statuses, download analytics, purchase revenues, and launch new website templates to the marketplace.
            </p>
          </div>

          <Link
            to="/developer/upload"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/50 transition-all text-sm whitespace-nowrap"
          >
            <FaPlus /> New Template Submission
          </Link>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Templates</p>
                  <h3 className="text-3xl font-extrabold text-white mt-1">{metrics?.totalTemplates || 0}</h3>
                  <p className="text-[11px] text-indigo-400 mt-1">
                    {metrics?.approvedTemplates || 0} Approved & Live
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center text-xl">
                  <FaBoxOpen />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Review</p>
                  <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{metrics?.pendingTemplates || 0}</h3>
                  <p className="text-[11px] text-amber-300/70 mt-1">Awaiting admin review</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center text-xl">
                  <FaClock />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Downloads</p>
                  <h3 className="text-3xl font-extrabold text-blue-400 mt-1">{metrics?.totalDownloads || 0}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{metrics?.totalSales || 0} Paid purchases</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl">
                  <FaDownload />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
                    ${(metrics?.totalRevenue || 0).toFixed(2)}
                  </h3>
                  <p className="text-[11px] text-emerald-300/70 mt-1">Lifetime earnings</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-xl">
                  <FaDollarSign />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Templates */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Recent Templates List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Your Recent Products</h2>
                  <Link to="/developer/templates" className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                    View All <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>

                {!metrics?.recentTemplates || metrics.recentTemplates.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                    You haven't uploaded any website templates yet.
                    <div className="mt-4">
                      <Link
                        to="/developer/upload"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold"
                      >
                        <FaPlus /> Submit First Template
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg divide-y divide-slate-800">
                    {metrics.recentTemplates.map((template) => (
                      <div key={template._id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition">
                        <div className="flex items-center gap-3">
                          <img
                            src={template.previewImages?.[0] || "/placeholder.jpg"}
                            alt={template.title}
                            className="w-14 h-10 object-cover rounded-lg border border-slate-700 bg-slate-800"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-white">{template.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                              <span className="capitalize text-indigo-300 font-medium">{template.category}</span>
                              <span>•</span>
                              <span>{template.isFree ? "Free" : `$${template.price}`}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <TemplateStatusBadge status={template.status} rejectionReason={template.rejectionReason} />
                          <Link
                            to={`/developer/templates/edit/${template._id}`}
                            className="text-xs text-slate-400 hover:text-white underline font-medium"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Col: Guidelines & Developer Status */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Submission Checklist</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h5 className="font-bold text-white">ZIP Package Security</h5>
                      <p className="text-slate-400 mt-0.5">
                        Ensure source ZIPs do not contain executable scripts (.php, .exe, .sh).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h5 className="font-bold text-white">High-Quality Screenshots</h5>
                      <p className="text-slate-400 mt-0.5">
                        Upload up to 5 clear preview images (1280x800 recommended).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h5 className="font-bold text-white">Admin Verification</h5>
                      <p className="text-slate-400 mt-0.5">
                        Templates are reviewed by administrators within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DeveloperDashboard;
