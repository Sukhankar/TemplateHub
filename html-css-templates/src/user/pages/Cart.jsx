import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { FaTrash, FaShoppingCart, FaArrowRight, FaShieldAlt, FaTag } from "react-icons/fa";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "SAVE20") {
      setDiscount(0.2); // 20% discount
      setPromoMsg("Promo code SAVE20 applied! (20% OFF)");
    } else {
      setPromoMsg("Invalid promo code. Try 'SAVE20'.");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.isFree ? 0 : item.calculatedPrice || item.price || 0),
    0
  );

  const discountAmount = subtotal * discount;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <section className="pt-28 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <h1 className="text-3xl font-black">Your Shopping Cart</h1>
          <p className="text-xs text-slate-400">
            Review your selected website templates and license options before checkout.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl mx-auto">
              <FaShoppingCart />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your Cart is Empty</h3>
            <p className="text-xs text-slate-500">
              Browse our marketplace to find premium HTML, React, and Tailwind website templates.
            </p>
            <Link
              to="/templates"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Cart Item List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-bold text-base text-slate-900">
                  Cart Items ({cartItems.length})
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => {
                  const itemPrice = item.isFree
                    ? 0
                    : item.calculatedPrice || item.price || 0;
                  return (
                    <div
                      key={item._id || item.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.previewImages?.[0] || item.image || "/placeholder.jpg"}
                          alt={item.title}
                          className="w-24 h-16 object-cover rounded-xl border border-slate-100 bg-slate-100 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            {item.category || "Template"}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 capitalize">
                            License: {item.selectedLicense || "Personal"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="font-black text-lg text-slate-900">
                          {item.isFree || itemPrice === 0 ? (
                            <span className="text-emerald-600">FREE</span>
                          ) : (
                            `$${itemPrice}`
                          )}
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id || item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition"
                          title="Remove item"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Summary & Checkout Card */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                  Order Summary
                </h3>

                {/* Promo Input */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SAVE20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase outline-none focus:border-indigo-600"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 text-white font-bold px-3 py-2 rounded-xl text-xs hover:bg-slate-800"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMsg && (
                    <p
                      className={`text-[11px] font-medium ${
                        discount > 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {promoMsg}
                    </p>
                  )}
                </form>

                {/* Subtotal Breakdown */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount (20%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Processing & Instant Delivery:</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total Amount:</span>
                    <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition"
                >
                  Proceed to Checkout <FaArrowRight />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                  <FaShieldAlt className="text-indigo-600" /> 256-Bit SSL Encrypted Payment
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
