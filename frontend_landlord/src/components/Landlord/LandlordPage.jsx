import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Card } from "@heroui/react"; // Assuming this is the correct Card import
import FinancialCard from "./FinancialCard"; // Assuming this component exists and is styled
import TenantCarousel from "./TenantCarousel"; // Assuming this component exists and handles its data/animations
import ListingCard from "./ListingCard"; // Assuming this component exists and is styled
import useFetch from "../../hooks/useFetch";
import { Search, Home, Plus, User, Phone, Mail, MapPin } from 'lucide-react'; // Using lucide-react for icons
import RoomDetailsCard from './RoomDetailsCard';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger effect for child elements
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    },
  },
};


export default function LandlordPage() {
  const [searchFocus, setSearchFocus] = useState(false);

  const { data: myListings, loading: listingsLoading, error: listingsError } = useFetch('/api/listings/owner', {
    credentials: 'include'
  });

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

<motion.section
      className="relative h-[350px] md:h-[400px] flex flex-col justify-center text-left overflow-hidden bg-gray-800" // Base background color in case image fails/is slow
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" // Example different, potentially more subtle bg
          alt="Abstract architecture or subtle background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/50"></div>
      </div>

      <motion.div
        className="relative z-10 text-white w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-8 sm:pt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 drop-shadow-md"
          variants={itemVariants}
        >
          Welcome, {  }
        </motion.h1>

        <motion.p
          className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 max-w-3xl drop-shadow-sm" // Max-width for readability
          variants={itemVariants}
        >
          🙏 Namaste! Manage your properties, tenants, and financials efficiently.
        </motion.p>

        <motion.form
          className="w-full max-w-xl" // Reduced max-width, no mx-auto needed as parent is text-left
          variants={itemVariants}
          onSubmit={(e) => e.preventDefault()}
        >
          <motion.div
            className={`bg-white/95 rounded-full p-2 flex items-center shadow-md transition-all duration-300 ease-in-out ${
              searchFocus ? 'ring-2 ring-[#fe6f61]/70 scale-[1.01]' : 'ring-0' // Subtle scale
            }`}
            whileHover={{ boxShadow: '0px 8px 25px rgba(0,0,0,0.15)' }} // Slightly adjusted hover shadow
          >
            <input
              type="text"
              placeholder="Search properties, tenants, financials..."
              className="w-full px-5 py-2.5 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none bg-transparent text-sm md:text-base" // Slightly smaller text/padding
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              aria-label="Search dashboard"
            />
            <motion.button
              type="submit"
              className="p-2.5 md:p-3 rounded-full text-white bg-[#fe6f61] flex items-center justify-center flex-shrink-0 ml-1" // Slightly smaller padding
              whileHover={{ scale: 1.05, backgroundColor: '#e56053', boxShadow: "0px 4px 12px rgba(254, 111, 97, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              aria-label="Submit Search"
            >
              <Search size={18} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.section>

      <motion.section
        className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
          variants={containerVariants} // Use container variants for staggering
        >
          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="h-full rounded-2xl p-3 shadow-md border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center h-full border border-gray-100 rounded-xl">
                <img alt="Landlords" className="w-full sm:w-32 h-32 sm:h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none" src="https://thumbs.dreamstime.com/b/close-up-real-estate-agent-holding-keys-his-hand-focus-high-quality-photo-316366166.jpg" />
                <div className="p-4 text-center sm:text-left">
                  <p className="text-lg font-semibold text-gray-800">1 Lakh+ Landlords</p>
                  <p className="text-sm text-gray-600 mt-1">Find the perfect tenant, hassle-free.</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="h-full rounded-2xl p-3 shadow-md border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center h-full border border-gray-100 rounded-xl">
                <img alt="Properties" className="w-full sm:w-32 h-32 sm:h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none" src="https://images.jdmagicbox.com/comp/bangalore/k7/080pxx80.xx80.140720093203.n1k7/catalogue/padma-luxury-pg-bangalore-1bk7s0s3cc.jpg" />
                <div className="p-4 text-center sm:text-left">
                  <p className="text-lg font-semibold text-gray-800">Exclusive Properties</p>
                  <p className="text-sm text-gray-600 mt-1">Ideal for students & professionals.</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="h-full rounded-2xl p-3 shadow-md border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center h-full border border-gray-100 rounded-xl">
                <div className="w-full sm:w-32 h-32 sm:h-full bg-[#fe6f61]/10 flex items-center justify-center rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#fe6f61]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="p-4 text-center sm:text-left">
                  <p className="text-lg font-semibold text-gray-800">4.8+ Rating</p>
                  <p className="text-sm text-gray-600 mt-1">See why tenants love staying with us.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-gray-100 py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            variants={itemVariants}
          >
            Accommodation <span className="text-[#fe6f61]">Statistics</span>
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <FinancialCard emoji="🏠" title="Total Tenants (Current)" value="85" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FinancialCard emoji="🏢" title="Total Capacity (Maximum)" value="120" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FinancialCard emoji="📊" title="Floor Mapping (Tenants)" value="5 Floors, 17 Rooms" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FinancialCard emoji="🌟" title="Potential Floor Mapping" value="6 Floors, 20 Rooms" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="bg-white py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold">
                My <span className="text-[#fe6f61]">Properties</span>
              </h2>
              <p className="text-gray-600 mt-2">Manage and monitor all your listed properties.</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link to="/add-listing">
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-[#fe6f61] text-white rounded-lg shadow-md font-medium whitespace-nowrap"
                  whileHover={{ scale: 1.05, backgroundColor: "#e05a4f", boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={20} /> Add New Property
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {listingsLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-t-4 border-b-4 border-[#fe6f61] rounded-full"
              />
            </div>
          ) : listingsError ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-red-600 py-10 px-6 bg-red-50 rounded-lg border border-red-200"
            >
              <p className="font-semibold">Oops! Failed to load properties.</p>
              <p className="text-sm">Please check your connection and try again later.</p>
            </motion.div>
          ) : !myListings?.data || myListings.data.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 px-6 bg-gray-100 rounded-lg border border-gray-200"
            >
              <Home size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-3">You haven't listed any properties yet.</p>
              <Link
                to="/add-listing"
                className="text-[#fe6f61] hover:underline font-medium transition-colors"
              >
                Add your first property now!
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible" // Animate immediately when data is ready
            >
              {myListings.data.map((listing) => (
                // Wrap ListingCard for individual animation and hover effect
                <motion.div key={listing._id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Room Details Section */}
      {myListings && myListings.data && myListings.data.length > 0 && (
        <motion.section
          className="bg-gray-100 py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12" variants={itemVariants}>
              <span className="text-[#fe6f61]">Room</span> Details
            </motion.h2>
            
            <motion.div
              className="space-y-8"
              variants={containerVariants}
            >
              {myListings.data.map((listing) => (
                <motion.div 
                  key={listing._id} 
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <p className="text-sm text-gray-600">{listing.address}</p>
                  </div>
                  
                  <div className="p-4">
                    {listing.floors && listing.floors.length > 0 ? (
                      <div className="space-y-6">
                        {listing.floors.map((floor, floorIndex) => (
                          <div key={floor.floorId}>
                            <h4 className="text-lg font-medium mb-3 border-b border-gray-200 pb-2">
                              Floor {floorIndex + 1}
                            </h4>
                            
                            {floor.rooms && floor.rooms.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {floor.rooms.map((room, roomIndex) => (
                                  <RoomDetailsCard 
                                    key={room.roomId} 
                                    floor={floor}
                                    roomIndex={roomIndex}
                                    room={room}
                                  />
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">No rooms configured for this floor</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500 italic">No floor details available</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Current Tenants Section */}
      <motion.section
        className="bg-gray-100 py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-10" variants={itemVariants}>
            <span className="text-[#fe6f61]">Current</span> Tenants
          </motion.h2>
          {/* Assuming TenantCarousel handles its own internal animations and responsiveness */}
          <TenantCarousel tenantType="current" />
        </div>
      </motion.section>


      {/* Vacating Tenants Section */}
      <motion.section
        className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto bg-[#F8F3EF] border-2 border-[#C59856] rounded-3xl p-6 lg:p-10 relative overflow-hidden">
          <div className="absolute w-[150px] md:w-[250px] right-0 top-0 h-full rounded-r-[22px] bg-gradient-to-r from-[#C59856]/0 via-[#C59856]/20 to-[#C59856]/40 pointer-events-none"></div>
          <motion.h2
            className="font-bold text-3xl md:text-4xl text-[#AE8549] flex items-center gap-3 mb-8 relative z-10"
            variants={itemVariants}
          >
            <img
              alt="star icon"
              src="/images/media/Star 1.992519b2.svg" // Ensure this path is correct
              width="32"
              height="31"
              className="flex-shrink-0"
            />
            Vacating Tenants
          </motion.h2>
          {/* Assuming TenantCarousel handles its own internal animations and responsiveness */}
          <div className="relative z-10">
            <TenantCarousel tenantType="vacating" />
          </div>
        </div>
      </motion.section>

      {/* How to Maximize Tenants Section */}
      <motion.section
        className="bg-gray-100 py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12" variants={itemVariants}>
            Maximize <span className="text-[#fe6f61]">Occupancy</span>
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            variants={containerVariants}
          >
            {/* Card 1 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card className="h-full bg-white rounded-xl shadow-lg border border-gray-200 text-center p-6">
                <div className="flex flex-col items-center gap-5">
                  <img alt="Update icon" src="/images/media/c1.webp" width="48" height="48" className="text-[#fe6f61]" />
                  <h3 className="text-xl font-semibold text-gray-800">Update Everything Daily</h3>
                  <p className="text-gray-600 text-sm">
                    Keep listings fresh and accurate daily to attract potential tenants with the latest information.
                  </p>
                </div>
              </Card>
            </motion.div>
            {/* Card 2 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card className="h-full bg-white rounded-xl shadow-lg border border-gray-200 text-center p-6">
                <div className="flex flex-col items-center gap-5">
                  <img alt="Boost icon" src="/images/media/c2.webp" width="48" height="48" className="text-[#fe6f61]" />
                  <h3 className="text-xl font-semibold text-gray-800">Boost Your Seat at Just ₹99/Bed</h3>
                  <p className="text-gray-600 text-sm">
                    Offer competitive rates starting at ₹99 per bed to attract more tenants and maximize occupancy quickly.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How to Maximize Rentals Section */}
      <motion.section
        className="bg-white py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12" variants={itemVariants}>
            Maximize <span className="text-[#fe6f61]">Rentals</span>
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            variants={containerVariants}
          >
            {/* Card 1 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card className="h-full bg-white rounded-xl shadow-lg border border-gray-200 text-center p-6">
                <div className="flex flex-col items-center gap-5">
                  <img alt="Short stay icon" src="/images/media/c3.webp" width="48" height="48" className="text-[#fe6f61]" />
                  <h3 className="text-xl font-semibold text-gray-800">Offer Flexible Short Stays</h3>
                  <p className="text-gray-600 text-sm">
                    Cater to short-term needs to fill occupancy gaps and appeal to a wider range of tenants.
                  </p>
                </div>
              </Card>
            </motion.div>
            {/* Card 2 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card className="h-full bg-white rounded-xl shadow-lg border border-gray-200 text-center p-6">
                <div className="flex flex-col items-center gap-5">
                  <img alt="Seasonal offers icon" src="/images/media/c4.webp" width="48" height="48" className="text-[#fe6f61]" />
                  <h3 className="text-xl font-semibold text-gray-800">Maximize with Seasonal Offers</h3>
                  <p className="text-gray-600 text-sm">
                    Introduce discounts or packages during peak times (exams, holidays) to boost demand and income.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


      {/* Managed Property Section */}
      <motion.section
        className="bg-gray-100 py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12" variants={itemVariants}>
            Want Us to <span className="text-[#fe6f61]">Manage</span> Your Property?
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            variants={containerVariants}
          >
            {/* Card 1 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card className="h-full bg-white rounded-xl shadow-lg border border-gray-200 text-center p-6">
                <div className="flex flex-col items-center gap-5">
                  <img alt="Advice icon" src="/images/media/c1.webp" width="48" height="48" className="text-[#fe6f61]" />
                  <h3 className="text-xl font-semibold text-gray-800">Get Free Personalized Advice</h3>
                  <p className="text-gray-600 text-sm">
                    Receive expert guidance on maximizing rental income with tailored, actionable market strategies.
                  </p>
                </div>
              </Card>
            </motion.div>
            {/* Card 2 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card className="h-full bg-white rounded-xl shadow-lg border border-gray-200 text-center p-6">
                <div className="flex flex-col items-center gap-5">
                  <img alt="Management icon" src="/images/media/c2.webp" width="48" height="48" className="text-[#fe6f61]" />
                  <h3 className="text-xl font-semibold text-gray-800">Stress-Free Management Services</h3>
                  <p className="text-gray-600 text-sm">
                    Let us handle tenant onboarding, rent collection, maintenance, and marketing for hassle-free ownership.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


      <motion.section
        className="bg-white py-6 lg:py-6 px-4 sm:px-6 lg:px-8 xl:px-16 sticky bottom-0 z-40 shadow-top"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
      >
        <div className="max-w-lg mx-auto flex justify-around items-center gap-4 sm:gap-8">
          <motion.div
            whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-1 cursor-pointer group text-center"
          >
            <div className="w-14 h-14 border-2 border-[#FE6F61] rounded-full flex items-center justify-center bg-white group-hover:bg-[#FE6F61]/10 transition-all duration-300">
              <Home className="h-6 w-6 text-[#FE6F61]" />
            </div>
            <span className="text-[#FE6F61] font-medium text-xs sm:text-sm">Dashboard</span>
          </motion.div>

          {/* Add Property Link */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/add-listing"
              className="flex flex-col items-center gap-1 group text-center"
            >
              <div className="w-14 h-14 border-2 border-[#FE6F61] rounded-full flex items-center justify-center bg-white group-hover:bg-[#FE6F61]/10 transition-all duration-300">
                <Plus className="h-6 w-6 text-[#FE6F61]" />
              </div>
              <span className="text-[#FE6F61] font-medium text-xs sm:text-sm whitespace-nowrap">Add Property</span>
            </Link>
          </motion.div>

          {/* Profile Link */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/profile" // Update this route as needed
              className="flex flex-col items-center gap-1 group text-center"
            >
              <div className="w-14 h-14 border-2 border-[#FE6F61] rounded-full flex items-center justify-center bg-white group-hover:bg-[#FE6F61]/10 transition-all duration-300">
                <User className="h-6 w-6 text-[#FE6F61]" />
              </div>
              <span className="text-[#FE6F61] font-medium text-xs sm:text-sm">Profile</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Need Assistance Section */}
      <motion.section
        className="bg-white py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16 border-t border-gray-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Need Assistance?</h2>
            <p className="text-gray-600 mt-2">We're here to help! Reach out via your preferred method.</p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 lg:gap-10"
            variants={containerVariants}
          >
            <motion.a
              href="https://wa.me/916207409628" // Use wa.me link for direct chat
              target="_blank"
              rel="noopener noreferrer"
              className="block relative"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(37, 211, 102, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#25D366] text-white text-xs px-3 py-1 rounded-full font-medium shadow-md whitespace-nowrap z-10">
                Fast Reply
              </div>
              <Card className="flex flex-col items-center border border-gray-200 rounded-xl p-6 pt-8 w-60 text-center bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <img alt="WhatsApp icon" src="/images/media/whatsapp.webp" width="48" height="48" className="mb-4" />
                <span className="text-lg font-semibold text-gray-800">WhatsApp Us</span>
                <span className="text-sm text-gray-500 mt-1">(+91 6207...)</span>
              </Card>
            </motion.a>

            <motion.a
              href="tel:+916207409628"
              target="_self"
              className="block"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="flex flex-col items-center border border-gray-200 rounded-xl p-6 w-60 text-center bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <Phone size={48} className="mb-4 text-blue-500" />
                <span className="text-lg font-semibold text-gray-800">Call Us</span>
                <span className="text-sm text-gray-500 mt-1">+91 62074 09628</span>
              </Card>
            </motion.a>

            <motion.a
              href="mailto:officialroomsonrent@gmail.com"
              target="_self"
              className="block"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="flex flex-col items-center border border-gray-200 rounded-xl p-6 w-60 text-center bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <Mail size={48} className="mb-4 text-red-500" />
                <span className="text-lg font-semibold text-gray-800">Email Us</span>
                <span className="text-sm text-gray-500 mt-1 truncate w-full px-2">officialroomsonrent@...</span>
              </Card>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>


      <motion.section
        className="bg-gray-100 py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }} // Trigger slightly earlier
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Where We <span className="text-[#fe6f61]">Operate</span>
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Trusted student lodging and professional housing near key universities and bustling zones across Delhi.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <h3 className="text-lg font-semibold text-[#FE6F61] mb-3 border-b border-[#fe6f61]/30 pb-1 flex items-center gap-2">
                <MapPin size={18} /> South Delhi
              </h3>
              {['Malviya Nagar', 'Saket', 'Hauz Khas', 'Kalkaji', 'Greater Kailash', 'Lajpat Nagar', 'Green Park', 'Vasant Kunj', 'Sheikh Sarai', 'Satya Niketan', 'Chirag Delhi', 'Bikaji Cama Place', 'Munirka', 'Safdarjung Enclave', 'Mehrauli'].map(loc => (
                <p key={loc} className="text-sm text-gray-700 hover:text-gray-900">{loc}</p>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h3 className="text-lg font-semibold text-[#FE6F61] mb-3 border-b border-[#fe6f61]/30 pb-1 flex items-center gap-2">
                <MapPin size={18} /> North Delhi
              </h3>
              {['Mukherjee Nagar', 'Kamla Nagar', 'Hudson Lane', 'Model Town', 'GTB Road', 'Old Rajinder Nagar', 'Shakti Nagar', 'Vijay Nagar', 'Patel Nagar', 'Karol Bagh', 'Outram Lines', 'Roop Nagar', 'Kingsway Camp'].map(loc => (
                <p key={loc} className="text-sm text-gray-700 hover:text-gray-900">{loc}</p>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h3 className="text-lg font-semibold text-[#FE6F61] mb-3 border-b border-[#fe6f61]/30 pb-1 flex items-center gap-2">
                <MapPin size={18} /> East Delhi
              </h3>
              {['Laxmi Nagar', 'Mayur Vihar (I)', 'Mayur Vihar (II)', 'Mayur Vihar (III)', 'Preet Vihar', 'Karkardooma', 'Vasundhara Nagar', 'IP Extension', 'Shakarpur', 'Patparganj', 'Pandav Nagar', 'Anand Vihar', 'Geeta Colony', 'Ghaziabad'].map(loc => (
                <p key={loc} className="text-sm text-gray-700 hover:text-gray-900">{loc}</p>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h3 className="text-lg font-semibold text-[#FE6F61] mb-3 border-b border-[#fe6f61]/30 pb-1 flex items-center gap-2">
                <MapPin size={18} /> West Delhi
              </h3>
              {['Janakpuri', 'Uttam Nagar', 'Rajouri Garden', 'Vikaspuri', 'Subhash Nagar', 'Tilak Nagar', 'Paschim Vihar', 'Dwarka Mor', 'Naraina Vihar', 'Tagore Garden', 'Moti Nagar', 'Kirti Nagar'].map(loc => (
                <p key={loc} className="text-sm text-gray-700 hover:text-gray-900">{loc}</p>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
}
