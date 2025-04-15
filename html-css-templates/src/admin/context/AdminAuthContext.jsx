import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("admin-token"));

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("admin-token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("admin-token");
  };

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
