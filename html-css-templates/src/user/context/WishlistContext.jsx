// src/context/WishlistContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (template) => {
    const exists = wishlist.find((item) => item._id === template._id);
    if (exists) {
      setWishlist(wishlist.filter((item) => item._id !== template._id));
    } else {
      setWishlist([...wishlist, template]);
    }
  };

  const isInWishlist = (id) => wishlist.some((item) => item._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
