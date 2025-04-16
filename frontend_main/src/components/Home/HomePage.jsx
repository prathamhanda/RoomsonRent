import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@heroui/card";
import {Button, ButtonGroup} from "@heroui/button";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [mobileSupportOpen, setMobileSupportOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Close menu when user clicks escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    
    if (menuOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const colleges = [
    "Zakir Husain College Delhi",
    "Jesus and Mary College",
    "Sri Guru Gobind Singh College of Commerce",
    "Shri Ram College of Commerce",
    "Sri Venkateswara College",
    "Lady Shri Ram College for Women",
    "Hindu College",
    "Hansraj College",
    "Gargi College",
    "Daulat Ram College",
    "Delhi College of Arts & Commerce",
    "Deen Dayal Upadhyaya College",
    "Indraprastha College for Women",
    "Janki Devi Memorial College",
    "Kamala Nehru College",
    "Kirori Mal College",
    "Lakshmibai College",
    "Maitreyi College",
    "Miranda House",
    "Motilal Nehru College",
    "PGDAV College",
    "Ramjas College",
    "Shaheed Bhagat Singh College",
    "Shivaji College",
    "Sri Aurobindo College",
    "Sri Guru Tegh Bahadur Khalsa College",
    "Vivekananda College",
    "Atma Ram Sanatan Dharma College",
    "Bhaskaracharya College of Applied Sciences",
    "Deshbandhu College",
    "Maharaja Agrasen College",
    "Rajdhani College",
    "Ramanujan College",
    "Shaheed Rajguru College of Applied Sciences for Women",
    "Swami Shraddhanand College",
    "Acharya Narendra Dev College",
    "Aditi Mahavidyalaya",
    "Aryabhatta College",
    "College of Vocational Studies",
    "Dyal Singh College",
    "Institute of Home Economics",
    "Jawaharlal Nehru Rajkiya Mahavidyalaya",
    "Kalindi College",
    "Keshav Mahavidyalaya",
    "Maharishi Valmiki College of Education",
    "Moti Lal Nehru College (Evening)",
    "PGDAV College (Evening)",
    "Pannalal Girdharlal Dayanand Anglo Vedic College",
    "Ram Lal Anand College",
    "Satyawati College",
    "Satyawati College (Evening)",
    "Shaheed Sukhdev College of Business Studies",
    "Shyam Lal College",
    "Shyam Lal College (Evening)",
    "Sri Guru Nanak Dev Khalsa College",
    "Swami Vivekananda College",
    "Bhagini Nivedita College",
    "Delhi Pharmaceutical Sciences and Research University",
    "Dr. Bhim Rao Ambedkar College",
    "Ghalib Institute",
    "Guru Gobind Singh Indraprastha University",
    "Indian Institute of Technology Delhi",
    "Indira Gandhi Delhi Technical University for Women",
    "Jamia Hamdard",
    "Jamia Millia Islamia",
    "Lady Irwin College",
    "Maharaja Surajmal Institute",
    "Netaji Subhas University of Technology",
    "School of Planning and Architecture, Delhi",
    "University of Delhi"
  ];

  const filteredColleges = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase().trim();
    if (query === '') return [];
    
    const startsWithQuery = [];
    const containsQuery = [];
    
    colleges.forEach(college => {
      const lowerCollege = college.toLowerCase();
      if (lowerCollege.startsWith(query)) {
        startsWithQuery.push(college);
      } else if (lowerCollege.includes(query)) {
        containsQuery.push(college);
      }
    });
    
    return [...startsWithQuery.sort(), ...containsQuery.sort()];
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (college) => {
    setSearchQuery(college);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://backend.roomsonrent.in/api/listings', {
          params: {
            limit: 10,
            sort: '-createdAt'
          }
        });
        
        if (response.data.success) {
          setListings(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to fetch listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Replace mock regularRooms with transformed listings data
  const regularRooms = useMemo(() => {
    return listings.map(listing => {
      // Find an appropriate room image
      let roomImage = "/images/78c3c990590b6c112e5b5cb34f1fbfac.webp"; // Default fallback image

      // First try to get image from first room of first floor
      if (listing.floors && listing.floors.length > 0 && 
          listing.floors[0].rooms && listing.floors[0].rooms.length > 0 && 
          listing.floors[0].rooms[0].photos && listing.floors[0].rooms[0].photos.length > 0) {
        roomImage = listing.floors[0].rooms[0].photos[0];
      } else {
        // If not found, look through all floors and rooms for the first available image
        for (const floor of listing.floors || []) {
          let imageFound = false;
          for (const room of floor.rooms || []) {
            if (room.photos && room.photos.length > 0) {
              roomImage = room.photos[0];
              imageFound = true;
              break;
            }
          }
          if (imageFound) break;
        }
      }

      return {
        id: listing._id,
        name: listing.title,
        location: `${listing.address}, ${listing.location?.city || ''}`,
        price: listing.price?.toLocaleString() || "---",
        amenities: [
          ...(listing.furnishingStatus === "Furnished" ? ["A/C"] : []),
          ...(listing.amenities?.includes("Wi-Fi") ? ["WiFi"] : []),
          ...(listing.propertyType === "Boys PG" || listing.propertyType === "Girls PG" ? ["Single Occupancy"] : []),
          ...(listing.propertyType === "PG" ? ["Triple Occupancy"] : []),
          ...(listing.available ? ["Short Stay"] : [])
        ],
        image: roomImage
      };
    });
  }, [listings]);

  const premiumRooms = [
    {
      id: 1,
      name: "Micheal Jackson 1st Floor R2",
      location: "Vasanat Vihar, South Delhi",
      price: "7,000",
      amenities: ["A/C", "WiFi", "Single Occupancy", "Short Stay"],
      image: "/images/78c3c990590b6c112e5b5cb34f1fbfac.webp",
    },
    {
      id: 2,
      name: "Micheal Jackson 1st Floor R3",
      location: "Vasanat Vihar, South Delhi",
      price: "8,000",
      amenities: ["WiFi", "Triple Occupancy"],
      image: "/images/7a003bb4ff178a2ea451a316e3b92202.webp",
    },
    {
      id: 3,
      name: "Micheal Jackson 1st Floor R3",
      location: "Vasanat Vihar, South Delhi",
      price: "8,000",
      amenities: ["WiFi", "Triple Occupancy"],
      image: "/images/7a003bb4ff178a2ea451a316e3b92202.webp",
    },
    {
      id: 4,
      name: "Micheal Jackson 1st Floor R3",
      location: "Vasanat Vihar, South Delhi",
      price: "8,000",
      amenities: ["WiFi", "Triple Occupancy"],
      image: "/images/7a003bb4ff178a2ea451a316e3b92202.webp",
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ram Kapoor",
      college: "St. Stephens College",
      rating: 4,
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ram Kapoor",
      college: "St. Stephens College",
      rating: 4,
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ram Kapoor",
      college: "St. Stephens College",
      rating: 4,
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ram Kapoor",
      college: "St. Stephens College",
      rating: 4,
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Background */}
      <div className="relative">
        <img
          src="/ror-home-img.webp"
          alt="home"
          priority="true"
          fetchPriority="high"
          rel="preload"
          as="image"
          className="absolute -z-20 pointer-events-none select-none h-[450px] md:h-[650px] w-full object-cover"
        /> 

        {/* Header */}
        <div className="w-full flex justify-between items-center text-white py-4 md:py-8 px-4 md:px-20">
          <Link href="/" className="text-2xl md:text-3xl font-bold relative z-30">
            Rooms On Rent
          </Link>
          
          {/* Mobile menu button with animation */}
          <div className="md:hidden relative z-30">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex flex-col justify-center items-center focus:outline-none"
              aria-label="Toggle menu"
            >
              <span 
                className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${menuOpen ? 'transform rotate-45 translate-y-1.5' : 'mb-1.5'}`} 
              />
              <span 
                className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${menuOpen ? 'opacity-0' : 'mb-1.5'}`} 
              />
              <span 
                className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${menuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`} 
              />
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-7">
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
                    <a
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      href="#"
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        💬
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Quick Chat
                        </p>
                        <span className="text-xs text-green-500">Online</span>
                      </div>
                    </a>
                    <a
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      href="#"
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        📱
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        Whatsapp
                      </p>
                    </a>
                    <a
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      href="#"
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        📘
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        Facebook Messenger
                      </p>
                    </a>
                    <a
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      href="tel:+916207409628"
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        📞
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        +91 6207409628
                      </p>
                    </a>
                    <a
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      href="mailto:officialroomsonrent@gmail.com"
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        ✉️
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        officialroomsonrent@gmail.com
                      </p>
                    </a>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Quick Links
                    </h3>
                    <a
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      href="#"
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        ❓
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        Help Center
                      </p>
                    </a>
                    <a
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      href="#"
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        ℹ️
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        How It Works
                      </p>
                    </a>
                  </div>
                </div>
              )}
            </div>
            <a className="flex gap-3 items-center" href="/wishlist">
              <img
                alt="wishlist"
                src="/images/media/Heart.7e108041.svg"
                width="20"
                height="20"
              />
              Wishlist
            </a>
            <Button className="bg-[#FE6F61] text-white rounded-full font-semibold">
              Login/ Sign Up
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay with Animation */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop with fade animation */}
              <motion.div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setMenuOpen(false)}
              />
              
              {/* Slide-in menu */}
              <motion.div 
                className="fixed right-0 top-0 h-screen w-[280px] bg-white z-50 md:hidden p-6 shadow-xl flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                  <button 
                    onClick={() => setMenuOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-gray-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-col space-y-6">
                  <div className="relative">
                    <button 
                      className="flex items-center justify-between w-full space-x-3 text-gray-700 hover:text-[#FE6F61] transition-colors py-2 border-b border-gray-100"
                      onClick={() => setMobileSupportOpen(!mobileSupportOpen)}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          alt="support"
                          src="/images/media/Headphones Round.45f0c3b8.svg"
                          width="20"
                          height="20"
                          className="text-current"
                        />
                        <span className="text-lg">Support</span>
                      </div>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transition-transform duration-200 ${mobileSupportOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Support dropdown content */}
                    <AnimatePresence>
                      {mobileSupportOpen && (
                        <motion.div 
                          className="bg-gray-50 rounded-lg mt-2 overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="py-2">
                            <a
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                              href="#"
                            >
                              <span className="w-8 h-8 flex items-center justify-center">
                                💬
                              </span>
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Quick Chat
                                </p>
                                <span className="text-xs text-green-500">Online</span>
                              </div>
                            </a>
                            <a
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                              href="#"
                            >
                              <span className="w-8 h-8 flex items-center justify-center">
                                📱
                              </span>
                              <p className="text-sm font-medium text-gray-700">
                                Whatsapp
                              </p>
                            </a>
                            <a
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                              href="#"
                            >
                              <span className="w-8 h-8 flex items-center justify-center">
                                📘
                              </span>
                              <p className="text-sm font-medium text-gray-700">
                                Facebook Messenger
                              </p>
                            </a>
                            <a
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                              href="tel:+916207409628"
                            >
                              <span className="w-8 h-8 flex items-center justify-center">
                                📞
                              </span>
                              <p className="text-sm font-medium text-gray-700">
                                +91 6207409628
                              </p>
                            </a>
                            <a
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                              href="mailto:officialroomsonrent@gmail.com"
                            >
                              <span className="w-8 h-8 flex items-center justify-center">
                                ✉️
                              </span>
                              <p className="text-sm font-medium text-gray-700">
                                officialroomsonrent@gmail.com
                              </p>
                            </a>
                          </div>
                          <div className="px-4 py-2 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">
                              Quick Links
                            </h3>
                            <a
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                              href="#"
                            >
                              <span className="w-8 h-8 flex items-center justify-center">
                                ❓
                              </span>
                              <p className="text-sm font-medium text-gray-700">
                                Help Center
                              </p>
                            </a>
                            <a
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                              href="#"
                            >
                              <span className="w-8 h-8 flex items-center justify-center">
                                ℹ️
                              </span>
                              <p className="text-sm font-medium text-gray-700">
                                How It Works
                              </p>
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <a 
                    href="/wishlist" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-[#FE6F61] transition-colors py-2 border-b border-gray-100"
                  >
                    <img
                      alt="wishlist"
                      src="/images/media/Heart.7e108041.svg"
                      width="20"
                      height="20"
                      className="text-current"
                    />
                    <span className="text-lg">Wishlist</span>
                  </a>
                  
                  <div className="mt-auto pt-6">
                    <Button 
                      className="bg-[#FE6F61] text-white rounded-full font-semibold w-full py-3 text-lg shadow-md hover:shadow-lg transition-shadow" 
                      onClick={() => setMenuOpen(false)}
                    >
                      Login/ Sign Up
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <div
          className="text-white flex flex-col gap-4 items-center h-24 px-4 text-center"
          style={{ marginTop: "64px", marginBottom: "24px" }}
        >
          <span className="text-3xl md:text-5xl font-bold tracking-wider">
            Student Centric Accommodation Platform
          </span>
          <span className="text-lg md:text-2xl tracking-wider">
            affordable & comfortable living, just steps away from campus!
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center relative px-4 w-full pb-12 md:pb-16">
          <form className="flex gap-2 w-full max-w-xl mx-auto" style={{ marginTop: "80px", marginBottom: "20px" }} onSubmit={(e) => e.preventDefault()}>
            <div className="flex w-full flex-col relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="w-full"
              >
                <motion.div
                  className="bg-white rounded-full p-2 flex items-center shadow-lg"
                  whileHover={{ boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
                  animate={searchFocus ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search college or location"
                    className="w-full px-4 py-2 rounded-full focus:outline-none text-sm md:text-base"
                    onFocus={() => {
                      setSearchFocus(true);
                      setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      setSearchFocus(false);
                      // Delay hiding suggestions to allow for clicks
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                  />
                  <motion.button
                    className="p-2 rounded-full text-white"
                    style={{ backgroundColor: "#fe6f61" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle search submission here
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </motion.button>
                </motion.div>
                
                {/* Search Suggestions */}
                {showSuggestions && filteredColleges.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 max-h-48 md:max-h-60 overflow-y-auto z-50"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#fe6f61 #f1f1f1'
                    }}
                  >
                    {filteredColleges.map((college, index) => (
                      <motion.div
                        key={index}
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-left text-xs md:text-sm"
                        onClick={() => handleSuggestionClick(college)}
                        whileHover={{ x: 5, backgroundColor: "rgba(254, 111, 97, 0.1)" }}
                      >
                        {college}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </form>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-4 md:px-20 py-8 md:py-10">
        <div className="flex flex-col gap-6 md:gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white rounded-xl shadow-xl border border-gray-300 text-center hover:shadow-2xl hover:border-[#FE6F61] transition-all duration-300">
                <div className="flex items-center flex-col gap-4 md:gap-6 py-4 self-center">
                  <motion.img
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    alt="icon"
                    src="/images/media/c1.webp"
                    width="40"
                    height="40"
                    className="md:w-[48px] md:h-[48px]"
                  />
                  <div className="flex text-center flex-col gap-2 md:gap-4 px-2">
                    <span className="text-base md:text-lg font-bold">One Click Booking</span>
                    <span className="text-xs">
                      Book your perfect student accommodation instantly
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white rounded-xl shadow-xl border border-gray-300 text-center hover:shadow-2xl hover:border-[#FE6F61] transition-all duration-300">
                <div className="flex items-center flex-col gap-4 md:gap-6 py-4 self-center">
                  <motion.img
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    alt="icon"
                    src="/images/media/c2.webp"
                    width="40"
                    height="40"
                    className="md:w-[48px] md:h-[48px]"
                  />
                  <div className="flex text-center flex-col gap-2 md:gap-4 px-2">
                    <span className="text-base md:text-lg font-bold">
                      Lowest Price Guaranteed
                    </span>
                    <span className="text-xs">
                      Find a lower price and we will match it
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white rounded-xl shadow-xl border border-gray-300 text-center hover:shadow-2xl hover:border-[#FE6F61] transition-all duration-300">
                <div className="flex items-center flex-col gap-4 md:gap-6 py-4 self-center">
                  <motion.img
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    alt="icon"
                    src="/images/media/c3.webp"
                    width="40"
                    height="40"
                    className="md:w-[48px] md:h-[48px]"
                  />
                  <div className="flex text-center flex-col gap-2 md:gap-4 px-2">
                    <span className="text-base md:text-lg font-bold">24/7 Customer Support</span>
                    <span className="text-xs">
                      Each query will be answered instantly
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white rounded-xl shadow-xl border border-gray-300 text-center hover:shadow-2xl hover:border-[#FE6F61] transition-all duration-300">
                <div className="flex items-center flex-col gap-4 md:gap-6 py-4 self-center">
                  <motion.img
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    alt="icon"
                    src="/images/media/c4.webp"
                    width="40"
                    height="40"
                    className="md:w-[48px] md:h-[48px]"
                  />
                  <div className="flex text-center flex-col gap-2 md:gap-4 px-2">
                    <span className="text-base md:text-lg font-bold">
                      100% Verified Properties
                    </span>
                    <span className="text-xs">
                      We only list after proper research
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Regular Accommodation Listings */}
      <div className="bg-[#F9FAFB] px-4 md:px-20 py-8 md:py-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 md:gap-3">
            <p className="font-bold text-2xl md:text-4xl">
              Your <span className="text-[#fe6f61]">Perfect</span> Accommodation
            </p>
          </div>

          <div className="flex items-center relative group">
            <button className="absolute left-0 md:-left-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl">
              ‹
            </button>
            <div className="flex overflow-x-scroll scroll-smooth gap-4 md:gap-6 p-2 md:p-4 w-full scrollbar-hide pl-8 md:pl-4 pr-8 md:pr-4">
              {regularRooms.map((room) => (
                <div key={room.id}>
                  <Card className="h-[220px] w-[300px] md:w-[500px] p-3 bg-white">
                    <div className="rounded-lg p-0 border-1 border-[#D8D8D8]">
                      <div className="flex h-full">
                        <img
                          alt="room"
                          src={room.image}
                          width="200"
                          height="200"
                          className="object-cover h-full w-2/5 rounded-l-md"
                          loading="lazy"
                        />
                        <div className="flex flex-col justify-between p-2 md:p-3 w-full">
                          <div className="flex flex-col">
                            <div>
                              <Link
                                to={`/property/${room.id}`}
                                className="font-semibold hover:underline text-sm md:text-base"
                              >
                                {room.name}
                              </Link>
                              <p className="text-[10px] md:text-xs text-[#979797] ml-[2px]">
                                {room.location}
                              </p>
                              <div className="h-1"></div>
                              <div className="flex gap-1 flex-wrap">
                                {room.amenities.map((amenity, index) => {
                                  let colorClass = "";
                                  let iconSrc = "";

                                  if (amenity === "A/C" || amenity === "WiFi") {
                                    colorClass = "bg-[#F0FFF0] text-[#3EAF3F]";
                                    iconSrc = amenity === "A/C" 
                                      ? "/images/media/ac.0f94ec49.svg"
                                      : "/images/media/wifi.b765d654.svg";
                                  } else if (amenity === "Single Occupancy" || amenity === "Triple Occupancy") {
                                    colorClass = "bg-[#FFFCF0] text-[#FFC130]";
                                    iconSrc = amenity === "Single Occupancy"
                                      ? "/images/media/single_occu.2c89da93.svg"
                                      : "/images/media/multi_occu.83dd5276.svg";
                                  } else if (amenity === "Short Stay") {
                                    colorClass = "bg-[#ffeaee] text-[#ed3a56]";
                                    iconSrc = "/images/media/short_stay_pink.5c3b7b9d.svg";
                                  }

                                  return (
                                    <div
                                      key={index}
                                      className={`rounded-[0.3rem] flex gap-1 text-[8px] md:text-[10px] items-center justify-between p-[5px] font-semibold ${colorClass}`}
                                    >
                                      <img
                                        alt={amenity}
                                        src={iconSrc}
                                        width="16"
                                        height="16"
                                        className="object-cover w-3 h-3 md:w-4 md:h-4"
                                      />
                                      {amenity}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold text-[10px] md:text-xs">
                              Rs.{" "}
                              <span className="text-base md:text-lg">{room.price}/-</span>{" "}
                              per month
                            </p>
                            <div className="flex gap-2 md:gap-3 mt-auto">
                              <Button
                                as={Link}
                                to={`/property/${room.id}`}
                                className="flex text-white rounded-xl bg-[#FE6F61] font-semibold text-xs md:text-sm py-1 px-2 md:px-3"
                              >
                                Book Now
                              </Button>
                              <Button
                                as={Link}
                                to={`/property/${room.id}/visit`}
                                variant="bordered"
                                className="flex-1 font-semibold border-[#FE6F61] text-[#FE6F61] text-xs md:text-sm py-1 px-2 md:px-3"
                              >
                                Site Visit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <button className="absolute right-0 md:-right-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Premium Accommodation Section */}
      <div className="px-4 md:px-20 py-8 md:py-10">
        <div className="flex flex-col gap-5 bg-[#F8F3EF] border-[#C59856] border-2 rounded-3xl p-4 md:p-6 relative">
          <div className="absolute w-[100px] md:w-[200px] right-0 top-0 h-full rounded-r-[22px] bg-gradient-to-r from-[#C59856]/0 via-[#C59856]/30 via-48% to-[#C59856]/50"></div>
          <p className="font-bold text-2xl md:text-4xl text-[#AE8549] flex items-center gap-3">
            <img
              alt="star"
              src="/images/media/Star 1.992519b2.svg"
              width="24"
              height="24"
              className="md:w-[32px] md:h-[31px]"
            />
            Premium Accommodation Show-Off
          </p>

          <div className="flex items-center relative group">
            <button className="absolute left-0 md:-left-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl">
              ‹
            </button>
            <div className="flex overflow-x-scroll scroll-smooth gap-4 md:gap-6 p-2 md:p-4 w-full scrollbar-hide pl-8 md:pl-4 pr-8 md:pr-4">
              {premiumRooms.map((room) => (
                <div key={room.id}>
                  <Card className="h-[220px] w-[300px] md:w-[500px] p-3 border-1 border-[#C59856] bg-white">
                    <div className="rounded-lg p-0">
                      <div className="flex h-full">
                        <img
                          alt="room"
                          src={room.image}
                          width="200"
                          height="200"
                          className="object-cover h-full w-2/5 rounded-l-md"
                          loading="lazy"
                        />
                        <div className="flex flex-col justify-between p-2 md:p-3 w-full">
                          <div className="flex flex-col">
                            <p className="flex items-center gap-2 text-[#C59856] text-[10px] md:text-xs bg-opacity-10 rounded-md px-2 py-1 self-start">
                              <img
                                alt="crown"
                                src="/images/media/premium_crown.793445f4.svg"
                                width="12"
                                height="10"
                                className="md:w-[14px] md:h-[12px]"
                              />
                              Premium
                            </p>
                            <div>
                              <Link
                                to={`/property/${room.id}`}
                                className="font-semibold hover:underline text-sm md:text-base"
                              >
                                {room.name}
                              </Link>
                              <p className="text-[10px] md:text-xs text-[#979797] ml-[2px]">
                                {room.location}
                              </p>
                              <div className="h-1"></div>
                              <div className="flex gap-1 flex-wrap">
                                {room.amenities.map((amenity, index) => {
                                  const getAmenityIcon = (amenity) => {
                                    switch(amenity) {
                                      case "A/C": return "/images/media/ac_premium.f83072a3.svg";
                                      case "WiFi": return "/images/media/wifi_premium.b7a33161.svg";
                                      case "Single Occupancy": return "/images/media/single_occu_premium.5b2527bc.svg";
                                      case "Triple Occupancy": return "/images/media/multi_occu_premium.87ea45bc.svg";
                                      case "Short Stay": return "/images/media/short_stay_premium.469c496c.svg";
                                      default: return "";
                                    }
                                  };

                                  return (
                                    <div
                                      key={index}
                                      className="rounded-[0.3rem] flex gap-1 text-[8px] md:text-[10px] items-center justify-between p-[5px] font-semibold border-1 border-[#C59856] text-[#C59856]"
                                    >
                                      <img
                                        alt={amenity}
                                        src={getAmenityIcon(amenity)}
                                        width="16"
                                        height="16"
                                        className="object-cover w-3 h-3 md:w-4 md:h-4"
                                      />
                                      {amenity}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold text-[10px] md:text-xs">
                              Rs.{" "}
                              <span className="text-base md:text-lg text-[#C59856]">
                                {room.price}/-
                              </span>{" "}
                              per month
                            </p>
                            <div className="flex gap-2 md:gap-3 mt-auto">
                              <Button
                                as={Link}
                                to={`/property/${room.id}`}
                                className="flex text-white bg-[#C59856] font-semibold rounded-xl text-xs md:text-sm py-1 px-2 md:px-3"
                              >
                                Book Now
                              </Button>
                              <Button
                                as={Link}
                                to={`/property/${room.id}/visit`}
                                variant="bordered"
                                className="flex-1 font-semibold border-[#C59856] text-[#C59856] text-xs md:text-sm py-1 px-2 md:px-3"
                              >
                                Site Visit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <button className="absolute right-0 md:-right-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Short Stays Section */}
      <div className="px-4 md:px-20 py-8 md:py-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 md:gap-3">
            <p className="font-bold text-2xl md:text-4xl">
              <span className="text-[#fe6f61]">Short</span> Stays
            </p>
          </div>

          <div className="flex items-center relative group">
            <button className="absolute left-0 md:-left-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl">
              ‹
            </button>
            <div className="flex overflow-x-scroll scroll-smooth gap-4 md:gap-6 p-2 md:p-4 w-full scrollbar-hide pl-8 md:pl-4 pr-8 md:pr-4">
              {regularRooms.filter(room => room.amenities.includes("Short Stay")).map((room) => (
                <div key={room.id}>
                  <Card className="h-[220px] w-[300px] md:w-[500px] p-3 bg-white">
                    {/* Same card content as regular rooms */}
                    <div className="rounded-lg p-0 border-1 border-[#D8D8D8]">
                      <div className="flex h-full">
                        <img
                          alt="room"
                          src={room.image}
                          width="200"
                          height="200"
                          className="object-cover h-full w-2/5 rounded-l-md"
                          loading="lazy"
                        />
                        <div className="flex flex-col justify-between p-2 md:p-3 w-full">
                          {/* Same content structure as regular rooms */}
                          <div className="flex flex-col">
                            <div>
                              <Link
                                to={`/property/${room.id}`}
                                className="font-semibold hover:underline text-sm md:text-base"
                              >
                                {room.name}
                              </Link>
                              <p className="text-[10px] md:text-xs text-[#979797] ml-[2px]">
                                {room.location}
                              </p>
                              <div className="h-1"></div>
                              <div className="flex gap-1 flex-wrap">
                                {room.amenities.map((amenity, index) => {
                                  let colorClass = "";
                                  let iconSrc = "";

                                  if (amenity === "A/C" || amenity === "WiFi") {
                                    colorClass = "bg-[#F0FFF0] text-[#3EAF3F]";
                                    iconSrc = amenity === "A/C" 
                                      ? "/images/media/ac.0f94ec49.svg"
                                      : "/images/media/wifi.b765d654.svg";
                                  } else if (amenity === "Single Occupancy" || amenity === "Triple Occupancy") {
                                    colorClass = "bg-[#FFFCF0] text-[#FFC130]";
                                    iconSrc = amenity === "Single Occupancy"
                                      ? "/images/media/single_occu.2c89da93.svg"
                                      : "/images/media/multi_occu.83dd5276.svg";
                                  } else if (amenity === "Short Stay") {
                                    colorClass = "bg-[#ffeaee] text-[#ed3a56]";
                                    iconSrc = "/images/media/short_stay_pink.5c3b7b9d.svg";
                                  }

                                  return (
                                    <div
                                      key={index}
                                      className={`rounded-[0.3rem] flex gap-1 text-[8px] md:text-[10px] items-center justify-between p-[5px] font-semibold ${colorClass}`}
                                    >
                                      <img
                                        alt={amenity}
                                        src={iconSrc}
                                        width="16"
                                        height="16"
                                        className="object-cover w-3 h-3 md:w-4 md:h-4"
                                      />
                                      {amenity}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold text-[10px] md:text-xs">
                              Rs.{" "}
                              <span className="text-base md:text-lg">{room.price}/-</span>{" "}
                              per month
                            </p>
                            <div className="flex gap-2 md:gap-3 mt-auto">
                              <Button
                                as={Link}
                                to={`/property/${room.id}`}
                                className="flex text-white rounded-xl bg-[#FE6F61] font-semibold text-xs md:text-sm py-1 px-2 md:px-3"
                              >
                                Book Now
                              </Button>
                              <div className="flex-1 px-3 border-2 border-transparent"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <button className="absolute right-0 md:-right-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Flatmate Needed Section */}
      <div className="px-4 md:px-20 py-8 md:py-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 md:gap-3">
            <p className="font-bold text-2xl md:text-4xl">
              Flatmate <span className="text-[#fe6f61]">Needed</span>
            </p>
          </div>

          <div className="flex items-center relative group">
            <button className="absolute left-0 md:-left-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl">
              ‹
            </button>
            <div className="flex overflow-x-scroll scroll-smooth gap-4 md:gap-6 p-2 md:p-4 w-full scrollbar-hide pl-8 md:pl-4 pr-8 md:pr-4">
              {regularRooms.map((room) => (
                <div key={room.id}>
                  <Card className="h-[220px] w-[300px] md:w-[500px] p-3 bg-white">
                    {/* Same card content structure as regular rooms */}
                    <div className="rounded-lg p-0 border-1 border-[#D8D8D8]">
                      <div className="flex h-full">
                        <img
                          alt="room"
                          src={room.image}
                          width="200"
                          height="200"
                          className="object-cover h-full w-2/5 rounded-l-md"
                          loading="lazy"
                        />
                        <div className="flex flex-col justify-between p-2 md:p-3 w-full">
                          {/* Same content structure as regular rooms */}
                          <div className="flex flex-col">
                            <div>
                              <Link
                                to={`/property/${room.id}`}
                                className="font-semibold hover:underline text-sm md:text-base"
                              >
                                {room.name}
                              </Link>
                              <p className="text-[10px] md:text-xs text-[#979797] ml-[2px]">
                                {room.location}
                              </p>
                              <div className="h-1"></div>
                              <div className="flex gap-1 flex-wrap">
                                {room.amenities.map((amenity, index) => {
                                  let colorClass = "";
                                  let iconSrc = "";

                                  if (amenity === "A/C" || amenity === "WiFi") {
                                    colorClass = "bg-[#F0FFF0] text-[#3EAF3F]";
                                    iconSrc = amenity === "A/C" 
                                      ? "/images/media/ac.0f94ec49.svg"
                                      : "/images/media/wifi.b765d654.svg";
                                  } else if (amenity === "Single Occupancy" || amenity === "Triple Occupancy") {
                                    colorClass = "bg-[#FFFCF0] text-[#FFC130]";
                                    iconSrc = amenity === "Single Occupancy"
                                      ? "/images/media/single_occu.2c89da93.svg"
                                      : "/images/media/multi_occu.83dd5276.svg";
                                  } else if (amenity === "Short Stay") {
                                    colorClass = "bg-[#ffeaee] text-[#ed3a56]";
                                    iconSrc = "/images/media/short_stay_pink.5c3b7b9d.svg";
                                  }

                                  return (
                                    <div
                                      key={index}
                                      className={`rounded-[0.3rem] flex gap-1 text-[8px] md:text-[10px] items-center justify-between p-[5px] font-semibold ${colorClass}`}
                                    >
                                      <img
                                        alt={amenity}
                                        src={iconSrc}
                                        width="16"
                                        height="16"
                                        className="object-cover w-3 h-3 md:w-4 md:h-4"
                                      />
                                      {amenity}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold text-[10px] md:text-xs">
                              Rs.{" "}
                              <span className="text-base md:text-lg">{room.price}/-</span>{" "}
                              per month
                            </p>
                            <div className="flex gap-2 md:gap-3 mt-auto">
                              <Button
                                as={Link}
                                to={`/property/${room.id}`}
                                className="flex text-white rounded-xl bg-[#FE6F61] font-semibold text-xs md:text-sm py-1 px-2 md:px-3"
                              >
                                Book Now
                              </Button>
                              <Button
                                as={Link}
                                to={`/property/${room.id}/visit`}
                                variant="bordered"
                                className="flex-1 font-semibold border-[#FE6F61] text-[#FE6F61] text-xs md:text-sm py-1 px-2 md:px-3"
                              >
                                Site Visit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <button className="absolute right-0 md:-right-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* The Three Delhi */}
      <div className="px-4 md:px-20 gap-8 md:gap-16 flex flex-col my-8 md:my-10">
        <div className="flex flex-col gap-8 md:gap-12">
          <motion.div 
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-bold text-2xl md:text-4xl">
              Popular areas for <span className="text-[#fe6f61]">students</span>{" "}
              in Delhi
            </p>
            <p className="text-[#979797] text-sm md:text-base font-medium">
              Book student accommodations near universities around Delhi
            </p>
          </motion.div>
          <div className="flex flex-col gap-6 md:gap-12">
            {/* North Campus */}
            <motion.div 
              className="flex py-6 rounded-3xl flex-col gap-4 md:gap-5 bg-gradient-to-b from-[#FE6F61] to-[#FF5544] relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(254, 111, 97, 0.4)" }}
            >
              <span className="text-xl md:text-2xl text-white text-center font-bold">
                North Campus
              </span>
              
              {/* Left & Right Arrow Controls for Mobile */}
              <motion.button 
                className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden z-10 bg-white/60 text-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-md"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                whileTap={{ scale: 0.9 }}
              >
                &#10094;
              </motion.button>
              <motion.button 
                className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden z-10 bg-white/60 text-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-md"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                whileTap={{ scale: 0.9 }}
              >
                &#10095;
              </motion.button>
              
              {/* Desktop Static Layout */}
              <div className="md:flex md:justify-evenly hidden">
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n1.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Kamalanagar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n2.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Kalyan Vihar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n3.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Roop Nagar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n4.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Ghanta Ghar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n5.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Shakti Nagar
                  </p>
                </div>
              </div>
              
              {/* Mobile Only - Horizontal Scrollable View */}
              <div className="flex overflow-x-scroll pb-4 md:hidden px-10 gap-4 scrollbar-hide">
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n1.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Kamalanagar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n2.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Kalyan Vihar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n3.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Roop Nagar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n4.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Ghanta Ghar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/n5.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Shakti Nagar
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* South Campus */}
            <div className="flex py-6 rounded-3xl flex-col gap-4 md:gap-5 bg-gradient-to-b from-[#FE6F61] to-[#FF5544] relative">
              <span className="text-xl md:text-2xl text-white text-center font-bold">
                South Campus
              </span>
              
              {/* Left & Right Arrow Controls for Mobile */}
              <button className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden z-10 bg-white/60 text-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-md">
                &#10094;
              </button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden z-10 bg-white/60 text-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-md">
                &#10095;
              </button>
              
              {/* Desktop Layout */}
              <div className="md:flex md:justify-evenly hidden">
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s1.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Satya Niketan
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s2.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Moti Bagh
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s3.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Vasant Vihar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s4.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Naraina Vihar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s5.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Rajouri Garden
                  </p>
                </div>
              </div>
              
              {/* Mobile Only - Horizontal Scrollable View */}
              <div className="flex overflow-x-scroll pb-4 md:hidden px-10 gap-4 scrollbar-hide">
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s1.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Satya Niketan
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s2.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Moti Bagh
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s3.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Vasant Vihar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s4.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Naraina Vihar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/s5.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Rajouri Garden
                  </p>
                </div>
              </div>
            </div>
            
            {/* Off Campus */}
            <div className="flex py-6 rounded-3xl flex-col gap-4 md:gap-5 bg-gradient-to-b from-[#FE6F61] to-[#FF5544] relative">
              <span className="text-xl md:text-2xl text-white text-center font-bold">
                Off Campus
              </span>
              
              {/* Left & Right Arrow Controls for Mobile */}
              <button className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden z-10 bg-white/60 text-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-md">
                &#10094;
              </button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden z-10 bg-white/60 text-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-md">
                &#10095;
              </button>
              
              {/* Desktop Layout */}
              <div className="md:flex md:justify-evenly hidden">
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o1.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Laxmi Nagar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o2.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Mukherjee Nagar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o3.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Old Rajendra Nagar
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o4.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Karol Bagh
                  </p>
                </div>
                <div className="flex aspect-square relative w-[200px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={300}
                    height={300}
                    decoding="async"
                    className="rounded-2xl border-[10px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o5.webp"
                  />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-md bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Hauz Khas
                  </p>
                </div>
              </div>
              
              {/* Mobile Only - Horizontal Scrollable View */}
              <div className="flex overflow-x-scroll pb-4 md:hidden px-10 gap-4 scrollbar-hide">
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o1.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Laxmi Nagar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o2.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Mukherjee Nagar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o3.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Old Rajendra Nagar
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o4.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Karol Bagh
                  </p>
                </div>
                <div className="flex-shrink-0 aspect-square relative w-[150px]">
                  <img
                    alt="image"
                    loading="lazy"
                    width={150}
                    height={150}
                    decoding="async"
                    className="rounded-2xl border-[8px] border-white"
                    style={{ color: "transparent" }}
                    src="/images/media/o5.webp"
                  />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-[#FE6F61] w-3/4 rounded-lg text-center p-1 text-nowrap overflow-hidden text-ellipsis">
                    Hauz Khas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Section */}
      <div className="px-4 md:px-20 gap-8 md:gap-16 flex flex-col">
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-20">
          <motion.div 
            onClick={() => window.location.href = 'https://landlord.roomsonrent.in'}
            className="border-2 border-[#D8D8D8] rounded-2xl h-auto md:h-60 flex-1 flex flex-col md:flex-row gap-4 md:gap-10 cursor-pointer p-4 md:p-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
              scale: 1.03, 
              borderColor: "#FE6F61",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col p-0 md:p-5 gap-2 text-[#2A2A2A]">
              <p className="text-xl md:text-3xl font-semibold">Partner with Us!</p>
              <p className="text-xs md:text-sm">
                Recommend PGs and Flats and get upto 500/- off on your next
                month's rent!
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <motion.img
                alt="partner"
                src="/images/media/Partnership-bro 2.8d697706.svg"
                className="w-40 md:w-auto aspect-square object-cover md:mr-10"
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
          <motion.div 
            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScn1Vqjq2SyijD-KeqgVggrCTxS36tC_QtEs3Xt6CM2ojz3gQ/viewform?usp=header', '_blank')}
            className="border-2 border-[#D8D8D8] rounded-2xl h-auto md:h-60 flex-1 flex flex-col md:flex-row gap-4 md:gap-10 cursor-pointer p-4 md:p-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
              scale: 1.03, 
              borderColor: "#FE6F61",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col p-0 md:p-5 gap-2 text-[#2A2A2A]">
              <p className="text-xl md:text-3xl font-semibold">Earn Cashback!</p>
              <p className="text-xs md:text-sm">
                Get 500/- cashback on your first room booking after filling in
                all necessary details
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <motion.img
                alt="partner"
                src="/images/media/Banknote-bro 1.4fa9193a.svg"
                className="w-40 md:w-auto aspect-square object-cover md:mr-10"
                whileHover={{ y: [0, -10, 0] }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-[#FEFBF2] px-4 md:px-20 py-8 md:py-10">
        <div className="flex flex-col gap-8 md:gap-12">
          <motion.div 
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-bold text-2xl md:text-4xl">
              What do <span className="text-[#fe6f61]">students</span> say about
              us?
            </p>
            <p className="text-[#979797] text-sm md:text-base font-medium">
              What do our 10k+ Students have to say about their experience with
              ROR
            </p>
          </motion.div>

          <motion.div 
            className="flex items-center relative group"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.button 
              className="absolute left-0 md:-left-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ‹
            </motion.button>
            <div className="flex overflow-x-scroll scroll-smooth gap-4 md:gap-6 p-2 md:p-4 w-full scrollbar-hide pl-8 md:pl-4 pr-8 md:pr-4">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="w-[260px] md:w-[310px] border-1 border-[#D8D8D8] bg-white hover:shadow-lg hover:border-[#FE6F61] transition-all duration-300">
                    <div className="flex flex-col p-3 md:p-4 gap-3">
                      <p className="text-xs text-[#2A2A2A] h-16 md:h-20 overflow-hidden line-clamp-4 md:line-clamp-5">
                        {testimonial.text}
                      </p>
                      <div className="flex justify-between">
                        <div className="flex gap-2 md:gap-3 items-center">
                          <motion.img
                            alt="avatar"
                            src="/images/media/user_testimony.webp"
                            className="rounded-full h-6 w-6 md:h-8 md:w-auto"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          />
                          <div>
                            <p className="text-base md:text-lg font-semibold">
                              {testimonial.name}
                            </p>
                            <p className="text-[0.5rem] md:text-[0.6rem] leading-none text-[#979797]">
                              {testimonial.college}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-sm md:text-base">{testimonial.rating}</p>
                          <motion.img
                            alt="star"
                            src="/images/media/Star yellow.ba5bc4df.svg"
                            width="12"
                            height="12"
                            className="md:w-[14px] md:h-[14px]"
                            animate={{ rotate: [0, 20, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.button 
              className="absolute right-0 md:-right-4 z-10 bg-white text-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity text-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ›
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Three Steps Section */}
      <div className="px-4 md:px-20 py-6 md:py-8">
        <motion.div 
          className="flex flex-col gap-2 md:gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-bold text-2xl md:text-4xl">
            Book your favourite room in{" "}
            <span className="text-[#fe6f61]">3 simple steps</span>
          </p>
          <p className="text-[#979797] text-sm md:text-base font-medium">
            What do our 10k+ Students have to say about their experience with
            ROR
          </p>
        </motion.div>
        <div className="h-8 md:h-12"></div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-4">
          <motion.div 
            className="flex flex-col md:flex-row gap-4 md:items-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex border rounded-xl p-3 flex-col gap-3 md:gap-4"
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.img
                alt="icon"
                src="/images/media/Minimalistic Magnifer.webp"
                width="36"
                height="36"
                className="md:w-[48px] md:h-[48px]"
                whileHover={{ scale: 1.1, rotate: 10 }}
              />
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-base md:text-lg font-bold">Discover & Choose</span>
                <span className="text-xs">
                  Choose and pick from a plethora of verified student Flats &
                  PGs
                </span>
              </div>
            </motion.div>
            <img
              alt="arrow"
              src="/images/media/arrow.png"
              width="40"
              height="40"
              className="hidden md:block md:w-[100px] md:h-[1px]"
            />
            <div className="flex justify-center md:hidden">
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </motion.svg>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-4 md:items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="flex border rounded-xl p-3 flex-col gap-3 md:gap-4"
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.img
                alt="icon"
                src="/images/media/File Check.webp"
                width="36"
                height="36"
                className="md:w-[48px] md:h-[48px]"
                whileHover={{ scale: 1.1, rotate: -10 }}
              />
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-base md:text-lg font-bold">Fill in your details</span>
                <span className="text-xs">
                  Fill in all your necessary personal details required for the
                  booking.
                </span>
              </div>
            </motion.div>
            <img
              alt="arrow"
              src="/images/media/arrow.png"
              width="40"
              height="40"
              className="hidden md:block md:w-[100px] md:h-[1px]"
            />
            <div className="flex justify-center md:hidden">
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </motion.svg>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-4 md:items-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="flex border rounded-xl p-3 flex-col gap-3 md:gap-4"
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.img
                alt="icon"
                src="/images/media/Home.webp"
                width="36"
                height="36"
                className="md:w-[48px] md:h-[48px]"
                whileHover={{ scale: 1.1, rotate: 10 }}
              />
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-base md:text-lg font-bold">
                  Accommodation Secured!
                </span>
                <span className="text-xs">
                  Take it easy, pack up, and embark on a new chapter of life!
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Need Assistance Section */}
      <div className="bg-[#F9FAFB] px-4 md:px-20 my-8 md:my-10 py-8 md:py-10">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 md:gap-0">
          <motion.div 
            className="flex flex-col gap-2 md:gap-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-bold text-2xl md:text-4xl">Need Assistance?</p>
            <p className="text-[#979797] text-sm md:text-base font-medium">
              Feel free to reach out with any questions.
            </p>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#25D366] text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                2 Mins Reply
              </motion.div>
              <motion.a
                href="https://wa.me/917065051618"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center border rounded-xl p-4 px-6 md:px-12 flex-col gap-3 md:gap-4"
                whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(37, 211, 102, 0.2)" }}
              >
                <motion.img
                  alt="icon"
                  src="/images/media/whatsapp.webp"
                  width="36"
                  height="36"
                  className="md:w-[48px] md:h-[48px]"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                />
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-base md:text-lg font-bold">WhatsApp us</span>
                </div>
              </motion.a>
            </motion.div>
            <motion.a
              href="tel:+917065051618"
              target="_self"
              className="flex items-center border rounded-xl p-4 px-6 md:px-12 flex-col gap-3 md:gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.img
                alt="icon"
                src="/images/media/Phone Calling Rounded.webp"
                width="36"
                height="36"
                className="md:w-[48px] md:h-[48px]"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              />
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-base md:text-lg font-bold">+91 70650 51618</span>
              </div>
            </motion.a>
            <motion.a
              href="mailto:officialroomsonrent@gmail.com"
              target="_self"
              className="flex items-center border rounded-xl p-4 px-6 md:px-12 flex-col gap-3 md:gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.img
                alt="icon"
                src="/images/media/Letter.webp"
                width="36"
                height="36"
                className="md:w-[48px] md:h-[48px]"
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
              />
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-base md:text-lg font-bold">Email us</span>
              </div>
            </motion.a>
          </div>
        </div>
      </div>

      {/* Where We Operate Section */}
      <div className="px-4 md:px-20 my-8 md:my-10">
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-2 md:gap-3">
            <p className="font-bold text-2xl md:text-4xl">
              Where we <span className="text-[#fe6f61]">operate</span>
            </p>
            <p className="text-[#979797] text-sm md:text-base font-medium">
              Trusted student lodging near key universities and bustling zones
              in Delhi.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-5">
            <div className="flex flex-col flex-1 gap-2 md:gap-3">
              <p className="text-[#FE6F61] font-bold text-base md:text-lg mb-1">
                South Delhi
              </p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">
                Malviya Nagar
              </p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">Saket</p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">Hauz Khas</p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">Kalkaji</p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">
                Greater Kailash
              </p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">
                Lajpat Nagar
              </p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">Green Park</p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">
                Vasant Kunj
              </p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">
                Sheikh Sarai
              </p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">
                Satya Niketan
              </p>
              <p className="text-xs md:text-sm text-[#666666] font-semibold">
                Chirag Delhi
              </p>
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <p className="text-[#FE6F61] font-bold text-lg mb-1">
                North Delhi
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Mukherjee Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Kamla Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Hudson Lane
              </p>
              <p className="text-sm text-[#666666] font-semibold">Model Town</p>
              <p className="text-sm text-[#666666] font-semibold">GTB Road</p>
              <p className="text-sm text-[#666666] font-semibold">
                Old Rajinder Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Shakti Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Vijay Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Patel Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">Karol Bagh</p>
              <p className="text-sm text-[#666666] font-semibold">
                Outram Lines
              </p>
              <p className="text-sm text-[#666666] font-semibold">Roop Nagar</p>
              <p className="text-sm text-[#666666] font-semibold">
                Kingsway Camp
              </p>
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <p className="text-[#FE6F61] font-bold text-lg mb-1">
                East Delhi
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Laxmi Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Mayur Vihar (Phase I)
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Mayur Vihar (Phase II)
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Mayur Vihar (Phase III)
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Preet Vihar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Karkardooma
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Vasundhara Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                IP Extension
              </p>
              <p className="text-sm text-[#666666] font-semibold">Shakarpur</p>
              <p className="text-sm text-[#666666] font-semibold">Patparganj</p>
              <p className="text-sm text-[#666666] font-semibold">
                Pandav Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Anand Vihar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Geeta Colony
              </p>
              <p className="text-sm text-[#666666] font-semibold">Ghaziabad</p>
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <p className="text-[#FE6F61] font-bold text-lg mb-1">
                West Delhi
              </p>
              <p className="text-sm text-[#666666] font-semibold">Janakpuri</p>
              <p className="text-sm text-[#666666] font-semibold">
                Uttam Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Rajouri Garden
              </p>
              <p className="text-sm text-[#666666] font-semibold">Vikaspuri</p>
              <p className="text-sm text-[#666666] font-semibold">
                Subhash Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Tilak Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Paschim Vihar
              </p>
              <p className="text-sm text-[#666666] font-semibold">Dwarka Mor</p>
              <p className="text-sm text-[#666666] font-semibold">
                Naraina Vihar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Tagore Garden
              </p>
              <p className="text-sm text-[#666666] font-semibold">Moti Nagar</p>
              <p className="text-sm text-[#666666] font-semibold">
                Kirti Nagar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#FE6F61] h-[250px] flex items-center py-10 text-white">
        <Link
          href="/"
          className="flex-1 h-full flex items-center justify-center text-6xl font-bold"
        >
          ROR
        </Link>
        <div className="h-full w-[1px] bg-[#CCCCCC]"></div>
        <div className="flex-1 h-full flex justify-center items-center flex-col gap-5">
          <p className="text-2xl font-semibold">CONTACT US!</p>
          <div className="text-lg">
            <a href="tel:+916207409628" className="block text-center">
              +91 62074 09628
            </a>
            <a href="mailto:officialroomsonrent@gmail.com" className="block">
              officialroomsonrent@gmail.com
            </a>
          </div>
        </div>
        <div className="h-full w-[1px] bg-[#CCCCCC]"></div>
        <div className="flex-1 h-full flex flex-col justify-center items-center gap-5">
          <p className="text-2xl font-semibold">FOLLOW US!</p>
          <div className="flex gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <img
                alt="twitter"
                src="/images/media/icons8-twitter-bird.ebc67185.svg"
                width="50"
                height="50"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img
                alt="linkedin"
                src="/images/media/icons8-linkedin.4a98e29e.svg"
                width="50"
                height="50"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img
                alt="instagram"
                src="/images/media/icons8-instagram.2fe214cb.svg"
                width="50"
                height="50"
              />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img
                alt="facebook"
                src="/images/media/icons8-facebook.d9ed0702.svg"
                width="50"
                height="50"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
