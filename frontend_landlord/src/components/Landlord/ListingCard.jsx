import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from '@heroui/card';
import { Edit, Home, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const [expandedFloors, setExpandedFloors] = useState({});

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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="w-full"
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
  );
};

export default ListingCard;