import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useListing } from '../context/ListingContext';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/common/Spinner';
import ImageGallery from '../components/listings/ImageGallery';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, slideInLeft, slideInRight } from '../utils/animations';
import Map from '../components/common/Map';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListingById, toggleFavorite, loading, error } = useListing();
  const { user } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListingById(id);
        setListing(data);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching listing:', err);
      }
    };
    
    fetchListing();
  }, [id, getListingById]);
  
  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/listings/${id}` } });
      return;
    }
    
    setIsFavoriting(true);
    try {
      await toggleFavorite(id);
      // Update the listing's favorites after toggling
      const updatedListing = await getListingById(id);
      setListing(updatedListing);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsFavoriting(false);
    }
  };
  
  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/bookings/new?listingId=${id}` } });
      return;
    }
    navigate(`/bookings/new?listingId=${id}`);
  };
  
  // Format currency for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Check if listing is favorited by current user
  const isFavorited = user && listing?.favorites.includes(user._id);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" color="indigo" />
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading listing. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!listing) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Listing not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <motion.nav 
            className="mb-6 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ol className="flex flex-wrap items-center space-x-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#FE6F61]">Home</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link to="/search" className="text-gray-500 hover:text-[#FE6F61]">Search</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-[#FE6F61] font-medium truncate max-w-xs">{listing.title}</li>
            </ol>
          </motion.nav>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <motion.div 
              className="lg:w-2/3"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {/* Title and location */}
              <motion.div variants={slideUp} className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                <div className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-1 text-[#FE6F61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{listing.location.name}, {listing.location.city}</span>
                </div>
              </motion.div>

              {/* Image Gallery */}
              <motion.div variants={slideUp} className="mb-8">
                <ImageGallery images={listing.images} />
              </motion.div>

              {/* Description */}
              <motion.div variants={slideUp} className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">About this PG</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </motion.div>

              {/* Amenities */}
              <motion.div variants={slideUp} className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="h-5 w-5 mr-2 text-[#FE6F61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* House Rules */}
              {listing.rules && listing.rules.length > 0 && (
                <motion.div variants={slideUp} className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h2 className="text-xl font-semibold mb-4">House Rules</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.rules.map((rule, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-[#FE6F61] mr-2">
                          {rule.allowed ? (
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700">{rule.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Map */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                {listing && listing.location && listing.address && (
                  <Map 
                    markers={[
                      {
                        coordinates: {
                          lat: listing.location.coordinates?.lat || 0,
                          lng: listing.location.coordinates?.lng || 0
                        },
                        title: listing.title,
                        address: listing.address
                      }
                    ]}
                    height="400px"
                    className="rounded-lg border border-gray-300"
                    zoom={15}
                  />
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="lg:w-1/3"
              initial="hidden"
              animate="visible"
              variants={slideInRight}
            >
              {/* Price and booking box */}
              <div className="sticky top-20">
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(listing.price)}</span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                  
                  {/* Additional costs */}
                  <div className="border-t border-b border-gray-200 py-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium">{formatPrice(listing.securityDeposit || listing.price)}</span>
                    </div>
                    {listing.maintenanceFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maintenance Fee</span>
                        <span className="font-medium">{formatPrice(listing.maintenanceFee)}/month</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Book Now button */}
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-[#FE6F61] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61] transition duration-200"
                  >
                    Book Now
                  </button>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Free cancellation before 48 hours of check-in
                  </p>
                </div>
                
                {/* Owner details */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">About the Owner</h3>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-medium uppercase">
                      {listing.owner.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{listing.owner.name}</p>
                      <p className="text-sm text-gray-500">Owner since {new Date(listing.owner.createdAt).getFullYear()}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {!showPhoneNumber ? (
                      <button
                        onClick={() => setShowPhoneNumber(true)}
                        className="w-full border border-[#FE6F61] text-[#FE6F61] py-2 px-4 rounded-lg font-medium hover:bg-[#FE6F61] hover:text-white transition duration-200"
                      >
                        Show Contact Number
                      </button>
                    ) : (
                      <div className="flex items-center justify-center border border-gray-300 rounded-lg p-2">
                        <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">{listing.owner.phone || "+91 9876543210"}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <svg className="h-5 w-5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {listing.rating ? (
                      <>
                        <span>{listing.rating.toFixed(1)}</span>
                        <span className="mx-1">•</span>
                        <span>{listing.reviewCount || "No"} reviews</span>
                      </>
                    ) : (
                      <span>New listing</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ListingDetails; 