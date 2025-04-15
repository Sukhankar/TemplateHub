import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CartProvider } from "./user/context/CartContext";
import { WishlistProvider } from "./user/context/WishlistContext";
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { AuthProvider } from "./user/context/AuthContext";

AOS.init({ duration: 1000, once: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);