import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useListing } from '../context/ListingContext';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/common/Spinner';
import ListingCard from '../components/listings/ListingCard';
import axios from 'axios';

const UserFavorites = () => {
  const { getUserFavorites, toggleFavorite, loading } = useListing();
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/api/favorites');
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);
  
  const handleRemoveFavorite = async (listingId) => {
    try {
      await toggleFavorite(listingId);
      // Remove from favorites list
      setFavorites(favorites.filter(listing => listing._id !== listingId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove from favorites. Please try again.');
    }
  };
  
  if (isLoading || loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" color="indigo" />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your saved PG accommodations
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <img 
                src="/images/no-favorites.svg" 
                alt="No favorites" 
                className="w-48 h-48 mx-auto opacity-50"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No favorites yet</h3>
              <p className="mt-1 text-gray-500">
                You haven't saved any PG accommodations to your favorites list.
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(listing => (
                <div key={listing._id} className="relative group">
                  <button
                    onClick={() => handleRemoveFavorite(listing._id)}
                    className="absolute right-4 top-4 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
                    title="Remove from favorites"
                  >
                    <svg className="h-5 w-5 text-[#FE6F61]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserFavorites; 