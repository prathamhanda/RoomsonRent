import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { format } from "date-fns";
import Footer from "../shared/Footer";

const PropertyBookingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeFloors, setActiveFloors] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkInDate: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"), // Tomorrow
    checkOutDate: format(new Date(Date.now() + 2592000000), "yyyy-MM-dd"), // 30 days from now
    guests: 1,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://backend.roomsonrent.in/api/listings/${id}`);
        
        if (response.data.success) {
          const listingData = response.data.data;
          setListing(listingData);
          
          // Filter active floors that have rooms
          const availableFloors = listingData.floors.filter(
            floor => (floor.active !== false) && floor.rooms && floor.rooms.length > 0
          );
          
          setActiveFloors(availableFloors);
          
          // Set default selected floor and room if available
          if (availableFloors.length > 0) {
            setSelectedFloor(availableFloors[0]);
            if (availableFloors[0].rooms && availableFloors[0].rooms.length > 0) {
              setSelectedRoom(availableFloors[0].rooms[0]);
            }
          }
        } else {
          setError("Failed to fetch property details");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("An error occurred while fetching property details");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
    if (floor.rooms && floor.rooms.length > 0) {
      setSelectedRoom(floor.rooms[0]);
      setCurrentImageIndex(0);
    } else {
      setSelectedRoom(null);
    }
  };

  const handleRoomChange = (room) => {
    setSelectedRoom(room);
    setCurrentImageIndex(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real application, this would submit the booking data to the backend
    alert("Booking functionality would be implemented here with actual backend integration");
  };

  const nextImage = () => {
    if (selectedRoom && selectedRoom.photos && selectedRoom.photos.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedRoom.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedRoom && selectedRoom.photos && selectedRoom.photos.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedRoom.photos.length - 1 : prev - 1
      );
    }
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

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

  // Check if there are any active floors with rooms
  if (activeFloors.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-amber-500 mb-4">Property Not Available</h1>
        <p className="text-gray-700 mb-8">This property currently has no available rooms.</p>
        <Link to="/" className="px-6 py-3 bg-[#FE6F61] text-white rounded-full shadow-md hover:bg-[#e55a4d] transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const roomPhotos = selectedRoom?.photos || [];
  const currentPhoto = roomPhotos[currentImageIndex] || '/images/78c3c990590b6c112e5b5cb34f1fbfac.webp';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Rooms On Rent</Link>
          <Link to="/" className="px-4 py-2 text-[#FE6F61] hover:bg-gray-100 rounded-md transition-colors">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Property Title and Location */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
            <p className="text-gray-500 mt-1">{listing.address}, {listing.location.city}, {listing.location.state}</p>
          </div>

          <div className="md:flex">
            {/* Left Column - Photos and Details */}
            <div className="md:w-2/3 p-6">
              {/* Photo Gallery */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100 h-96 mb-6">
                {roomPhotos.length > 0 ? (
                  <>
                    <img 
                      src={currentPhoto} 
                      alt={`Room ${selectedRoom.roomId}`} 
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={openLightbox}
                    />
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                    >
                      &#10094;
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                    >
                      &#10095;
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      {roomPhotos.map((_, index) => (
                        <button 
                          key={index} 
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 mx-1 rounded-full ${currentImageIndex === index ? 'bg-[#FE6F61]' : 'bg-white/70'}`}
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

              {/* Property Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Property Type</p>
                    <p className="font-semibold">{listing.propertyType}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Furnishing</p>
                    <p className="font-semibold">{listing.furnishingStatus}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Available Floors</p>
                    <p className="font-semibold">{activeFloors.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Price</p>
                    <p className="font-semibold">₹ {listing.price?.toLocaleString() || "Price on request"}/month</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Availability</p>
                    <p className="font-semibold">{listing.available ? "Available" : "Not Available"}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                {listing.amenities && listing.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <span className="text-green-600">✓</span>
                        </div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No amenities listed</p>
                )}
              </div>

              {/* Rules */}
              {listing.rules && listing.rules.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">House Rules</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {listing.rules.map((rule, index) => (
                      <li key={index} className="text-gray-700">{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Floor/Room Selection and Booking Form */}
            <div className="md:w-1/3 border-l border-gray-200 p-6">
              {/* Floor and Room Selection */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Select Floor & Room</h2>
                
                {/* Floor Selection */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Select Floor</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activeFloors.map((floor, index) => {
                      // Find the original index in the full floors array for proper labeling
                      const originalIndex = listing.floors.findIndex(f => f.floorId === floor.floorId);
                      return (
                        <button
                          key={floor.floorId}
                          onClick={() => handleFloorChange(floor)}
                          className={`p-3 rounded-lg border transition-all duration-200 ${
                            selectedFloor?.floorId === floor.floorId
                              ? 'bg-[#FE6F61] text-white border-[#FE6F61]'
                              : 'border-gray-200 hover:border-[#FE6F61]'
                          }`}
                        >
                          {originalIndex === 0 ? "Ground Floor" : `Floor ${originalIndex}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Room Selection */}
                {selectedFloor && selectedFloor.rooms && selectedFloor.rooms.length > 0 && (
                  <div>
                    <p className="text-gray-700 mb-2">Room:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFloor.rooms.map((room, index) => (
                        <button
                          key={room.roomId}
                          onClick={() => handleRoomChange(room)}
                          className={`px-4 py-2 rounded-md transition-colors ${
                            selectedRoom?.roomId === room.roomId
                              ? "bg-[#FE6F61] text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          Room {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Room Info */}
              {selectedRoom && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Room Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Type:</span> {selectedRoom.type}</p>
                    <p><span className="text-gray-500">Sharing Options:</span> {selectedRoom.sharingOptions.join(", ")}</p>
                    <p><span className="text-gray-500">Target Tenants:</span> {selectedRoom.targetTenants}</p>
                    <p><span className="text-gray-500">Available Photos:</span> {selectedRoom.photos ? selectedRoom.photos.length : 0}</p>
                  </div>
                </div>
              )}

              {/* Booking Form */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-xl font-bold mb-4">Book Now</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="checkInDate">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      value={bookingData.checkInDate}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="checkOutDate">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      id="checkOutDate"
                      name="checkOutDate"
                      value={bookingData.checkOutDate}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guests">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      id="guests"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                      min="1"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialRequests">
                      Special Requests
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#FE6F61] hover:bg-[#e55a4d] text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && roomPhotos.length > 0 && (
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
              className="relative max-w-4xl max-h-[90vh] mx-auto p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={currentPhoto} 
                alt={`Room ${selectedRoom.roomId} full view`} 
                className="max-w-full max-h-[85vh] object-contain mx-auto"
              />
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full shadow-md transition-colors"
              >
                &#10094;
              </button>
              <button 
                onClick={nextImage}
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
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                {roomPhotos.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 mx-1 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add the Footer component */}
      <Footer />
    </div>
  );
};

export default PropertyBookingPage;
