import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import LandlordPage from "./components/Landlord/LandlordPage";
import PropertyDetailsPage from "./components/Property/PropertyDetailsPage";
import SiteVisitPage from "./components/Property/SiteVisitPage";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import UserProfile from "./components/User/UserProfile";
import SearchPage from "./components/Search/SearchPage";
import SchemaExplorer from "./components/Admin/SchemaExplorer";
import { AuthProvider } from "./context/AuthContext";

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/search" element={<SearchPage/>} />
            <Route path="/schema" element={<SchemaExplorer/>} />
            <Route path="/landlord" element={<LandlordPage/>} />
            <Route path="/property/:id" element={<PropertyDetailsPage/>} />
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
