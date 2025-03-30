import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroComponent = () => {
  const [showSupport, setShowSupport] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url("/api/placeholder/1600/900")', 
          filter: 'brightness(0.5)',
          backgroundColor: '#20365F' 
        }}
      />
      
      {/* Navigation Bar */}
      <nav className="relative z-10 flex justify-between items-center p-4 mx-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-3xl font-bold"
          style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}
        >
          Rooms On Rent
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6"
        >
          <motion.button 
            className="flex items-center text-white hover:text-gray-200 transition-colors duration-300" 
            onClick={() => setShowSupport(!showSupport)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </span>
            Support
          </motion.button>
          
          <motion.button 
            className="flex items-center text-white hover:text-gray-200 transition-colors duration-300" 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </span>
            Wishlist
          </motion.button>
          
          <motion.button 
            className="text-white font-medium py-2 px-5 rounded-full" 
            style={{ backgroundColor: '#FF7F61' }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 5px 15px rgba(255, 127, 97, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Login/ Sign Up
          </motion.button>
        </motion.div>
      </nav>
      
      {/* Support Dropdown */}
      <AnimatePresence>
        {showSupport && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-20 right-28 z-20 bg-white rounded-lg shadow-xl w-72 p-5 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">Support Now</h3>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSupport(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            </div>
            
            <div className="space-y-1">
              <motion.a 
                href="#" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 mr-3 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Quick Chat</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <p className="text-xs text-green-500">Online • Start a conversation</p>
                  </div>
                </div>
              </motion.a>
              
              <motion.a 
                href="https://wa.me/916207409628" 
                target="_blank" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 mr-3 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Whatsapp</p>
                  <p className="text-xs text-gray-500">Instant messaging support</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="https://m.me/roomsonrent" 
                target="_blank" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 mr-3 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Facebook Messenger</p>
                  <p className="text-xs text-gray-500">Connect with our FB page</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="tel:+916207409628" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 mr-3 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">+91 6207409628</p>
                  <p className="text-xs text-gray-500">Available 9 AM - 6 PM</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="mailto:officialroomsonrent@gmail.com" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 mr-3 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email Us</p>
                  <p className="text-xs text-gray-500">officialroomsonrent@gmail.com</p>
                </div>
              </motion.a>
            </div>
            
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <motion.a 
                  href="/help-center" 
                  className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-center"
                  whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                  <div className="w-8 h-8 mb-2 rounded-full flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <p className="font-medium text-sm">Help Center</p>
                </motion.a>
                
                <motion.a 
                  href="/how-it-works" 
                  className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-center"
                  whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                  <div className="w-8 h-8 mb-2 rounded-full flex items-center justify-center text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <p className="font-medium text-sm">How It Works</p>
                </motion.a>
                
                <motion.a 
                  href="/faq" 
                  className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-center"
                  whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                  <div className="w-8 h-8 mb-2 rounded-full flex items-center justify-center text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </div>
                  <p className="font-medium text-sm">FAQs</p>
                </motion.a>
                
                <motion.a 
                  href="/contact" 
                  className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-center"
                  whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                  <div className="w-8 h-8 mb-2 rounded-full flex items-center justify-center text-emerald-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <p className="font-medium text-sm">Contact Us</p>
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-1/2 mt-16">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white text-5xl font-bold text-center mb-4"
          style={{ textShadow: '0px 3px 6px rgba(0,0,0,0.4)' }}
        >
          Student Centric Accommodation Platform
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-white text-xl text-center mb-8"
          style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}
        >
          affordable & comfortable living, just steps away
        </motion.p>
        
        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="w-full max-w-3xl px-4"
        >
          <motion.div 
            className="bg-white rounded-full p-2 flex items-center shadow-lg"
            whileHover={{ boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
            animate={searchFocus ? { scale: 1.02 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <input 
              type="text" 
              placeholder="Search for your desired college, location or PG" 
              className="w-full px-4 py-2 rounded-full focus:outline-none"
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            <motion.button 
              className="p-2 rounded-full text-white" 
              style={{ backgroundColor: '#4169E1' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Feature Cards */}
      <div className="relative z-10 flex justify-center gap-6 mx-auto px-8 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          className="bg-white rounded-xl shadow-lg p-4 flex items-center w-80"
        >
          <motion.div className="mr-4 overflow-hidden rounded">
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
              src="/api/placeholder/100/100" 
              alt="Bed" 
              className="w-24 h-20 object-cover rounded" 
            />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold">1 lakh+ Beds</h3>
            <p className="text-gray-600 text-sm">Book the one perfect for you</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          className="bg-white rounded-xl shadow-lg p-4 flex items-center w-80"
        >
          <motion.div className="mr-4 overflow-hidden rounded">
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
              src="/api/placeholder/100/100" 
              alt="College" 
              className="w-24 h-20 object-cover rounded" 
            />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold">35+ DU Colleges</h3>
            <p className="text-gray-600 text-sm">Search accomodation by your college</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          className="bg-white rounded-xl shadow-lg p-4 flex items-center w-80"
        >
          <motion.div className="mr-4 overflow-hidden rounded">
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
              src="/api/placeholder/100/100" 
              alt="Rating" 
              className="w-24 h-20 object-cover rounded" 
            />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold">4.8+ Rating</h3>
            <p className="text-gray-600 text-sm">What our students think about us</p>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom section for "Your Perfect Accommodation" (visible in screenshot) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="relative z-10 w-full max-w-7xl mx-auto mt-16 px-8"
      >
        <div className="flex items-baseline">
          <h2 className="text-white text-3xl font-bold">Your </h2>
          <h2 className="text-coral-500 text-3xl font-bold ml-2" style={{ color: '#FF7F61' }}>Perfect</h2>
          <h2 className="text-white text-3xl font-bold ml-2">Accommodation</h2>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroComponent;