import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "If an account exists, a password reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request password reset.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
            🔑
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your account email address and we'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full outline-none text-sm text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 font-medium">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !email}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md ${
              submitting || !email
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
            }`}
          >
            {submitting ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs">
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
