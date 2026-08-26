import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { FaCreditCard, FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "123 Tech Avenue, Suite 400",
    country: "United States",
    cardNumber: "•••• •••• •••• 4242",
    cardExpiry: "12/28",
    cardCvc: "888",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.isFree ? 0 : item.calculatedPrice || item.price || 0),
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return navigate("/login");
    }

    if (cartItems.length === 0) {
      return setError("Your cart is empty");
    }

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/payment/create-order", {
        items: cartItems,
        paymentMethod,
        billingDetails: {
          name: form.name,
          email: form.email,
          address: form.address,
          country: form.country,
        },
      });

      clearCart();
      navigate(`/purchase-success`, { state: { order: res.data.order, orderId: res.data.orderId } });
    } catch (err) {
      console.error("Checkout payment error:", err);
      setError(err.response?.data?.message || "Payment authorization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <FaLock className="text-4xl text-indigo-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Login Required to Complete Checkout</h2>
          <p className="text-xs text-slate-500">
            Please log in or create an account to secure your purchases and access downloads anytime.
          </p>
          <Link
            to="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            Login to Continue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <section className="pt-28 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <h1 className="text-3xl font-black">Secure Checkout</h1>
          <p className="text-xs text-slate-400">
            Complete your order details below to download your template source files instantly.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Billing & Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Info Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                1. Billing Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Billing Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                2. Select Payment Gateway
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === "card"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FaCreditCard className="text-lg text-indigo-600" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === "stripe"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-black text-sm text-indigo-600">Stripe</span>
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === "razorpay"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-black text-sm text-blue-600">Razorpay</span>
                  <span>UPI / Netbanking</span>
                </button>
              </div>

              {/* Card Inputs Mock */}
              <div className="pt-2 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={form.cardExpiry}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">CVC Code</label>
                    <input
                      type="password"
                      name="cardCvc"
                      value={form.cardCvc}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Items & Pay Button */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                Order Review
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id || item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{item.selectedLicense || "Personal"} License</div>
                    </div>
                    <div className="font-bold text-slate-900">
                      {item.isFree ? "FREE" : `$${item.calculatedPrice || item.price || 0}`}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-base font-black text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-indigo-600">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition"
              >
                {loading ? "Processing Payment..." : `Pay $${subtotal.toFixed(2)} & Download`}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <FaShieldAlt className="text-emerald-600" /> Instant Access & Download License Guaranteed
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
