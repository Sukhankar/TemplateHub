import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../user/context/AuthContext";
import { FaShieldAlt, FaUsers, FaUserCheck, FaBoxOpen, FaDollarSign, FaSignOutAlt } from "react-icons/fa";

const AdminNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: FaShieldAlt },
    { label: "Users", path: "/admin/users", icon: FaUsers },
    { label: "Developer Approvals", path: "/admin/developers", icon: FaUserCheck },
    { label: "Template Moderation", path: "/admin/templates-moderation", icon: FaBoxOpen },
    { label: "Orders & Finance", path: "/admin/finance", icon: FaDollarSign },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2 font-black text-lg text-white">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg text-xs">ADMIN</span>
            <span>TemplateHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold px-3.5 py-1.5 rounded-xl text-xs transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
