import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ListingContext = createContext();

const API_URL ='http://localhost:5000/api';

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  // Get all listings with filters
  const getListings = async (filters = {}) => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const response = await axios.get(`${API_URL}/listings?${queryParams.toString()}`);
      
      setListings(response.data.listings);
      setPagination(response.data.pagination);
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch listings');
      toast.error(error.response?.data?.message || 'Failed to fetch listings');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch listings' };
    } finally {
      setLoading(false);
    }
  };

  // Get listing by ID
  const getListingById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings/${id}`);
      setListing(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch listing');
      toast.error(error.response?.data?.message || 'Failed to fetch listing');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch listing' };
    } finally {
      setLoading(false);
    }
  };

  // Create a new listing
  const createListing = async (listingData) => {
    try {
      setLoading(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add listing data to FormData
      Object.keys(listingData).forEach(key => {
        if (key === 'images') {
          // Handle image files
          for (let i = 0; i < listingData.images.length; i++) {
            formData.append('images', listingData.images[i]);
          }
        } else if (key === 'amenities' || key === 'rules' || key === 'nearbyColleges' || key === 'mealOptions') {
          // Handle arrays
          if (Array.isArray(listingData[key])) {
            listingData[key].forEach(item => {
              formData.append(`${key}[]`, item);
            });
          }
        } else if (typeof listingData[key] === 'object' && listingData[key] !== null) {
          // Handle nested objects
          Object.keys(listingData[key]).forEach(nestedKey => {
            formData.append(`${key}[${nestedKey}]`, listingData[key][nestedKey]);
          });
        } else {
          // Handle primitive values
          formData.append(key, listingData[key]);
        }
      });
      
      const response = await axios.post(`${API_URL}/listings`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Listing created successfully');
      return { success: true, listing: response.data.listing };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create listing');
      toast.error(error.response?.data?.message || 'Failed to create listing');
      return { success: false, error: error.response?.data?.message || 'Failed to create listing' };
    } finally {
      setLoading(false);
    }
  };

  // Update listing
  const updateListing = async (id, listingData) => {
    try {
      setLoading(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add listing data to FormData
      Object.keys(listingData).forEach(key => {
        if (key === 'images' && listingData.images instanceof FileList) {
          // Handle new image files
          for (let i = 0; i < listingData.images.length; i++) {
            formData.append('images', listingData.images[i]);
          }
        } else if (key === 'deleteImages') {
          // Handle images to delete
          if (Array.isArray(listingData[key])) {
            listingData[key].forEach(item => {
              formData.append(`${key}[]`, item);
            });
          }
        } else if (key === 'amenities' || key === 'rules' || key === 'nearbyColleges' || key === 'mealOptions') {
          // Handle arrays
          if (Array.isArray(listingData[key])) {
            listingData[key].forEach(item => {
              formData.append(`${key}[]`, item);
            });
          }
        } else if (typeof listingData[key] === 'object' && listingData[key] !== null) {
          // Handle nested objects
          Object.keys(listingData[key]).forEach(nestedKey => {
            formData.append(`${key}[${nestedKey}]`, listingData[key][nestedKey]);
          });
        } else {
          // Handle primitive values
          formData.append(key, listingData[key]);
        }
      });
      
      const response = await axios.put(`${API_URL}/listings/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Listing updated successfully');
      return { success: true, listing: response.data.listing };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update listing');
      toast.error(error.response?.data?.message || 'Failed to update listing');
      return { success: false, error: error.response?.data?.message || 'Failed to update listing' };
    } finally {
      setLoading(false);
    }
  };

  // Delete listing
  const deleteListing = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/listings/${id}`);
      
      // Update listings state
      setListings(listings.filter(listing => listing._id !== id));
      
      toast.success('Listing deleted successfully');
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete listing');
      toast.error(error.response?.data?.message || 'Failed to delete listing');
      return { success: false, error: error.response?.data?.message || 'Failed to delete listing' };
    } finally {
      setLoading(false);
    }
  };

  // Add review to listing
  const addReview = async (id, reviewData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/listings/${id}/reviews`, reviewData);
      
      // Update listing state with new review
      if (listing && listing._id === id) {
        setListing({
          ...listing,
          reviews: [...listing.reviews, response.data.review],
          averageRating: response.data.listing.averageRating
        });
      }
      
      toast.success('Review added successfully');
      return { success: true, review: response.data.review };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add review');
      toast.error(error.response?.data?.message || 'Failed to add review');
      return { success: false, error: error.response?.data?.message || 'Failed to add review' };
    } finally {
      setLoading(false);
    }
  };

  // Get listings by owner
  const getListingsByOwner = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings/user/owner`);
      setListings(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch owner listings');
      toast.error(error.response?.data?.message || 'Failed to fetch owner listings');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch owner listings' };
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite listing
  const toggleFavorite = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/listings/${id}/favorite`);
      
      // Update listing state if viewing the toggled listing
      if (listing && listing._id === id) {
        setListing({
          ...listing,
          isFavorite: response.data.isFavorite
        });
      }
      
      toast.success(response.data.message);
      return { success: true, isFavorite: response.data.isFavorite };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to toggle favorite');
      toast.error(error.response?.data?.message || 'Failed to toggle favorite');
      return { success: false, error: error.response?.data?.message || 'Failed to toggle favorite' };
    } finally {
      setLoading(false);
    }
  };

  // Get favorite listings
  const getFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings/user/favorites`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch favorites');
      toast.error(error.response?.data?.message || 'Failed to fetch favorites');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch favorites' };
    } finally {
      setLoading(false);
    }
  };

  // Search listings
  const searchListings = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings/search?query=${query}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to search listings');
      toast.error(error.response?.data?.message || 'Failed to search listings');
      return { success: false, error: error.response?.data?.message || 'Failed to search listings' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ListingContext.Provider
      value={{
        listings,
        listing,
        loading,
        error,
        pagination,
        getListings,
        getListingById,
        createListing,
        updateListing,
        deleteListing,
        addReview,
        getListingsByOwner,
        toggleFavorite,
        getFavorites,
        searchListings
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};

export const useListing = () => useContext(ListingContext); 