import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListing } from '../context/ListingContext';
import { useLocation as useLocationContext } from '../context/LocationContext';
import Spinner from '../components/common/Spinner';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, staggerContainer, scaleUp } from '../utils/animations';
import SearchBar from '../components/search/SearchBar';
import MainLayout from '../layouts/MainLayout';
import ListingCard from '../components/listings/ListingCard';

const Home = () => {
  const { getListings, listings, loading } = useListing();
  const { getLocations } = useLocationContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getListings();
    getLocations();
  }, [getListings, getLocations]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (selectedLocation) params.append('location', selectedLocation);
    
    navigate(`/search?${params.toString()}`);
  };

  // Features section data
  const features = [
    {
      icon: (
        <svg className="h-8 w-8 text-[#FE6F61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Listings',
      description: 'All PGs are personally verified to ensure quality and safety'
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#FE6F61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'No Brokerage',
      description: 'Book directly with owners without paying any brokerage fees'
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#FE6F61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Near Colleges',
      description: 'Find PGs within walking distance from your college or workplace'
    }
  ];

  // How it works steps
  const steps = [
    {
      number: '01',
      title: 'Search',
      description: 'Search for PGs by location, college, or amenities'
    },
    {
      number: '02',
      title: 'Compare',
      description: 'Compare prices, amenities, and reviews to find your perfect match'
    },
    {
      number: '03',
      title: 'Book',
      description: 'Book instantly online or schedule a visit before deciding'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section with Animation */}
      <motion.section 
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            variants={slideUp}
          >
            Find Your Perfect PG Accommodation
          </motion.h1>
          <motion.p 
            className="text-xl text-white mb-8 max-w-2xl mx-auto"
            variants={slideUp}
          >
            Discover affordable and comfortable PG accommodations near your college or workplace
          </motion.p>
          <motion.div 
            className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-lg"
            variants={slideUp}
          >
            <SearchBar />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section with Animation */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={slideUp}
          >
            Why Choose RoomsOnRent
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                variants={slideUp}
              >
                <div className="text-[#FE6F61] text-4xl mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section with Animation */}
      <motion.section 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={slideUp}
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={slideUp}
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#FE6F61] text-white text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">{step.title}</h3>
                <p className="mt-2 text-base text-gray-500">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Listings Section with Animation */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex justify-between items-center mb-8"
            variants={slideUp}
          >
            <h2 className="text-3xl font-bold">Featured PG Accommodations</h2>
            <Link to="/search" className="text-[#FE6F61] hover:underline font-medium">
              View All
            </Link>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="large" color="indigo" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <motion.div 
                  key={listing._id} 
                  variants={scaleUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA Section with Animation */}
      <motion.section 
        className="py-16 bg-[#FE6F61] text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            variants={slideUp}
          >
            Ready to Find Your Perfect PG?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            variants={slideUp}
          >
            Join thousands of students and working professionals who found their ideal accommodation through RoomsOnRent
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={slideUp}
          >
            <Link to="/search" className="bg-white text-[#FE6F61] py-3 px-8 rounded-lg font-medium text-lg hover:bg-gray-100 transition duration-300">
              Start Searching
            </Link>
            <Link to="/register?role=owner" className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-lg font-medium text-lg hover:bg-white hover:text-[#FE6F61] transition duration-300">
              List Your Property
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </MainLayout>
  );
};

export default Home;