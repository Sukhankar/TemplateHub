import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axiosInstance from "../../user/utils/axiosInstance";
import { FaUserCheck, FaUserTimes, FaStore } from "react-icons/fa";

const DeveloperApprovals = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/developers");
      setDevelopers(res.data || []);
    } catch (err) {
      console.error("Failed to load developer applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/admin/developers/${id}/approve`);
      fetchDevelopers();
    } catch (err) {
      alert("Failed to approve developer");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/admin/developers/${id}/reject`);
      fetchDevelopers();
    } catch (err) {
      alert("Failed to reject developer");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <AdminNavbar />

      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-1">
          <h1 className="text-2xl font-black text-white">Developer Applications</h1>
          <p className="text-xs text-slate-400">
            Review applicant store names, portfolios, and grant verified seller status.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : developers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <FaStore className="text-4xl text-slate-700 mx-auto" />
              <p className="text-sm font-semibold">No developer applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Store Name</th>
                    <th className="p-4">Developer</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {developers.map((dev) => (
                    <tr key={dev._id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <FaStore className="text-indigo-400" />
                        <span>{dev.storeName || "Unnamed Store"}</span>
                      </td>
                      <td className="p-4 text-slate-300">{dev.userId?.name || "Developer"}</td>
                      <td className="p-4 text-slate-400">{dev.userId?.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold border ${
                            dev.isApproved
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {dev.isApproved ? "Approved" : "Pending Review"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {!dev.isApproved ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleReject(dev._id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white font-bold transition flex items-center gap-1 text-[11px]"
                            >
                              <FaUserTimes /> Reject
                            </button>
                            <button
                              onClick={() => handleApprove(dev._id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 text-[11px] shadow-md"
                            >
                              <FaUserCheck /> Approve Seller
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-bold">Verified Seller</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeveloperApprovals;
