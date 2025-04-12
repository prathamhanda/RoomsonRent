import backendURL from "@/config/config";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkLogin = async () => {
    try {
      const response = await fetch(backendURL + "/api/auth/checkLogin", { credentials: "include" });
      const data = await response.json();
      setIsAuthenticated(data.status);
      if (data.status && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);