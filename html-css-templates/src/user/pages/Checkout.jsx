// src/pages/Checkout.jsx
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import Loader from "../components/Loading";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate payment process
      alert("✅ Payment Successful! Thank you for your purchase.");
      clearCart();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <section className="pt-28 px-4 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">💳 Checkout</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Billing Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-between items-center mt-6">
                <h4 className="text-lg font-semibold text-gray-800">Total: ${totalPrice}</h4>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
                >
                  Pay & Download
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Checkout;
