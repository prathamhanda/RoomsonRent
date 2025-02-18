import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg font-montserrat">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-[#FE6F61] text-2xl font-bold">
              UniLodge
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-[#FE6F61] px-3 py-2 rounded-md font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-[#FE6F61] px-3 py-2 rounded-md font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#FE6F61] px-3 py-2 rounded-md font-medium">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
