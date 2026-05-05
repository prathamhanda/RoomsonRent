import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { useAuth } from "@/context/AuthContext";
import backendURL from "@/config/config";
import { toast, Toaster } from 'react-hot-toast';

const Navbar = ({ textColor = "text-white", bgColor = "bg-transparent" }) => {
  const [supportOpen, setSupportOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, checkLogin } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendURL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        await checkLogin();
        toast.success('Logged out successfully!', {
          icon: '✅',
          duration: 3000
        });
        // Force refresh to ensure clean state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div className={`w-full flex justify-between items-center ${textColor} ${bgColor} py-8 px-20`}>
      <Toaster position="top-center" reverseOrder={false} />
      <Link to="/" className="text-3xl font-bold">
        Rooms On Rent
      </Link>
      <div className="flex gap-7 items-center">
        <div className="relative">
          <button
            className="flex gap-3 items-center h-full"
            onClick={() => setSupportOpen(!supportOpen)}
          >
            <img
              alt="support"
              src="/images/media/Headphones Round.45f0c3b8.svg"
              width="20"
              height="20"
            />
            Support
          </button>
          {supportOpen && (
            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">
                  Support Now
                </h3>
              </div>
              <div className="py-2">
                <a className="flex items-center px-4 py-2 hover:bg-gray-50" href="#">
                  <span className="w-8 h-8 flex items-center justify-center">💬</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Quick Chat</p>
                    <span className="text-xs text-green-500">Online</span>
                  </div>
                </a>
                <a className="flex items-center px-4 py-2 hover:bg-gray-50" href="#">
                  <span className="w-8 h-8 flex items-center justify-center">📱</span>
                  <p className="text-sm font-medium text-gray-700">Whatsapp</p>
                </a>
                <a className="flex items-center px-4 py-2 hover:bg-gray-50" href="#">
                  <span className="w-8 h-8 flex items-center justify-center">📘</span>
                  <p className="text-sm font-medium text-gray-700">Facebook Messenger</p>
                </a>
                <a className="flex items-center px-4 py-2 hover:bg-gray-50" href="tel:+916207409628">
                  <span className="w-8 h-8 flex items-center justify-center">📞</span>
                  <p className="text-sm font-medium text-gray-700">+91 6207409628</p>
                </a>
                <a className="flex items-center px-4 py-2 hover:bg-gray-50" href="mailto:officialroomsonrent@gmail.com">
                  <span className="w-8 h-8 flex items-center justify-center">✉️</span>
                  <p className="text-sm font-medium text-gray-700">officialroomsonrent@gmail.com</p>
                </a>
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Quick Links</h3>
                <a className="flex items-center px-4 py-2 hover:bg-gray-50" href="#">
                  <span className="w-8 h-8 flex items-center justify-center">❓</span>
                  <p className="text-sm font-medium text-gray-700">Help Center</p>
                </a>
                <a className="flex items-center px-4 py-2 hover:bg-gray-50" href="#">
                  <span className="w-8 h-8 flex items-center justify-center">ℹ️</span>
                  <p className="text-sm font-medium text-gray-700">How It Works</p>
                </a>
              </div>
            </div>
          )}
        </div>
        <a className="flex gap-3 items-center" href="/wishlist">
          <img alt="wishlist" src="/images/media/Heart.7e108041.svg" width="20" height="20" />
          Wishlist
        </a>
        
        {isAuthenticated && user ? (
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold border-2 border-white">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden md:block">{user.name || 'User'}</span>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.phone}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          location.pathname === "/login" || location.pathname === "/register" ? (
            <Button className="bg-[#FE6F61] text-white rounded-full font-semibold" onClick={() => navigate('/')}>
              Home
            </Button>
          ) : (
            <Button className="bg-[#FE6F61] text-white rounded-full font-semibold" onClick={() => navigate('/login')}>
              Login/ Sign Up
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;