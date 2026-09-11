import React, { useEffect, useState } from "react";
import DeveloperNavbar from "../components/DeveloperNavbar";
import * as devApi from "../api/developerApi";
import { FaChartBar, FaDownload, FaDollarSign, FaStar } from "react-icons/fa";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await devApi.getDeveloperAnalytics();
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DeveloperNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">Sales & Downloads Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Performance stats over the past 30 days across all your published templates.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Sales Timeline Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FaChartBar className="text-indigo-400" /> 30-Day Revenue Trend ($ USD)
              </h3>

              <div className="h-44 flex items-end gap-1.5 pt-6 px-2 border-b border-slate-800 overflow-x-auto">
                {data?.salesTimeline?.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 min-w-[20px] group relative">
                    <div
                      className="w-full bg-indigo-600 hover:bg-indigo-400 rounded-t-md transition-all"
                      style={{ height: `${Math.max(8, (item.revenue / 150) * 100)}%` }}
                    />
                    <span className="text-[9px] text-slate-500 hidden sm:block">
                      {item.date.slice(-5)}
                    </span>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-950 text-white text-[10px] p-2 rounded-lg border border-slate-700 shadow-xl whitespace-nowrap z-20">
                      <div className="font-bold text-indigo-300">{item.date}</div>
                      <div>Revenue: ${item.revenue}</div>
                      <div>Sales: {item.sales}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Performance Table */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white">Template Performance Breakdown</h3>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3">Template Title</th>
                      <th className="px-5 py-3">Purchases</th>
                      <th className="px-5 py-3">Downloads</th>
                      <th className="px-5 py-3">Revenue</th>
                      <th className="px-5 py-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data?.templatePerformance?.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-3 font-bold text-white">{t.title}</td>
                        <td className="px-5 py-3 text-slate-300">{t.sales}</td>
                        <td className="px-5 py-3 text-slate-300">{t.downloads}</td>
                        <td className="px-5 py-3 font-bold text-emerald-400">${t.revenue.toFixed(2)}</td>
                        <td className="px-5 py-3 text-amber-400 font-semibold flex items-center gap-1">
                          <FaStar /> {t.rating || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
