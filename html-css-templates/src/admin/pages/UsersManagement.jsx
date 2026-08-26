import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axiosInstance from "../../user/utils/axiosInstance";
import { FaSearch, FaUserSlash, FaUserCheck, FaFilter } from "react-icons/fa";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/users", {
        params: { search, role: roleFilter },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleBan = async (userId) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/ban`);
      fetchUsers();
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <AdminNavbar />

      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-1">
          <h1 className="text-2xl font-black text-white">User Accounts Moderation</h1>
          <p className="text-xs text-slate-400">
            View registered user profiles, search accounts, and manage active status.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters Control */}
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <FaFilter className="text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none"
            >
              <option value="">All Roles</option>
              <option value="user">Buyers Only</option>
              <option value="developer">Developers Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 font-black flex items-center justify-center">
                          {u.name?.[0] || "U"}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="p-4 text-slate-300">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold border ${
                            u.role === "admin"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              : u.role === "developer"
                              ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold border ${
                            u.isActive !== false
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {u.isActive !== false ? "Active" : "Banned"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleToggleBan(u._id)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ml-auto text-[11px] ${
                              u.isActive !== false
                                ? "bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white"
                                : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                            }`}
                          >
                            {u.isActive !== false ? (
                              <>
                                <FaUserSlash /> Ban User
                              </>
                            ) : (
                              <>
                                <FaUserCheck /> Unban
                              </>
                            )}
                          </button>
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

export default UsersManagement;
