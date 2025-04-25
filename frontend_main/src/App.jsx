import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import LandlordPage from "./components/Landlord/LandlordPage";
import PropertyBookingPage from "./components/Property/PropertyBookingPage";
import SiteVisitPage from "./components/Property/SiteVisitPage";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import UserProfile from "./components/User/UserProfile";
import { AuthProvider } from "./context/AuthContext";

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/landlord" element={<LandlordPage/>} />
            <Route path="/property/:id" element={<PropertyBookingPage/>} />
            <Route path="/property/:id/visit" element={<SiteVisitPage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/profile" element={<UserProfile/>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// // Home Page Component
// function HomePage() {
//   return (
//     <div>
//       <HomePage />
//     </div>
//   );
// }

export default App;
