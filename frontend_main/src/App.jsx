import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HeroComponent from "./components/Home/HeroComponent";
import HomePage from "./components/Home/HomePage";
import LandlordPage from "./components/Landlord/LandlordPage";
import PropertyBookingPage from "./components/Property/PropertyBookingPage";

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/landlord" element={<LandlordPage/>} />
          <Route path="/property/:id" element={<PropertyBookingPage/>} />
        </Routes>
      </div>
    </Router>
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
