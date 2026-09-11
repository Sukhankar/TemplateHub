import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import axiosInstance from "../../user/utils/axiosInstance";
import {
  FaDollarSign,
  FaUsers,
  FaBoxOpen,
  FaUserCheck,
  FaExclamationTriangle,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get("/admin/analytics");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <AdminNavbar />
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <AdminNavbar />

      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-1">
          <h1 className="text-2xl font-black text-white">Platform Administration</h1>
          <p className="text-xs text-slate-400">
            Monitor platform metrics, moderate seller submissions, and manage user permissions.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Platform Volume</span>
              <FaDollarSign className="text-emerald-400" />
            </div>
            <div className="font-black text-2xl text-white">
              ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : "0.00"}
            </div>
            <span className="text-[10px] text-emerald-400 block font-semibold">
              From {stats?.totalSales || 0} completed orders
            </span>
          </div>

          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Net Platform Earnings (20%)</span>
              <FaChartLine className="text-indigo-400" />
            </div>
            <div className="font-black text-2xl text-indigo-400">
              ${stats?.platformFees ? stats.platformFees.toFixed(2) : "0.00"}
            </div>
            <span className="text-[10px] text-slate-500 block">Platform maintenance commission</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Templates</span>
              <FaBoxOpen className="text-amber-400" />
            </div>
            <div className="font-black text-2xl text-amber-400">
              {stats?.pendingTemplates || 0}
            </div>
            <span className="text-[10px] text-amber-400 block font-semibold">Requires QA approval</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Registered Users</span>
              <FaUsers className="text-blue-400" />
            </div>
            <div className="font-black text-2xl text-white">
              {stats?.totalUsers || 0}
            </div>
            <span className="text-[10px] text-slate-500 block">Buyers & Sellers</span>
          </div>
        </div>

        {/* Quick Moderation Shortcuts */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white">Moderation & Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/templates-moderation"
              className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition group space-y-3"
            >
              <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center text-lg">
                <FaBoxOpen />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition flex items-center justify-between">
                <span>Template Submissions</span>
                <FaArrowRight className="text-xs" />
              </h4>
              <p className="text-xs text-slate-400">
                {stats?.pendingTemplates || 0} templates awaiting publication review.
              </p>
            </Link>

            <Link
              to="/admin/developers"
              className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition group space-y-3"
            >
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-lg">
                <FaUserCheck />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition flex items-center justify-between">
                <span>Developer Approvals</span>
                <FaArrowRight className="text-xs" />
              </h4>
              <p className="text-xs text-slate-400">
                {stats?.pendingDevelopers || 0} seller applications awaiting approval.
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition group space-y-3"
            >
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-lg">
                <FaUsers />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition flex items-center justify-between">
                <span>User Accounts</span>
                <FaArrowRight className="text-xs" />
              </h4>
              <p className="text-xs text-slate-400">
                Manage account statuses, roles, and ban active users.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
