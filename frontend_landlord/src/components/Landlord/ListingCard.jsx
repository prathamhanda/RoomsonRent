import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from '@heroui/card';
import { Edit, Home, ChevronDown, ChevronRight, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import backendURL from '@/config/config';

const ListingCard = ({ listing, onDelete }) => {
  const navigate = useNavigate();
  const [expandedFloors, setExpandedFloors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRoomDetails = (floorId, roomId) => {
    navigate(`/landlord/listings/${listing._id}/floor/${floorId}/room/${roomId}`);
  };

  const handleEditProperty = () => {
    navigate(`/landlord/listings/${listing._id}/edit`);
  };

  const toggleFloor = (floorId) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floorId]: !prev[floorId]
    }));
  };

  // Function to optimize Cloudinary URLs for different sizes
  const optimizeCloudinaryUrl = (url, width = 400) => {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }
    
    // Split the URL at 'upload/'
    const parts = url.split('upload/');
    
    // Add transformation parameters
    return `${parts[0]}upload/c_fill,w_${width},q_auto,f_auto/${parts[1]}`;
  };

  // Function to get property image from rooms
  const getPropertyImage = () => {
    // Check if listing has floors and rooms
    if (listing.floors && listing.floors.length > 0) {
      // Try to get the first room of first floor
      const firstFloor = listing.floors[0];
      if (firstFloor.rooms && firstFloor.rooms.length > 0) {
        const firstRoom = firstFloor.rooms[0];
        // If the first room has photos, use the first image
        if (firstRoom.photos && firstRoom.photos.length > 0) {
          return firstRoom.photos[0];
        }
      }

      // If first room doesn't have photos, check all floors and rooms for any image
      for (const floor of listing.floors) {
        if (floor.rooms && floor.rooms.length > 0) {
          for (const room of floor.rooms) {
            if (room.photos && room.photos.length > 0) {
              return room.photos[0];
            }
          }
        }
      }
    }

    // If no room images found, use listing images if available
    if (listing.images && listing.images.length > 0) {
      return listing.images[0];
    }

    // No images found
    return null;
  };

  const propertyImage = getPropertyImage();

  const handleDeleteProperty = async () => {
    try {
      setIsDeleting(true);
      
      // Delete the listing
      const response = await axios.delete(
        `${backendURL}/api/listings/${listing._id}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        // Update UI through callback
        onDelete(listing._id);
        toast.success('Property deleted successfully');
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete property. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="w-full group"
      >
        <Card className="h-full bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-48">
            {propertyImage ? (
              <img 
                src={optimizeCloudinaryUrl(propertyImage, 600)} 
                alt={listing.title}
                className="w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
                decoding="sync"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Home className="h-10 w-10 text-gray-400" />
                <span className="text-gray-400 ml-2">No image available</span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="p-2 bg-white/90 hover:bg-red-50 rounded-full shadow-md transition-colors"
                aria-label="Delete property"
              >
                <Trash2 size={20} className="text-red-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditProperty();
                }}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
              >
                <Settings size={20} className="text-gray-700" />
              </button>
              {listing.verified && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{listing.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{listing.address}</p>
            
            <div className="space-y-2">
              {listing.floors && listing.floors.map((floor, floorIndex) => (
                <div key={floor.floorId} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFloor(floor.floorId)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-700">
                      {floorIndex === 0 ? "Ground Floor" : `Floor ${floorIndex}`}
                    </span>
                    <div className="flex items-center gap-2">
                      {!expandedFloors[floor.floorId] && (
                        <div className="px-3 py-1 bg-[#FE6F61]/10 text-[#FE6F61] text-xs font-medium rounded-full">
                          Add Details
                        </div>
                      )}
                      {expandedFloors[floor.floorId] ? (
                        <ChevronDown size={20} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {expandedFloors[floor.floorId] && (
                    <div className="p-2 space-y-1 bg-white">
                      {floor.rooms && floor.rooms.map((room, roomIndex) => (
                        <button
                          key={room.roomId}
                          onClick={() => handleRoomDetails(floor.floorId, room.roomId)}
                          className="w-full flex items-center justify-between p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <span>Room {roomIndex + 1}</span>
                          <Edit size={16} className="text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-[90%] mx-4 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Property</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{listing.title}"? This action cannot be undone and will remove all associated room assignments.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProperty}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"/>
                      Deleting...
                    </>
                  ) : (
                    'Delete Property'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ListingCard;