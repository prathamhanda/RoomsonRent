import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Image, X, ChevronLeft, ChevronRight } from 'lucide-react';

const RoomDetailsCard = ({ floor, roomIndex, room }) => {
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

  // Function to handle navigation in the photo gallery
  const handlePhotoNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentPhotoIndex((prev) => 
        prev === room.photos.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? room.photos.length - 1 : prev - 1
      );
    }
  };

  // Function to render tenant information
  const renderTenants = () => {
    if (!room.tenants || room.tenants.length === 0) {
      return (
        <div className="flex items-center text-gray-500 italic">
          <User size={16} className="mr-2" />
          <span>No tenants assigned</span>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {room.tenants.map((tenant, index) => (
          <div key={index} className="flex items-center">
            <User size={16} className="text-blue-500 mr-2 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{tenant.name}</span>
              <div className="flex items-center text-xs text-gray-500">
                <Phone size={12} className="mr-1" />
                <span>{tenant.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render photo galleries
  const renderPhotos = () => {
    if (!room.photos || room.photos.length === 0) {
      return (
        <div className="flex items-center text-gray-500 italic">
          <Image size={16} className="mr-2" />
          <span>No photos available</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-1">
        {room.photos.slice(0, 3).map((photo, index) => (
          <img 
            key={index}
            src={optimizeCloudinaryUrl(photo, 150)}
            alt={`Room ${roomIndex + 1} photo ${index + 1}`}
            className="h-12 w-full object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              setCurrentPhotoIndex(index);
              setShowPhotoGallery(true);
            }}
          />
        ))}
        {room.photos.length > 3 && (
          <div 
            className="flex items-center justify-center bg-gray-100 rounded text-xs text-gray-600 h-12 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => {
              setCurrentPhotoIndex(3);
              setShowPhotoGallery(true);
            }}
          >
            +{room.photos.length - 3} more
          </div>
        )}
      </div>
    );
  };

  // Photo Gallery Modal
  const PhotoGallery = () => (
    <AnimatePresence>
      {showPhotoGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPhotoGallery(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-3xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPhotoGallery(false)}
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 p-2 rounded-full z-10 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
            
            <div className="relative bg-black rounded-lg overflow-hidden">
              <img
                src={optimizeCloudinaryUrl(room.photos[currentPhotoIndex], 1000)}
                alt={`Room photo ${currentPhotoIndex + 1}`}
                className="w-full max-h-[70vh] object-contain"
              />
              
              {room.photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePhotoNavigation('prev');
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft size={24} className="text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePhotoNavigation('next');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors"
                  >
                    <ChevronRight size={24} className="text-white" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center text-sm">
                {currentPhotoIndex + 1} / {room.photos.length}
              </div>
            </div>
            
            {room.photos.length > 1 && (
              <div className="mt-2 flex overflow-x-auto gap-1 p-1">
                {room.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={optimizeCloudinaryUrl(photo, 100)}
                    alt={`Thumbnail ${index + 1}`}
                    className={`h-14 w-20 object-cover rounded cursor-pointer transition-all ${
                      currentPhotoIndex === index 
                        ? 'border-2 border-white' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPhotoIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: roomIndex * 0.1 }}
        className="p-3 border border-gray-200 rounded-lg bg-white"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800">Room {roomIndex + 1}</h3>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {room.sharingOptions.join(', ')}
          </span>
        </div>
        
        <div className="mb-2">
          <p className="text-xs text-gray-500">For {room.targetTenants}</p>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Photos:</h4>
            {renderPhotos()}
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Tenants:</h4>
            {renderTenants()}
          </div>
        </div>
      </motion.div>
      
      <PhotoGallery />
    </>
  );
};

export default RoomDetailsCard; 