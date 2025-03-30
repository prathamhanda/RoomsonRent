import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

const NavbarMain = () => {

  
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [scrolled, setScrolled] = useState(false);

  const routes = [
    {
      label: "Support",
      icon: "/images/media/Headphones Round.45f0c3b8.svg",
      subRoutes: [
        { label: "Quick Chat", icon: "💬", url: "#" },
        { label: "Whatsapp", icon: "📱", url: "#" },
        { label: "Facebook Messenger", icon: "📘", url: "#" },
        { label: "+91 6207409628", icon: "📞", url: "tel:+916207409628" },
        {
          label: "officialroomsonrent@gmail.com",
          icon: "✉️",
          url: "mailto:officialroomsonrent@gmail.com",
        },
        { label: "Help Center", icon: "❓", url: "#" },
        { label: "How It Works", icon: "ℹ️", url: "#" },
      ],
    },
    {
      label: "Wishlist",
      icon: "/images/media/Heart.7e108041.svg",
      url: "/wishlist",
    },
    {
      // Dynamic label based on current location
      label: location.pathname === "/login" ? "Home" : "Login/Sign Up",
      action: () => {
        if (location.pathname === "/login") {
          window.location.href = "/";
        } else {
          window.location.href = "/login";
        }
      },
    },
  ];

  
  // Check if current page is home
  const isHomePage = location.pathname === "/" || location.pathname === "/home" || location.pathname === "/dashboard";

  // Handle scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (label) => {
    setDropdownOpen((prev) => {
      const newState = { ...prev };
      // Close all other dropdowns
      Object.keys(newState).forEach(key => {
        if (key !== label) newState[key] = false;
      });
      // Toggle the current dropdown
      newState[label] = !prev[label];
      return newState;
    });
  };



  // Animation variants
  const navbarVariants = {
    initial: { 
      backgroundColor: "rgba(0, 0, 0, 0)",
      backdropFilter: "blur(0px)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0)"
    },
    scrolled: { 
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 12px -1px rgba(0, 0, 0, 0.1)"
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.3,
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { opacity: 0, x: -20 }
  };

  // Decide text color based on scroll state AND current page
  const getTextColorClass = () => {
    if (isHomePage) {
      // On homepage, white text initially, black when scrolled
      return scrolled ? "text-gray-800" : "text-white";
    } else {
      // On other pages, always black text
      return "text-gray-800";
    }
  };

  // Decide button color based on scroll state AND current page
  const getButtonColorClass = () => {
    if (isHomePage) {
      // On homepage, white button initially, red when scrolled
      return scrolled 
        ? "bg-[#FE6F61] text-white" 
        : "bg-white text-[#FE6F61]";
    } else {
      // On other pages, always red button
      return "bg-[#FE6F61] text-white";
    }
  };

  // Should icons be inverted (for white version on dark backgrounds)
  const shouldInvertIcons = !(isHomePage && !scrolled);

  const textColorClass = getTextColorClass();
  const buttonColorClass = getButtonColorClass();

  return (
    <motion.div
      initial="initial"
      animate={scrolled ? "scrolled" : "initial"}
      variants={navbarVariants}
      transition={{ duration: 0.3 }}
      className="fixed w-full z-50"
    >
      <Navbar className="bg-transparent p-0">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <NavbarBrand>
              <Link to="/" className={`text-2xl font-bold ${textColorClass}`}>
                Rooms On Rent
              </Link>
            </NavbarBrand>
          </motion.div>

          {/* Desktop Navigation */}
          <NavbarContent className="hidden md:flex space-x-6 items-center">
            {routes.map((route) => {
              if (route.subRoutes) {
                return (
                  <NavbarItem key={route.label} className="dropdown-container">
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          className={`flex items-center space-x-2 ${textColorClass} hover:bg-transparent focus:bg-transparent`}
                          onClick={() => toggleDropdown(route.label)}
                        >
                          <img
                            alt={route.label}
                            src={route.icon}
                            width="20"
                            height="20"
                            className={shouldInvertIcons ? "filter invert" : ""}
                          />
                          <span>{route.label}</span>
                          <svg
                            className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${dropdownOpen[route.label] ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </Button>
                      </motion.div>
                      <AnimatePresence>
                        {dropdownOpen[route.label] && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={dropdownVariants}
                            className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[240px] z-50"
                          >
                            {route.subRoutes.map((sub, index) => (
                              <motion.a
                                key={index}
                                href={sub.url}
                                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 group"
                                whileHover={{ 
                                  backgroundColor: "rgba(243, 244, 246, 0.8)",
                                  x: 5,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                <span className="text-lg group-hover:scale-110 transition-transform duration-200">{sub.icon}</span>
                                <span className="text-sm font-medium">
                                  {sub.label}
                                </span>
                              </motion.a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </NavbarItem>
                );
              } else if (route.url) {
                return (
                  <NavbarItem key={route.label}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to={route.url}
                        className={`flex items-center space-x-2 ${textColorClass}`}
                      >
                        {route.icon && (
                          <img
                            alt={route.label}
                            src={route.icon}
                            width="20"
                            height="20"
                            className={shouldInvertIcons ? "filter invert" : ""}
                          />
                        )}
                        <span>{route.label}</span>
                      </Link>
                    </motion.div>
                  </NavbarItem>
                );
              } else if (route.action) {
                return (
                  <NavbarItem key={route.label}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        className={`${buttonColorClass} rounded-full font-semibold px-6 py-2`}
                        onClick={route.action}
                      >
                        {route.label}
                      </Button>
                    </motion.div>
                  </NavbarItem>
                );
              }
              return null;
            })}
          </NavbarContent>

          {/* Mobile Menu Toggle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden z-50"
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 focus:outline-none ${isMenuOpen ? 'text-gray-800 ' : textColorClass || ""}`}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                )}
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 top-0 pt-20 bg-white shadow-lg z-40"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div className="container mx-auto">
                <motion.ul variants={menuVariants} className="space-y-4 bg-white px-4 py-4">
                  {routes.map((route) => {
                    if (route.subRoutes) {
                      return (
                        <motion.li key={route.label} variants={menuItemVariants}>
                          <div className="relative">
                            <button
                              className="flex w-full items-center justify-between py-3 text-gray-800 font-medium border-b border-gray-100"
                              onClick={() => toggleDropdown(route.label)}
                            >
                              <div className="flex items-center">
                                <img
                                  alt={route.label}
                                  src={route.icon}
                                  width="20"
                                  height="20"
                                  className="mr-3"
                                />
                                <span>{route.label}</span>
                              </div>
                              <svg
                                className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen[route.label] ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </button>
                            <AnimatePresence>
                              {dropdownOpen[route.label] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-2 pl-6 overflow-hidden"
                                >
                                  {route.subRoutes.map((sub, index) => (
                                    <motion.a
                                      key={index}
                                      href={sub.url}
                                      className="flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 text-gray-700 rounded-lg"
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ 
                                        delay: index * 0.05,
                                        duration: 0.2
                                      }}
                                    >
                                      <span className="text-lg">{sub.icon}</span>
                                      <span className="text-sm font-medium">
                                        {sub.label}
                                      </span>
                                    </motion.a>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.li>
                      );
                    } else if (route.url) {
                      return (
                        <motion.li key={route.label} variants={menuItemVariants}>
                          <Link
                            to={route.url}
                            className="flex items-center space-x-3 py-3 text-gray-800 font-medium border-b border-gray-100"
                          >
                            {route.icon && (
                              <img
                                alt={route.label}
                                src={route.icon}
                                width="20"
                                height="20"
                                className="mr-1"
                              />
                            )}
                            <span>{route.label}</span>
                          </Link>
                        </motion.li>
                      );
                    } else if (route.action) {
                      return (
                        <motion.li key={route.label} variants={menuItemVariants} className="mt-6">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-[#FE6F61] text-white rounded-full font-semibold w-full py-3"
                            onClick={route.action}
                          >
                            {route.label}
                          </motion.button>
                        </motion.li>
                      );
                    }
                    return null;
                  })}
                </motion.ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Navbar>
    </motion.div>
  );
};

export default NavbarMain;