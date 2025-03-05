import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config/constants';

const LocationContext = createContext();

export const useLocationContext = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [areas, setAreas] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);

  // Get all locations
  const getLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/locations`);
      setLocations(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch locations');
      toast.error(error.response?.data?.message || 'Failed to fetch locations');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch locations' };
    } finally {
      setLoading(false);
    }
  };

  // Get areas by location ID
  const getAreasByLocation = async (locationId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/locations/${locationId}/areas`);
      setAreas(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch areas');
      toast.error(error.response?.data?.message || 'Failed to fetch areas');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch areas' };
    } finally {
      setLoading(false);
    }
  };

  // Get colleges by location ID
  const getCollegesByLocation = async (locationId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/locations/${locationId}/colleges`);
      setColleges(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch colleges');
      toast.error(error.response?.data?.message || 'Failed to fetch colleges');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch colleges' };
    } finally {
      setLoading(false);
    }
  };

  // Get colleges by area ID
  const getCollegesByArea = async (areaId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/locations/areas/${areaId}/colleges`);
      setColleges(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch colleges by area');
      toast.error(error.response?.data?.message || 'Failed to fetch colleges by area');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch colleges by area' };
    } finally {
      setLoading(false);
    }
  };

  // Search locations, areas, or colleges
  const searchLocations = async (query, type = 'all') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/locations/search?query=${query}&type=${type}`);
      
      if (type === 'locations' || type === 'all') {
        setLocations(response.data.locations || []);
      }
      
      if (type === 'areas' || type === 'all') {
        setAreas(response.data.areas || []);
      }
      
      if (type === 'colleges' || type === 'all') {
        setColleges(response.data.colleges || []);
      }
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to search locations');
      toast.error(error.response?.data?.message || 'Failed to search locations');
      return { success: false, error: error.response?.data?.message || 'Failed to search locations' };
    } finally {
      setLoading(false);
    }
  };

  // Get nearby PGs by college ID
  const getNearbyPGsByCollege = async (collegeId, radius = 5) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings/nearby/college/${collegeId}?radius=${radius}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch nearby PGs');
      toast.error(error.response?.data?.message || 'Failed to fetch nearby PGs');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch nearby PGs' };
    } finally {
      setLoading(false);
    }
  };

  // Get nearby PGs by area ID
  const getNearbyPGsByArea = async (areaId, radius = 5) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings/nearby/area/${areaId}?radius=${radius}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch nearby PGs');
      toast.error(error.response?.data?.message || 'Failed to fetch nearby PGs');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch nearby PGs' };
    } finally {
      setLoading(false);
    }
  };

  // Get nearby PGs by coordinates
  const getNearbyPGsByCoordinates = async (latitude, longitude, radius = 5) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/listings/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch nearby PGs');
      toast.error(error.response?.data?.message || 'Failed to fetch nearby PGs');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch nearby PGs' };
    } finally {
      setLoading(false);
    }
  };

  // Get geocoding data from address
  const getGeocodingData = async (address) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/locations/geocode?address=${encodeURIComponent(address)}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get geocoding data');
      toast.error(error.response?.data?.message || 'Failed to get geocoding data');
      return { success: false, error: error.response?.data?.message || 'Failed to get geocoding data' };
    } finally {
      setLoading(false);
    }
  };

  // Get reverse geocoding data from coordinates
  const getReverseGeocodingData = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/locations/reverse-geocode?lat=${latitude}&lng=${longitude}`
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get reverse geocoding data');
      toast.error(error.response?.data?.message || 'Failed to get reverse geocoding data');
      return { success: false, error: error.response?.data?.message || 'Failed to get reverse geocoding data' };
    } finally {
      setLoading(false);
    }
  };

  // Fetch all locations
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/locations`);
      const data = await response.json();
      
      if (data.success) {
        setLocations(data.locations);
      } else {
        setError(data.message || 'Failed to fetch locations');
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to fetch locations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get location by ID
  const getLocationById = useCallback((locationId) => {
    return locations.find(location => location._id === locationId) || null;
  }, [locations]);

  // Get location suggestions using Nominatim
  const getSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    setSuggestionsError(null);

    try {
      // Using OSM Nominatim Search API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=10`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'RoomsOnRent/1.0' // Required by Nominatim usage policy
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }

      const data = await response.json();

      // Transform the data to match our expected format
      const formattedSuggestions = data.map(item => ({
        _id: item.place_id,
        name: item.display_name.split(',')[0],
        city: item.display_name.split(',')[1]?.trim() || '',
        state: item.display_name.split(',')[2]?.trim() || '',
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestionsError('Failed to load location suggestions');
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  // Get geolocation using browser API and reverse geocoding with Nominatim
  const getCurrentLocation = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Using OSM Nominatim Reverse API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
              {
                headers: {
                  'Accept-Language': 'en',
                  'User-Agent': 'RoomsOnRent/1.0'
                }
              }
            );
            
            if (!response.ok) {
              throw new Error('Failed to fetch location data');
            }
            
            const data = await response.json();
            
            // Extract location name from address components
            let locationName = '';
            let cityName = '';
            let stateName = '';
            
            if (data.address) {
              // Try to get the most relevant locality name
              locationName = 
                data.address.suburb || 
                data.address.neighbourhood || 
                data.address.city_district || 
                data.address.city || 
                data.address.town || 
                data.address.village || '';
                
              cityName = data.address.city || data.address.town || '';
              stateName = data.address.state || '';
            }
            
            resolve({
              locationName,
              cityName,
              stateName,
              fullAddress: data.display_name,
              coordinates: {
                lat: latitude,
                lng: longitude
              }
            });
          } catch (error) {
            console.error('Error in reverse geocoding:', error);
            reject(error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        }
      );
    });
  }, []);

  // Clear suggestions
  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        areas,
        colleges,
        loading,
        error,
        suggestions,
        suggestionsLoading,
        suggestionsError,
        getLocations,
        getAreasByLocation,
        getCollegesByLocation,
        getCollegesByArea,
        searchLocations,
        getNearbyPGsByCollege,
        getNearbyPGsByArea,
        getNearbyPGsByCoordinates,
        getGeocodingData,
        getReverseGeocodingData,
        fetchLocations,
        getLocationById,
        getSuggestions,
        getCurrentLocation,
        clearSuggestions
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext); 