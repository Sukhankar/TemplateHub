import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import API from '../userapi/userapi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      const response = await API.post('/user/login', {
        email,
        password
      });
      
      if (response.data) {
        login(response.data.user);
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100 p-4">
      <div className="flex w-full max-w-6xl rounded-xl bg-white shadow-lg overflow-hidden">
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

        {/* Right Form */}
        <div className="w-1/2 p-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-gray-500 mb-6">Secure Your Account with Us</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border rounded px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative border rounded px-3 py-2 flex items-center">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {error && <div className="text-sm text-red-500 mb-2">{error}</div>}

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition"
            >
              Login
            </button>
          </form>

          <div className="flex justify-center items-center gap-3 mt-3">
            <span className="text-sm text-gray-500">Or login with:</span>
            <div className="flex space-x-3">
              <img 
                src="https://www.svgrepo.com/show/355037/facebook.svg" 
                alt="facebook" 
                className="h-6 w-6 cursor-pointer"
              />
              <img 
                src="https://www.svgrepo.com/show/355037/google.svg" 
                alt="google" 
                className="h-6 w-6 cursor-pointer"
              />
            </div>
          </div>

          <p className="text-sm mt-5 text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
