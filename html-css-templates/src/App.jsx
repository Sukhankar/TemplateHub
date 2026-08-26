import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./user/pages/Home";
import Templates from "./user/pages/Templates";
import TemplateDetails from "./user/pages/TemplateDetails";
import LivePreview from "./user/pages/LivePreview";
import Cart from "./user/pages/Cart";
import Wishlist from "./user/pages/Wishlist";
import Checkout from "./user/pages/Checkout";
import PurchaseSuccess from "./user/pages/PurchaseSuccess";
import MyPurchases from "./user/pages/MyPurchases";
import About from "./user/pages/About";
import Contact from "./user/pages/Contact";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import OTPVerification from "./user/pages/OTPVerification";
import ForgotPassword from "./user/pages/ForgotPassword";
import ResetPassword from "./user/pages/ResetPassword";
import Profile from "./user/pages/Profile";

import UserProtectedRoute from "./user/components/UserProtectedRoutes";

// Developer Portal imports
import { DeveloperProvider } from "./developer/context/DeveloperContext";
import DeveloperDashboard from "./developer/pages/Dashboard";
import MyTemplates from "./developer/pages/MyTemplates";
import UploadTemplate from "./developer/pages/UploadTemplate";
import EditTemplate from "./developer/pages/EditTemplate";
import Analytics from "./developer/pages/Analytics";
import Earnings from "./developer/pages/Earnings";

import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import AddTemplate from "./admin/pages/AddTemplate";
import EditTemplateAdmin from "./admin/pages/EditTemplate";
import TemplateDetailAdmin from "./admin/pages/TemplateDetail";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 relative">
        {["w-1/3 h-12", "w-2/3 h-8", "w-full h-64"].map((cls, i) => (
          <div key={i} className={`relative rounded bg-gray-200 overflow-hidden ${cls}`}>
            <div className="shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/template/:id" element={<TemplateDetails />} />
        <Route path="/preview/:id" element={<LivePreview />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/purchase-success" element={<PurchaseSuccess />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Developer Portal Routes */}
        <Route
          path="/developer/dashboard"
          element={
            <UserProtectedRoute allowedRoles={["developer", "admin"]}>
              <DeveloperProvider>
                <DeveloperDashboard />
              </DeveloperProvider>
            </UserProtectedRoute>
          }
        />
        <Route
          path="/developer/templates"
          element={
            <UserProtectedRoute allowedRoles={["developer", "admin"]}>
              <DeveloperProvider>
                <MyTemplates />
              </DeveloperProvider>
            </UserProtectedRoute>
          }
        />
        <Route
          path="/developer/upload"
          element={
            <UserProtectedRoute allowedRoles={["developer", "admin"]}>
              <DeveloperProvider>
                <UploadTemplate />
              </DeveloperProvider>
            </UserProtectedRoute>
          }
        />
        <Route
          path="/developer/templates/edit/:id"
          element={
            <UserProtectedRoute allowedRoles={["developer", "admin"]}>
              <DeveloperProvider>
                <EditTemplate />
              </DeveloperProvider>
            </UserProtectedRoute>
          }
        />
        <Route
          path="/developer/analytics"
          element={
            <UserProtectedRoute allowedRoles={["developer", "admin"]}>
              <DeveloperProvider>
                <Analytics />
              </DeveloperProvider>
            </UserProtectedRoute>
          }
        />
        <Route
          path="/developer/earnings"
          element={
            <UserProtectedRoute allowedRoles={["developer", "admin"]}>
              <DeveloperProvider>
                <Earnings />
              </DeveloperProvider>
            </UserProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add"
          element={
            <AdminProtectedRoute>
              <AddTemplate />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <AdminProtectedRoute>
              <EditTemplateAdmin />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/template/:id"
          element={
            <AdminProtectedRoute>
              <TemplateDetailAdmin />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
