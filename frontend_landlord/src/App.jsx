import React, { useState ,useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HeroComponent from "./components/Home/HeroComponent";
import HomePage from "./components/Home/HomePage";
import LandlordPage from "./components/Landlord/LandlordPage";
import NavbarMain from "./components/Navbar";
import LoginPage from "./components/Landlord/LoginPage";
import RegisterPage from "./components/Landlord/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import Auth
import { useNavigate } from "react-router-dom";
import LandlordPortalForm from "./components/Landlord/LandlordPortalForm";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);
  if (loading) return <p>Loading...</p>;
  return isAuthenticated ? children : null;
};



// Main App Component
function App() {
  return (
   <AuthProvider>
   <Router>
      <div className="min-h-screen">
        <NavbarMain />
        <Routes>
          <Route path="/" element={
            <HomePage/>
            } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
            <LandlordPage/>
            </ProtectedRoute>
            } />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/add-listing" element={<LandlordPortalForm/>} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;