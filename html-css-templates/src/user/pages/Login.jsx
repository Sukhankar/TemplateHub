import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setSubmitting(true);

    try {
      const data = await login(email, password);

      const role = data.user?.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "developer") {
        navigate("/developer/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="flex w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden my-6">
        {/* Left Visual Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 p-10 text-white flex-col justify-between relative">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              TemplateHub Portal
            </span>
            <h3 className="text-3xl font-extrabold mt-2 leading-snug">
              Welcome Back to Your Workspace
            </h3>
            <p className="text-indigo-100 text-sm mt-3">
              Access your purchased website templates, downloads, sales analytics, and developer dashboard.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 shadow-lg">
            <h4 className="font-semibold text-sm text-white">🔒 Enhanced Session Security</h4>
            <p className="text-xs text-indigo-100 mt-1">
              Short-lived access tokens and httpOnly encrypted refresh cookies protect your transactions.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Sign In</h2>
          <p className="text-gray-500 mb-6">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full outline-none text-sm text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative border rounded-lg px-3 py-2.5 flex items-center focus-within:ring-2 focus-within:ring-indigo-500">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full outline-none text-sm text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600" />
                Remember me
              </label>

              <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md ${
                submitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
              }`}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
