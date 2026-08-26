import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const passwordValidations = {
    length: newPassword.length >= 8,
    number: /\d/.test(newPassword),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!token || !email) {
      setError("Invalid or missing password reset link parameters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        email,
        token,
        newPassword,
      });

      setSuccessMsg(res.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
            🛡️
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose a new strong password for your account: <br />
            <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative border rounded-lg px-3 py-2.5 flex items-center focus-within:ring-2 focus-within:ring-indigo-500">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full outline-none text-sm text-gray-800"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div
              className="cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <div className="border rounded-lg px-3 py-2.5 flex items-center focus-within:ring-2 focus-within:ring-indigo-500">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full outline-none text-sm text-gray-800"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <ul className="text-xs space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <li
              className={`flex items-center gap-2 ${
                passwordValidations.length ? "text-emerald-600 font-medium" : "text-gray-500"
              }`}
            >
              {passwordValidations.length ? "✓" : "○"} At least 8 characters
            </li>
            <li
              className={`flex items-center gap-2 ${
                passwordValidations.number ? "text-emerald-600 font-medium" : "text-gray-500"
              }`}
            >
              {passwordValidations.number ? "✓" : "○"} At least one number
            </li>
          </ul>

          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 font-medium text-center">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              !passwordValidations.length ||
              !passwordValidations.number ||
              newPassword !== confirmPassword
            }
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md ${
              submitting ||
              !passwordValidations.length ||
              !passwordValidations.number ||
              newPassword !== confirmPassword
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
            }`}
          >
            {submitting ? "Resetting Password..." : "Update Password"}
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

export default ResetPassword;
