import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaBell, FaCheckDouble, FaTrash, FaCircle, FaExternalLinkAlt } from "react-icons/fa";

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id, link) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
    if (link) navigate(link);
  };

  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <section className="pt-28 pb-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <h1 className="text-3xl font-black">Notifications & Inbox</h1>
          <p className="text-xs text-slate-400">
            Stay updated with your latest template purchases, sales alerts, and account updates.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div className="flex border border-slate-200 rounded-xl p-1 text-xs font-bold text-slate-600 bg-slate-50">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1.5 rounded-lg transition ${
                  filter === "all" ? "bg-white text-indigo-600 shadow-sm font-extrabold" : "hover:text-slate-900"
                }`}
              >
                All Notifications ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-1.5 rounded-lg transition ${
                  filter === "unread" ? "bg-white text-indigo-600 shadow-sm font-extrabold" : "hover:text-slate-900"
                }`}
              >
                Unread ({notifications.filter((n) => !n.isRead).length})
              </button>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
            >
              <FaCheckDouble /> Mark All as Read
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <FaBell className="text-4xl text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">No notifications found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id, n.link)}
                  className={`p-4 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4 rounded-2xl ${
                    !n.isRead ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!n.isRead ? (
                      <FaCircle className="text-[10px] text-indigo-600 mt-1 shrink-0" />
                    ) : (
                      <div className="w-2.5 shrink-0" />
                    )}

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>{n.title}</span>
                        {n.link && <FaExternalLinkAlt className="text-[10px] text-indigo-500" />}
                      </h4>
                      <p className="text-xs text-slate-600">{n.message}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(n._id, e)}
                    className="p-2 text-slate-300 hover:text-rose-600 transition"
                    title="Delete Notification"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
