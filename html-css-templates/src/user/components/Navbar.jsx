import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingCart, BookMarkedIcon, Menu, X} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import Switch from "./Dark_light_button";
import DevCanvasLogo from "../../assets/DevCanvasLogo.png"; // Adjust the path/filename as needed

const Navbar = ({ scrollToAbout, scrollToContact }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [hoveredElement, setHoveredElement] = useState(null);

  // Auto logout after 2 hours
  useEffect(() => {
    const autoLogoutTimer = setTimeout(() => {
      if (user) {
        logout();
        navigate("/login");
      }
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearTimeout(autoLogoutTimer);
  }, [user, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAboutClick = () => {
    if (location.pathname === "/") {
      scrollToAbout();
    } else {
      navigate("/#about");
    }
  };

  const handleContactClick = () => {
    if (location.pathname === "/") {
      scrollToContact();
    } else {
      navigate("/#contact");
    }
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

  const handleMouseEnter = (element) => {
    setHoveredElement(element);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  const getTooltip = (element) => {
    const tooltips = {
      templates: "Browse templates",
      about: "Learn about us",
      contact: "Get in touch",
      wishlist: "View your bookmarks",
      cart: "View your cart",
      user: "Manage your account",
      login: "Login to your account",
      signup: "Create a new account"
    };
    return tooltips[element];
  };

  return (
    <nav className="bg-black/25 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-50">
  <div className="container mx-auto px-4 py-1 flex justify-between items-center">
    <Link to="/" className="flex items-center space-x-2 group">
      <img
        src={DevCanvasLogo}
        alt="DevCanvas Logo"
        className="h-24 w-24 -my-6 object-contain transition-transform duration-300 group-hover:scale-105"
        style={{ borderRadius: "0.5rem", background: "transparent" }}
      />
      {/* <span className="text-2xl font-bold text-blue-600 tracking-tight">DevCanvas</span> */}
    </Link>

        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('templates')}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/templates" className="text-white hover:text-blue-600">
              Templates
            </Link>
            {hoveredElement === 'templates' && (
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                {getTooltip('templates')}
              </span>
            )}
          </div>

          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleAboutClick}
              className="text-white hover:text-blue-600"
            >
              About
            </button>
            {hoveredElement === 'about' && (
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                {getTooltip('about')}
              </span>
            )}
          </div>

          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('contact')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleContactClick}
              className="text-white hover:text-blue-600"
            >
              Contact
            </button>
            {hoveredElement === 'contact' && (
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                {getTooltip('contact')}
              </span>
            )}
          </div>

          {/* Wishlist */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('wishlist')}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/wishlist" className="relative text-white hover:text-red-600">
              <BookMarkedIcon className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            {hoveredElement === 'wishlist' && (
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                {getTooltip('wishlist')}
              </span>
            )}
          </div>

          {/* Cart */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('cart')}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/cart" className="relative text-white hover:text-blue-600">
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {hoveredElement === 'cart' && (
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                {getTooltip('cart')}
              </span>
            )}
          </div>

          {/* User Avatar Dropdown */}
          {user ? (
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('user')}
              onMouseLeave={handleMouseLeave}
            >
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
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow p-3 w-48 z-50">
                    <div className="text-xs text-gray-500 mb-2 truncate">
                      {user?.email || "No email"}
                    </div>
                    <Link
                      to="/profile"
                      className="block text-gray-700 hover:text-blue-600 text-sm mb-2"
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
              {hoveredElement === 'user' && (
                <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                  {getTooltip('user')}
                </span>
              )}
            </div>
          ) : (
            <>
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('login')}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/login" className="text-blue-600 text-sm">
                  Login
                </Link>
                {hoveredElement === 'login' && (
                  <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                    {getTooltip('login')}
                  </span>
                )}
              </div>
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('signup')}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm">
                  Signup
                </Link>
                {hoveredElement === 'signup' && (
                  <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                    {getTooltip('signup')}
                  </span>
                )}
              </div>
            </>
          )}
          {/* Add the Switch component */}
          <div className="relative">
            <Switch />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1">
          {/* Add the Switch component */}
          <div className="scale-50">
            <Switch />
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-gray-700 hover:text-red-600">
          <BookMarkedIcon className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-gray=700 hover:text-blue-600">
            <ShoppingCart className="w-4 h-4" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="p-1 text-gray-700" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
