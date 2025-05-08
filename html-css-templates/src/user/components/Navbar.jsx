import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingCart, BookMarkedIcon, Menu, X} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import Switch from "./Dark_light_button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-gray-200">TemplateHub</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <Link to="/templates" className="text-gray-700 hover:text-blue-600 dark:text-gray-200">
              Templates
            </Link>
            <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
              Browse templates
            </span>
          </div>

          <div className="relative group">
            <Link to="/about" className="text-gray-700 hover:text-blue-600 dark:text-gray-200">
              About
            </Link>
            <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
              Learn about us
            </span>
          </div>

          <div className="relative group">
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 dark:text-gray-200">
              Contact
            </Link>
            <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
              Get in touch
            </span>
          </div>

          {/* Wishlist */}
          <div className="relative group">
            <Link to="/wishlist" className="relative text-gray-700 hover:text-red-600 dark:text-gray-200">
              <BookMarkedIcon className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
              View your bookmarks
            </span>
          </div>

          {/* Cart */}
          <div className="relative group">
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 dark:text-gray-200">
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
              View your cart
            </span>
          </div>

          {/* User Avatar Dropdown */}
          {user ? (
            <div className="relative group">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow p-3 w-48 z-50 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 mb-2 truncate dark:text-gray-200">
                      {user?.email || "No email"}
                    </div>
                    <Link
                      to="/profile"
                      className="block text-gray-700 hover:text-blue-600 text-sm mb-2 dark:text-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
                Manage your account
              </span>
            </div>
          ) : (
            <>
              <div className="relative group">
                <Link to="/login" className="text-blue-600 text-sm dark:text-gray-200">
                  Login
                </Link>
                <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
                  Login to your account
                </span>
              </div>
              <div className="relative group">
                <Link to="/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm">
                  Signup
                </Link>
                <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
                  Create a new account
                </span>
              </div>
            </>
          )}
          {/* Add the Switch component */}
          <div className="relative group">
            <Switch />
            <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1">
              Toggle dark/light mode
            </span>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1">
          {/* Add the Switch component */}
          <div className="scale-50"> {/* Scale down the Switch for mobile */}
            <Switch />
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-gray-700 hover:text-red-600 dark:text-gray-200">
          <BookMarkedIcon className="w-4 h-4" /> {/* Smaller icon for mobile */}
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 dark:text-gray-200">
            <ShoppingCart className="w-4 h-4" /> {/* Smaller icon for mobile */}
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="p-1 text-gray-700 dark:text-gray-200" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />} {/* Smaller icons */}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 space-y-4 dark:bg-gray-800">
            <Link to="/templates" className="block text-gray-700 hover:text-blue-600 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Templates</Link>
            <Link to="/about" className="block text-gray-700 hover:text-blue-600 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-blue-600 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {user ? (
              <>
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-blue-600 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block text-blue-600 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Signup</Link>
              </>
            )}
            
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
