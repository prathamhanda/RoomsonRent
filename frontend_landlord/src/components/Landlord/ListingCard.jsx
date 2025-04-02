import React from 'react';
import { motion } from "framer-motion";
import { Card } from '@heroui/card';

const ListingCard = ({ listing }) => {
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
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            {listing.verified && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-800">{listing.title}</h3>
          
          <div className="text-sm text-gray-600 mb-2">
            <p>{listing.address}</p>
            <p>{listing.location?.city}, {listing.location?.state}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {listing.propertyType && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {listing.propertyType}
              </span>
            )}
            {listing.furnishingStatus && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {listing.furnishingStatus}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {listing.amenities?.slice(0, 3).map((amenity, index) => (
              <span key={index} className="bg-[#FE6F61]/10 text-[#FE6F61] text-xs px-2 py-1 rounded">
                {amenity}
              </span>
            ))}

            {listing.amenities?.length > 3 && (
              <span className="text-xs text-gray-500">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {listing.numberOfFloors} {listing.numberOfFloors > 1 ? 'Floors' : 'Floor'}
              </span>
              •
              <span className="text-sm">
                {listing.floors?.reduce((acc, floor) => acc + floor.numberOfRooms, 0)} Rooms
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                className="px-3 py-1 text-sm bg-[#FE6F61] text-white rounded-lg hover:bg-[#FE6F61]/90"
                onClick={() => window.location.href = `/edit-listing/${listing._id}`}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ListingCard;