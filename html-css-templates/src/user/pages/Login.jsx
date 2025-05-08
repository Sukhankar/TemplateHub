// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../userapi/userapi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return; // Prevent empty login
    
    try {
      const response = await API.post("/user/login", {
        email,
        password
      });
      
      if (response.data) {
        login(response.data.user); // Store user info in context
        navigate("/");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-20 px-4 bg-white min-h-screen">
        <div className="max-w-md mx-auto bg-gray-50 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
