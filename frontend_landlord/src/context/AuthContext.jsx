import backendURL from "@/config/config";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    try {
      const response = await fetch(backendURL + "/api/auth/checkLogin", { credentials: "include" });
      const data = await response.json();
      setIsAuthenticated(data.status);
    } catch (error) {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const logout = async () => {
    await fetch(backendURL + "/api/auth/logout", { method: "POST", credentials: "include" });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);