import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGoogle, FaFacebook, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../userapi/userapi";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
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
    if (!form.name || !form.email || !form.password) return;

    try {
      const response = await API.post("/user/signup", form);
      
      if (response.data) {
        login(response.data);
        navigate("/");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
    // Implement Google OAuth integration
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
    // Implement Facebook OAuth integration
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-blue-100 p-4">
        <div className="flex w-full max-w-6xl rounded-xl bg-white shadow-lg overflow-hidden">
          {/* Right Form */}
          <div className="w-1/2 p-10">
            <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
            <p className="text-gray-500 mb-6">Create your account to get started</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center border rounded px-3 py-2">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full outline-none"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center border rounded px-3 py-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full outline-none"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative border rounded px-3 py-2 flex items-center">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="w-full outline-none"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <div
                  className="cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* Password Checklist */}
              <ul className="text-sm mt-2 space-y-1">
                <li className={`flex items-center gap-2 ${passwordValidations.length ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidations.length ? '✔️' : '✖️'} At least 8 characters
                </li>
                <li className={`flex items-center gap极2 ${passwordValidations.number ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidations.number ? '✔️' : '✖️'} At least one number (0–9) or symbol
                </li>
                <li className={`flex items-center gap-2 ${passwordValidations.case ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidations.case ? '✔️' : '✖️'} Lowercase (a-z) and Uppercase (A-Z)
                </li>
              </ul>

              {/* Confirm Password Input */}
              <div className="border rounded px-3 py-2 flex flex-col">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full outline-none ${form.confirmPassword && form.confirmPassword !== form.password ? 'border-red-500' : ''}`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {form.confirmPassword && form.confirmPassword !== form.password && (
                  <span className="text-sm text-red-500 mt-1">Passwords do not match</span>
                )}
              </div>

              {error && <div className="text-sm text-red-500 mb-2">{error}</div>}

              <button
                type="submit"
                disabled={
                  !passwordValidations.length ||
                  !passwordValidations.number ||
                  !passwordValidations.case ||
                  form.password !== form.confirmPassword
                }
                className={`w-full py-2 rounded-md transition-all ${
                  !passwordValidations.length || !passwordValidations.number || !passwordValidations.case || form.password !== form.confirmPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Register
              </button>

              <div className="flex justify-center items-center gap-3 mt-3">
                <span className="text-sm text-gray-500">Or sign up with:</span>
                <div className="flex space-x-3">
                  <button
                    onClick={handleGoogleLogin}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <FaGoogle className="text-red-500" />
                  </button>
                  <button
                    onClick={handleFacebookLogin}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <FaFacebook className="text-blue-600" />
                  </button>
                </div>
              </div>

              <p className="text-sm mt-5 text-center text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Login
                </a>
              </p>
            </form>
          </div>

          {/* Left Visual Panel */}
          <div className="w-1/2 bg-gradient-to-br from-blue-700 to-blue-400 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Inbox Card */}
            <div className="bg-white text-gray-900 p-6 rounded-xl shadow-xl w-[220px]">
              <h4 className="text-orange-500 text-sm font-semibold mb-2">Inbox</h4>
              <div className="text-2xl font-bold mb-4">176,18</div>
              <div className="w-10 h-10 rounded-full bg-indigo-950 text-white flex items-center justify-center font-semibold mb-2">45</div>
              <div className="h-1 rounded-full bg-orange-500 w-full"></div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 ml-3">
              <div className="bg-white/20 p-3 rounded-full cursor-pointer hover:bg-white/30">
                <i className="fab fa-instagram text-white text-xl"></i>
              </div>
              <div className="bg-white/20 p-3 rounded-full cursor-pointer hover:bg-white/30">
                <i className="fab fa-tiktok text-white text-xl"></i>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white text-gray-900 p-5 rounded-xl shadow-xl w-[280px]">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-key text-yellow-500"></i>
                <h4 className="font-bold text-sm">Your data, your rules</h4>
              </div>
              <p className="text-xs text-gray-600">Your data belongs to you, and our encryption ensures that</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
