import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  MapPin,
  Home,
  Check,
  ChevronDown,
  ChevronUp,
  Calendar,
  Phone,
  Share2,
  MessageSquare,
  ArrowLeft,
  MapIcon,
  HelpCircle,
  Clock,
  Users,
  Key
} from 'lucide-react';
import Footer from "../shared/Footer";
import backendURL from '@/config/config';

const SiteVisitPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [openSection, setOpenSection] = useState('description');
  const [allPhotos, setAllPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendURL}/api/listings/${id}`);
        if (response.data.success) {
          setListing(response.data.data);
          // Set default selected floor if available
          if (response.data.data.floors && response.data.data.floors.length > 0) {
            setSelectedFloor(response.data.data.floors[0]);
          }
        } else {
          setError("Failed to fetch property details");
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError("An error occurred while fetching property details");
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    if (listing) {
      const photos = [];
      // Add main listing photos
      if (listing.images && listing.images.length > 0) {
        photos.push(...listing.images);
      }
      // Add room photos from each floor
      if (listing.floors) {
        listing.floors.forEach(floor => {
          if (floor.rooms) {
            floor.rooms.forEach(room => {
              if (room.photos && room.photos.length > 0) {
                photos.push(...room.photos);
              }
            });
          }
        });
      }
      setAllPhotos(photos);
    }
  }, [listing]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleScheduleVisit = () => {
    // You can implement a modal or form here for scheduling
    toast.success('Schedule visit functionality coming soon!');
  };

  const handleWhatsApp = () => {
    if (listing?.owner?.phone) {
      const message = `Hi, I'm interested in your property: ${listing.title} (${window.location.href})`;
      const whatsappUrl = `https://wa.me/91${listing.owner.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast.error('Owner contact not available');
    }
  };

  const handleCall = () => {
    if (listing?.owner?.phone) {
      window.location.href = `tel:+91${listing.owner.phone}`;
    } else {
      toast.error('Owner contact not available');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: `Check out this property: ${listing.title}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const slideIn = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  };

  // FAQ data
  const faqs = [
    {
      question: "What is the minimum stay duration?",
      answer: "The minimum stay duration varies by property. Generally, we recommend a minimum stay of 3 months for a better rental experience."
    },
    {
      question: "What documents are required for booking?",
      answer: "You'll need to provide a valid ID proof (Aadhar/Passport/Driving License), recent passport-size photographs, and address proof. For students, college ID and parent's details are also required."
    },
    {
      question: "Is the security deposit refundable?",
      answer: "Yes, the security deposit is fully refundable at the time of vacating, subject to any damages or outstanding dues as per the agreement terms."
    },
    {
      question: "Are there any maintenance charges?",
      answer: "Maintenance charges vary by property and typically include electricity, water, and general upkeep. Please check with the property owner for specific details."
    },
    {
      question: "What's the notice period for vacating?",
      answer: "A standard notice period of 30 days is required before vacating the property. This helps us prepare for the next tenant and process your deposit refund."
    }
  ];

  // General rules
  const generalRules = [
    "Maintain cleanliness in common areas",
    "Follow the designated parking spots",
    "Respect quiet hours (10 PM - 6 AM)",
    "Register guests at the security desk",
    "Proper waste segregation is mandatory",
    "No modifications to the property without permission",
    "Regular rent payment by 5th of every month",
    "Smoking only in designated areas"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FE6F61]"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Property</h1>
        <p className="text-gray-700 mb-8">{error || "Property not found"}</p>
        <Link to="/" className="px-6 py-3 bg-[#FE6F61] text-white rounded-full shadow-md hover:bg-[#e55a4d] transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Wi-Fi': '📶',
      'Air Conditioning': '❄️',
      'Power Backup': '🔋',
      'Washing Machine': '🧺',
      'TV': '📺',
      'CCTV': '📹',
      'Security': '👮',
      'Parking': '🅿️',
      'Gym': '💪',
      'Swimming Pool': '🏊',
      'Lift': '🛗',
      'Geyser': '🚿',
      'Microwave': '🔥',
      'Refrigerator': '🌡️'
    };
    return icons[amenity] || '✨';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Rooms On Rent</Link>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Property Title and Location */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <p className="text-gray-600">
                {listing.address}, {listing.location.city}, {listing.location.state}
              </p>
            </div>
            {listing.landmark && (
              <div className="flex items-center gap-2 mt-1">
                <MapIcon className="w-4 h-4 text-gray-500" />
                <p className="text-gray-600">Near {listing.landmark}</p>
              </div>
            )}
            {listing.verified && (
              <div className="flex items-center gap-2 mt-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500 text-sm">Verified Property</span>
              </div>
            )}
          </div>

          <div className="md:flex">
            {/* Left Column - Photos and Details */}
            <div className="md:w-2/3 p-6">
              {/* Photo Carousel */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100 h-96 mb-6">
                {allPhotos.length > 0 ? (
                  <>
                    <img
                      src={allPhotos[currentPhotoIndex]}
                      alt={`Property view ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={openLightbox}
                    />
                    <button
                      onClick={() => setCurrentPhotoIndex(prev => prev === 0 ? allPhotos.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                    >
                      &#10094;
                    </button>
                    <button
                      onClick={() => setCurrentPhotoIndex(prev => prev === allPhotos.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                    >
                      &#10095;
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {allPhotos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentPhotoIndex === index ? 'bg-white w-4' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No photos available</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {allPhotos.slice(0, 8).map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPhotoIndex(index);
                      openLightbox();
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      currentPhotoIndex === index ? 'ring-2 ring-[#FE6F61]' : ''
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Collapsible Sections */}
              <div className="space-y-4">
                {/* Description Section */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                  initial="initial"
                  animate="animate"
                  variants={slideIn}
                >
                  <button
                    className="w-full px-6 py-4 flex justify-between items-center"
                    onClick={() => setOpenSection(openSection === 'description' ? '' : 'description')}
                  >
                    <h2 className="text-xl font-semibold">Description</h2>
                    {openSection === 'description' ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection === 'description' && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 whitespace-pre-line">
                            {listing.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Amenities Section */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                  initial="initial"
                  animate="animate"
                  variants={slideIn}
                >
                  <button
                    className="w-full px-6 py-4 flex justify-between items-center"
                    onClick={() => setOpenSection(openSection === 'amenities' ? '' : 'amenities')}
                  >
                    <h2 className="text-xl font-semibold">Amenities</h2>
                    {openSection === 'amenities' ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection === 'amenities' && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {listing.amenities.map((amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 rounded-md bg-gray-50"
                              >
                                <span className="text-xl">{getAmenityIcon(amenity)}</span>
                                <span className="text-gray-700">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Rules Section */}
                {listing.rules && listing.rules.length > 0 && (
                  <motion.div 
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                    initial="initial"
                    animate="animate"
                    variants={slideIn}
                  >
                    <button
                      className="w-full px-6 py-4 flex justify-between items-center"
                      onClick={() => setOpenSection(openSection === 'rules' ? '' : 'rules')}
                    >
                      <h2 className="text-xl font-semibold">House Rules</h2>
                      {openSection === 'rules' ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openSection === 'rules' && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4">
                            <ul className="list-disc list-inside space-y-2">
                              {listing.rules.map((rule, index) => (
                                <li key={index} className="text-gray-600">{rule}</li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Floor Plans Section */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                  initial="initial"
                  animate="animate"
                  variants={slideIn}
                >
                  <button
                    className="w-full px-6 py-4 flex justify-between items-center"
                    onClick={() => setOpenSection(openSection === 'floors' ? '' : 'floors')}
                  >
                    <h2 className="text-xl font-semibold">Floor Details</h2>
                    {openSection === 'floors' ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection === 'floors' && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          {listing.floors.map((floor, index) => (
                            <div
                              key={floor.floorId}
                              className="border-b last:border-b-0 py-4"
                            >
                              <h3 className="font-semibold mb-2">
                                {index === 0 ? "Ground Floor" : `Floor ${index}`}
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gray-500">Number of Rooms</p>
                                  <p className="font-semibold">{floor.numberOfRooms}</p>
                                </div>
                                {floor.rooms && floor.rooms.length > 0 && (
                                  <div>
                                    <p className="text-gray-500">Sharing Options</p>
                                    <p className="font-semibold">
                                      {floor.rooms[0]?.sharingOptions.join(', ')}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* General Rules Section */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
                  initial="initial"
                  animate="animate"
                  variants={slideIn}
                >
                  <button
                    className="w-full px-6 py-4 flex justify-between items-center"
                    onClick={() => setOpenSection(openSection === 'generalRules' ? '' : 'generalRules')}
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#FE6F61]" />
                      <h2 className="text-xl font-semibold">General Rules</h2>
                    </div>
                    {openSection === 'generalRules' ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection === 'generalRules' && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {generalRules.map((rule, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="mt-1">•</div>
                                <span className="text-gray-600">{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* FAQs Section */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
                  initial="initial"
                  animate="animate"
                  variants={slideIn}
                >
                  <button
                    className="w-full px-6 py-4 flex justify-between items-center"
                    onClick={() => setOpenSection(openSection === 'faqs' ? '' : 'faqs')}
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#FE6F61]" />
                      <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                    </div>
                    {openSection === 'faqs' ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection === 'faqs' && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <div className="space-y-4">
                            {faqs.map((faq, index) => (
                              <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-[#FE6F61]" />
                      <h3 className="font-semibold">Visit Timings</h3>
                    </div>
                    <p className="text-gray-600">10:00 AM - 7:00 PM<br />All days of the week</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-[#FE6F61]" />
                      <h3 className="font-semibold">Occupancy</h3>
                    </div>
                    <p className="text-gray-600">Available for immediate move-in<br />Multiple sharing options</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Key className="w-5 h-5 text-[#FE6F61]" />
                      <h3 className="font-semibold">Security Deposit</h3>
                    </div>
                    <p className="text-gray-600">2 months rent<br />100% refundable</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact and Booking */}
            <div className="md:w-1/3 p-6">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Pricing</h3>
                  {selectedFloor?.rooms && selectedFloor.rooms.length > 0 && selectedFloor.rooms[0].discountedPrice ? (
                    <div>
                      <p className="text-gray-400 line-through text-sm">₹ {selectedFloor.rooms[0].price?.toLocaleString() || 0}/month</p>
                      <div className="flex items-center">
                        <p className="font-bold text-2xl text-[#FE6F61]">₹ {selectedFloor.rooms[0].discountedPrice.toLocaleString()}/month</p>
                        {selectedFloor.rooms[0].price && selectedFloor.rooms[0].discountedPrice && (
                          <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                            {Math.round(((selectedFloor.rooms[0].price - selectedFloor.rooms[0].discountedPrice) / selectedFloor.rooms[0].price) * 100)}% off
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Best price guaranteed</p>
                    </div>
                  ) : listing.discountedPrice ? (
                    <div>
                      <p className="text-gray-400 line-through text-sm">₹ {listing.price?.toLocaleString() || 0}/month</p>
                      <div className="flex items-center">
                        <p className="font-bold text-2xl text-[#FE6F61]">₹ {listing.discountedPrice.toLocaleString()}/month</p>
                        {listing.price && listing.discountedPrice && (
                          <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                            {Math.round(((listing.price - listing.discountedPrice) / listing.price) * 100)}% off
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Best price guaranteed</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-2xl text-gray-800">₹ {selectedFloor?.rooms?.[0]?.price?.toLocaleString() || listing.price?.toLocaleString() || "Price on request"}/month</p>
                      <p className="text-sm text-gray-500 mt-1">Best price guaranteed</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleScheduleVisit}
                    className="w-full bg-[#FE6F61] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e55a4d] transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Visit
                  </button>
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={handleCall}
                    className="w-full border border-[#FE6F61] text-[#FE6F61] py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#FE6F61] hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </button>
                  <button 
                    onClick={handleShare}
                    className="w-full border border-gray-300 text-gray-600 py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && allPhotos.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] mx-auto p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={allPhotos[currentPhotoIndex]} 
                alt={`Property view ${currentPhotoIndex + 1} full view`} 
                className="max-w-full max-h-[85vh] object-contain mx-auto"
              />
              <button 
                onClick={() => setCurrentPhotoIndex(prev => prev === 0 ? allPhotos.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full shadow-md transition-colors"
              >
                &#10094;
              </button>
              <button 
                onClick={() => setCurrentPhotoIndex(prev => prev === allPhotos.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full shadow-md transition-colors"
              >
                &#10095;
              </button>
              <button 
                onClick={closeLightbox} 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {allPhotos.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-2 h-2 mx-1 rounded-full transition-all ${
                      currentPhotoIndex === index ? 'bg-white w-4' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default SiteVisitPage; 