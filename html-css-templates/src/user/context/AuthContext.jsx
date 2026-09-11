import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance, { setAccessToken } from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessTokenState, setAccessTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Silent refresh on app mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await axiosInstance.post("/auth/refresh-token");
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setAccessTokenState(res.data.accessToken);
        setUser(res.data.user);
      }
    } catch (_) {
      setAccessToken(null);
      setAccessTokenState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleLogoutEvent = () => {
      setAccessToken(null);
      setAccessTokenState(null);
      setUser(null);
    };

    window.addEventListener("auth:logout", handleLogoutEvent);
    return () => window.removeEventListener("auth:logout", handleLogoutEvent);
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    if (res.data?.accessToken) {
      setAccessToken(res.data.accessToken);
      setAccessTokenState(res.data.accessToken);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (registerData) => {
    const res = await axiosInstance.post("/auth/register", registerData);
    return res.data;
  };

  const verifyEmail = async (email, otp) => {
    const res = await axiosInstance.post("/auth/verify-email", { email, otp });
    return res.data;
  };

  const resendOTP = async (email) => {
    const res = await axiosInstance.post("/auth/resend-otp", { email });
    return res.data;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (_) {}
    setAccessToken(null);
    setAccessTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: accessTokenState,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        verifyEmail,
        resendOTP,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
