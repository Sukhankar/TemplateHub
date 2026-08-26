import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../user/context/AuthContext";
import { FaStore, FaChartLine, FaBoxOpen, FaDollarSign, FaPlus, FaSignOutAlt } from "react-icons/fa";

const DeveloperNavbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", path: "/developer/dashboard", icon: FaStore },
    { name: "My Templates", path: "/developer/templates", icon: FaBoxOpen },
    { name: "Analytics", path: "/developer/analytics", icon: FaChartLine },
    { name: "Earnings", path: "/developer/earnings", icon: FaDollarSign },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link to="/developer/dashboard" className="flex items-center gap-2 font-black text-xl tracking-tight text-white">
              <span className="bg-indigo-600 text-white p-1.5 rounded-lg text-sm">TH</span>
              <span>TemplateHub</span>
            </Link>
            <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Seller Portal
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-900/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="text-sm" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Button & Profile */}
          <div className="flex items-center gap-3">
            <Link
              to="/developer/upload"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-emerald-950/20"
            >
              <FaPlus /> Upload Template
            </Link>

            <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-200">{user?.name || "Developer"}</div>
                <div className="text-[10px] text-slate-400">Seller Account</div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              >
                <FaSignOutAlt className="text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DeveloperNavbar;
