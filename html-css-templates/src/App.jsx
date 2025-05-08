import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './user/pages/Home';
import Templates from './user/pages/Templates';
import TemplateDetails from './user/pages/TemplateDetails';
import Cart from './user/pages/Cart';
import Wishlist from './user/pages/Wishlist';
import Checkout from './user/pages/Checkout';
import About from './user/pages/About';
import Contact from './user/pages/Contact';
import Login from './user/pages/Login';
import Register from './user/pages/Register';
import Profile from './user/pages/Profile';
import ProfileSetup from './user/pages/ProfileSetup';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import AddTemplate from './admin/pages/AddTemplate';
import EditTemplate from './admin/pages/EditTemplate';
import TemplateDetail from './admin/pages/TemplateDetail';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/template/:id" element={<TemplateDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/add" element={
          <AdminProtectedRoute>
            <AddTemplate />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/edit/:id" element={
          <AdminProtectedRoute>
            <EditTemplate />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/template/:id" element={
          <AdminProtectedRoute>
            <TemplateDetail />
          </AdminProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
