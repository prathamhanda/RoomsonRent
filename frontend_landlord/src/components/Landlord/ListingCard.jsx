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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRoomDetails = (floorId, roomId) => {
    navigate(`/landlord/listings/${listing._id}/floor/${floorId}/room/${roomId}`);
  };

  const handleEditProperty = () => {
    navigate(`/landlord/listings/${listing._id}/edit`);
  };

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

  const toggleFloor = (floorId) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floorId]: !prev[floorId]
    }));
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="w-full relative"
      >
        <Card className="h-full bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-48">
            {listing.images && listing.images.length > 0 ? (
              <img 
                src={listing.images[0]} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Home className="h-10 w-10 text-gray-400" />
                <span className="text-gray-400 ml-2">No image available</span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 bg-white/90 hover:bg-red-50 rounded-full shadow-md transition-colors"
                aria-label="Delete property"
              >
                <Trash2 size={20} className="text-red-600" />
              </button>
              <button
                onClick={handleEditProperty}
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
                    <span className="font-medium text-gray-700">Floor {floorIndex + 1}</span>
                    {expandedFloors[floor.floorId] ? (
                      <ChevronDown size={20} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-500" />
                    )}
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

      {/* Delete Confirmation Modal Portal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full pointer-events-auto"
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
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ListingCard;