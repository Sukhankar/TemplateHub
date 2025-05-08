// src/pages/Cart.jsx
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <Navbar />
      <section className="pt-28 px-4 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">🛒 Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 border-b pb-4 border-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-18 object-cover rounded-lg"
                      style={{ aspectRatio: '4/3' }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-200"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-900">Total: ${totalPrice}</h4>
                <div className="flex gap-3">
                  <Link 
                    to="/checkout" 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={clearCart}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Cart;
