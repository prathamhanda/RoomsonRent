import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@heroui/button";

const Navbar = () => {
  const [supportOpen, setSupportOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="w-full flex justify-between items-center text-white py-8 px-20">
      <Link to="/" className="text-3xl font-bold">
        Rooms On Rent
      </Link>
      <div className="flex gap-7">
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
        {location.pathname === "/login" ? (
          <Button className="bg-[#FE6F61] text-white rounded-full font-semibold" onClick={() => window.location.href = '/'}>
            Home
          </Button>
        ) : (
          <Button className="bg-[#FE6F61] text-white rounded-full font-semibold" onClick={() => window.location.href = '/login'}>
            Login/ Sign Up
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;