import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '../Navbar';
import Footer from '../shared/Footer';
import backendURL from '@/config/config';

// Helper function to extract all photos from a listing's floors and rooms
const getListingPhotos = (listing) => {
  const photos = [];
  if (listing.floors && Array.isArray(listing.floors)) {
    listing.floors.forEach(floor => {
      if (floor.rooms && Array.isArray(floor.rooms)) {
        floor.rooms.forEach(room => {
          if (room.photos && Array.isArray(room.photos)) {
            photos.push(...room.photos);
          }
        });
      }
    });
  }
  return photos;
};

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendURL}/api/listings/${id}`);
        if (response.data.success) {
          setListing(response.data.data);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err.response?.data?.message || 'Failed to load property details');
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-white shadow-sm">
          <Navbar textColor="text-black" bgColor="bg-white" />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F61] mb-4"></div>
            <p className="text-gray-500 font-medium">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-white shadow-sm">
          <Navbar textColor="text-black" bgColor="bg-white" />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#20365F] mb-2">Property Not Found</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/search')}
              className="px-8 py-3 bg-[#FF7F61] text-white rounded-xl hover:bg-[#ff6945] font-bold transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = getListingPhotos(listing);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white shadow-sm">
        <Navbar textColor="text-black" bgColor="bg-white" />
      </div>
      
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/search')}
            className="mb-6 flex items-center text-[#20365F] hover:text-[#FF7F61] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>

          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative h-96 bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
              {images.length > 0 ? (
                <>
                  <img 
                    src={images[activeImageIndex]} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>No images available for this property</span>
                </div>
              )}
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#FF7F61]' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Property Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-[#20365F] mb-2">{listing.title}</h1>
              
              {/* Location */}
              <div className="flex items-center text-gray-600 mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{listing.address}</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-black text-[#FF7F61] mb-6">
                ₹{listing.price?.toLocaleString()} <span className="text-lg text-gray-500">/ Month</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#20365F] mb-4">About This Property</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#20365F] mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center bg-gray-100 rounded-lg p-3">
                        <svg className="w-5 h-5 text-[#FF7F61] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Floors Info */}
              {listing.floors && listing.floors.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#20365F] mb-4">Floor Details</h2>
                  <div className="space-y-3">
                    {listing.floors.map((floor, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-semibold text-[#20365F] mb-2">Floor {idx + 1}</h3>
                        <p className="text-sm text-gray-600">Rooms: {floor.numberOfRooms}</p>
                        {floor.rooms && floor.rooms.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Sharing Options:</p>
                            <div className="flex flex-wrap gap-2">
                              {floor.rooms[0]?.sharingOptions?.map((option, i) => (
                                <span key={i} className="text-xs bg-[#FF7F61] text-white px-2 py-1 rounded-full">
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact & CTA */}
            <div>
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 sticky top-20">
                {/* Owner Info */}
                {listing.owner && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-bold text-[#20365F] mb-3">Owner Details</h3>
                    <p className="text-sm"><span className="font-semibold">Name:</span> {listing.owner.name || 'Not Available'}</p>
                    <p className="text-sm mt-1"><span className="font-semibold">Phone:</span> {listing.owner.phone || 'Not Available'}</p>
                    <p className="text-sm mt-1"><span className="font-semibold">Email:</span> {listing.owner.email || 'Not Available'}</p>
                  </div>
                )}

                {/* Badges */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {listing.verified && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Verified
                    </div>
                  )}
                  {listing.featured && (
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ★ Featured
                    </div>
                  )}
                  {listing.available && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Available
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <button 
                  onClick={() => navigate(`/property/${id}/visit`)}
                  className="w-full bg-[#FF7F61] text-white py-3 rounded-xl hover:bg-[#ff6945] font-bold transition-colors mb-3"
                >
                  Schedule a Visit
                </button>
                
                <button 
                  className="w-full border-2 border-[#20365F] text-[#20365F] py-3 rounded-xl hover:bg-gray-50 font-bold transition-colors"
                >
                  Contact Owner
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetailsPage;
