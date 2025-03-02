import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  return (
    <nav className="shadow-lg bg-transparent font-montserrat sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-[#FE6F61] text-2xl font-bold">
              Rooms On Rent
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-[#FE6F61] px-3 py-2 rounded-md font-medium">
              Home
            </Link>
            
            <Link to="/contact" className="text-gray-700 hover:text-[#FE6F61] px-3 py-2 rounded-md font-medium">
              Contact
            </Link>
            <Link to="/createlisting" className="text-gray-700 hover:text-[#FE6F61] px-3 py-2 rounded-md font-medium">
              Create Listing
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#FE6F61] focus:outline-none"
            >
              <svg 
                className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-transparent shadow-lg">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-[#FE6F61] block px-3 py-2 rounded-md font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-gray-700 hover:text-[#FE6F61] block px-3 py-2 rounded-md font-medium"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-700 hover:text-[#FE6F61] block px-3 py-2 rounded-md font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;