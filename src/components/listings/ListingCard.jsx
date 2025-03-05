import { Link } from 'react-router-dom';
import { useListing } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const ListingCard = ({ listing }) => {
  const { toggleFavorite } = useListing();
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(
    user && listing.favorites ? listing.favorites.includes(user._id) : false
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Format currency for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = `/login?redirect=/listings/${listing._id}`;
      return;
    }
    
    setIsProcessing(true);
    try {
      await toggleFavorite(listing._id);
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Link to={`/listings/${listing._id}`} className="block">
      <div className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={listing.images[0] || '/images/placeholder.jpg'}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleToggleFavorite}
            disabled={isProcessing}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorited ? "#FE6F61" : "none"}
              stroke={isFavorited ? "none" : "currentColor"}
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <div className="absolute bottom-2 left-2">
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-white shadow-sm">
              {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between mb-1">
            <h3 className="text-lg font-medium text-gray-900 truncate">{listing.title}</h3>
            <p className="font-semibold text-[#FE6F61]">{formatPrice(listing.price)}</p>
          </div>
          <p className="text-sm text-gray-500 mb-2">{listing.location.name}, {listing.location.city}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index}
                className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-700"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-700">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard; 