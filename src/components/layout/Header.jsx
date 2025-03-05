import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Check if page is scrolled for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Animation variants
  const menuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <header 
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#FE6F61] flex items-center">
            <img src="/logo.png" alt="RoomsOnRent" className="h-8 w-auto mr-2" />
            RoomsOnRent
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${
                location.pathname === '/' 
                  ? 'text-[#FE6F61]' 
                  : 'text-gray-700 hover:text-[#FE6F61]'
              } font-medium transition-colors duration-200`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`${
                location.pathname === '/search' 
                  ? 'text-[#FE6F61]' 
                  : 'text-gray-700 hover:text-[#FE6F61]'
              } font-medium transition-colors duration-200`}
            >
              Search
            </Link>
            {user && user.role === 'owner' && (
              <Link 
                to="/dashboard" 
                className={`${
                  location.pathname.includes('/dashboard') 
                    ? 'text-[#FE6F61]' 
                    : 'text-gray-700 hover:text-[#FE6F61]'
                } font-medium transition-colors duration-200`}
              >
                Dashboard
              </Link>
            )}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-[#FE6F61] focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium uppercase mr-2">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium">{user.name.split(' ')[0]}</span>
                  <svg className="ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      {user.role === 'user' && (
                        <>
                          <Link 
                            to="/profile/bookings" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Bookings
                          </Link>
                          <Link 
                            to="/favorites" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Favorites
                          </Link>
                        </>
                      )}
                      {user.role === 'owner' && (
                        <Link 
                          to="/dashboard/listings/create" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Add Listing
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {!user && (
              <>
                <Link 
                  to="/login" 
                  className={`${
                    location.pathname === '/login' 
                      ? 'text-[#FE6F61]' 
                      : 'text-gray-700 hover:text-[#FE6F61]'
                  } font-medium transition-colors duration-200`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-[#FE6F61] text-white px-4 py-2 rounded-lg hover:bg-[#e55a4d] transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <motion.nav className="flex flex-col py-2" variants={menuVariants}>
                <motion.div variants={itemVariants}>
                  <Link 
                    to="/" 
                    className={`block px-4 py-3 ${
                      location.pathname === '/' 
                        ? 'text-[#FE6F61] bg-gray-50' 
                        : 'text-gray-700 hover:text-[#FE6F61] hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Link 
                    to="/search" 
                    className={`block px-4 py-3 ${
                      location.pathname === '/search' 
                        ? 'text-[#FE6F61] bg-gray-50' 
                        : 'text-gray-700 hover:text-[#FE6F61] hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Search
                  </Link>
                </motion.div>
                
                {user && user.role === 'owner' && (
                  <motion.div variants={itemVariants}>
                    <Link 
                      to="/dashboard" 
                      className={`block px-4 py-3 ${
                        location.pathname.includes('/dashboard') 
                          ? 'text-[#FE6F61] bg-gray-50' 
                          : 'text-gray-700 hover:text-[#FE6F61] hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                )}

                {user && (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link 
                        to="/profile" 
                        className={`block px-4 py-3 ${
                          location.pathname === '/profile' 
                            ? 'text-[#FE6F61] bg-gray-50' 
                            : 'text-gray-700 hover:text-[#FE6F61] hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                    </motion.div>
                    
                    {user.role === 'user' && (
                      <>
                        <motion.div variants={itemVariants}>
                          <Link 
                            to="/profile/bookings" 
                            className={`block px-4 py-3 ${
                              location.pathname === '/profile/bookings' 
                                ? 'text-[#FE6F61] bg-gray-50' 
                                : 'text-gray-700 hover:text-[#FE6F61] hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            My Bookings
                          </Link>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <Link 
                            to="/favorites" 
                            className={`block px-4 py-3 ${
                              location.pathname === '/favorites' 
                                ? 'text-[#FE6F61] bg-gray-50' 
                                : 'text-gray-700 hover:text-[#FE6F61] hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Favorites
                          </Link>
                        </motion.div>
                      </>
                    )}
                    
                    {user.role === 'owner' && (
                      <motion.div variants={itemVariants}>
                        <Link 
                          to="/dashboard/listings/create" 
                          className={`block px-4 py-3 ${
                            location.pathname === '/dashboard/listings/create' 
                              ? 'text-[#FE6F61] bg-gray-50' 
                              : 'text-gray-700 hover:text-[#FE6F61] hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Add Listing
                        </Link>
                      </motion.div>
                    )}
                    
                    <motion.div variants={itemVariants}>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
                
                {!user && (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link 
                        to="/login" 
                        className={`block px-4 py-3 ${
                          location.pathname === '/login' 
                            ? 'text-[#FE6F61] bg-gray-50' 
                            : 'text-gray-700 hover:text-[#FE6F61] hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Link 
                        to="/register" 
                        className="block px-4 py-3 bg-[#FE6F61] text-white hover:bg-[#e55a4d] m-3 rounded-lg text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header; 