import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStore } from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    storeName: "",
    storeDescription: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordValidations = {
    length: form.password.length >= 8,
    number: /\d/.test(form.password),
    case: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password),
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.role === "developer" && !form.storeName) {
      setError("Store name is required for seller accounts.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        storeName: form.role === "developer" ? form.storeName : undefined,
        storeDescription: form.role === "developer" ? form.storeDescription : undefined,
      });

      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Registration failed. Please try again.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="flex w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden my-6">
        {/* Left Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 mb-6">Join TemplateHub as a Buyer or Seller</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "user" })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-medium text-sm transition-all ${
                    form.role === "user"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaUser /> Buyer
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "developer" })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-medium text-sm transition-all ${
                    form.role === "developer"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaStore /> Seller / Developer
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full outline-none text-sm text-gray-800"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full outline-none text-sm text-gray-800"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Developer Specific Fields */}
            {form.role === "developer" && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fadeIn">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Developer Store Details
                </h4>
                <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500">
                  <FaStore className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="storeName"
                    placeholder="Store / Brand Name (e.g. PixelCraft)"
                    className="w-full outline-none text-sm text-gray-800"
                    value={form.storeName}
                    onChange={handleChange}
                    required={form.role === "developer"}
                  />
                </div>
                <textarea
                  name="storeDescription"
                  placeholder="Short Store Bio / Description"
                  rows={2}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-500"
                  value={form.storeDescription}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Password Input */}
            <div className="relative border rounded-lg px-3 py-2 flex items-center focus-within:ring-2 focus-within:ring-indigo-500">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full outline-none text-sm text-gray-800"
                value={form.password}
                onChange={handleChange}
                required
              />
              <div
                className="cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* Password Strength Checklist */}
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
                {passwordValidations.number ? "✓" : "○"} At least one number (0–9)
              </li>
              <li
                className={`flex items-center gap-2 ${
                  passwordValidations.case ? "text-emerald-600 font-medium" : "text-gray-500"
                }`}
              >
                {passwordValidations.case ? "✓" : "○"} Both lowercase and uppercase letters
              </li>
            </ul>

            {/* Confirm Password Input */}
            <div className="border rounded-lg px-3 py-2 flex flex-col focus-within:ring-2 focus-within:ring-indigo-500">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full outline-none text-sm text-gray-800 ${
                  form.confirmPassword && form.confirmPassword !== form.password
                    ? "border-red-500"
                    : ""
                }`}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <span className="text-xs text-red-500 mt-1">Passwords do not match</span>
              )}
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                !passwordValidations.length ||
                !passwordValidations.number ||
                !passwordValidations.case ||
                form.password !== form.confirmPassword
              }
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md ${
                submitting ||
                !passwordValidations.length ||
                !passwordValidations.number ||
                !passwordValidations.case ||
                form.password !== form.confirmPassword
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
              }`}
            >
              {submitting ? "Registering..." : "Create Account"}
            </button>

            <p className="text-xs text-center text-gray-600 pt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Right Visual Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 p-10 text-white flex-col justify-between relative">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              Welcome to TemplateHub
            </span>
            <h3 className="text-3xl font-extrabold mt-2 leading-snug">
              Build & Monetize Premium Templates
            </h3>
            <p className="text-indigo-100 text-sm mt-3">
              Join thousands of developers selling HTML, CSS, and React website templates directly to creators worldwide.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 shadow-lg">
              <h4 className="font-semibold text-sm text-white">🔒 Enterprise Security</h4>
              <p className="text-xs text-indigo-100 mt-1">
                Multi-layer authorization, OTP verification, and JWT session encryption protect your account.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 shadow-lg">
              <h4 className="font-semibold text-sm text-white">🚀 Instant Store Activation</h4>
              <p className="text-xs text-indigo-100 mt-1">
                Publish your products to our curated marketplace after quick admin review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
