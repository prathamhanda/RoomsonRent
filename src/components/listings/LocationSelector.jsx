import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { useLocationContext } from '../../context/LocationContext';
import Spinner from '../common/Spinner';

// This component handles map click events
const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
};

const LocationSelector = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { getCurrentLocation } = useLocationContext();

  useEffect(() => {
    // Initialize with provided coordinates if available
    if (value && value.coordinates) {
      setPosition({
        lat: value.coordinates.lat,
        lng: value.coordinates.lng
      });
    }
  }, [value]);

  const handlePositionChange = async (newPosition) => {
    setPosition(newPosition);
    
    // Reverse geocode the selected position
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'RoomsOnRent/1.0'
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to get address');
      
      const data = await response.json();
      
      // Extract address components
      const locationName = 
        data.address.suburb || 
        data.address.neighbourhood || 
        data.address.city_district || '';
      
      const city = data.address.city || data.address.town || '';
      const state = data.address.state || '';
      const fullAddress = data.display_name;
      
      setAddress(fullAddress);
      
      // Call the parent component's onChange
      onChange({
        name: locationName,
        city,
        state,
        address: fullAddress,
        coordinates: {
          lat: newPosition.lat,
          lng: newPosition.lng
        }
      });
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'RoomsOnRent/1.0'
          }
        }
      );
      
      if (!response.ok) throw new Error('Location search failed');
      
      const data = await response.json();
      
      if (data.length > 0) {
        const location = data[0];
        const newPosition = { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
        setPosition(newPosition);
        handlePositionChange(newPosition);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsSearching(true);
    
    try {
      const locationData = await getCurrentLocation();
      const newPosition = { 
        lat: locationData.coordinates.lat, 
        lng: locationData.coordinates.lng 
      };
      
      setPosition(newPosition);
      handlePositionChange(newPosition);
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <form onSubmit={handleSearchLocation} className="flex-1">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-500 text-white px-4 py-2 rounded-r-lg hover:bg-primary-600 flex items-center"
              disabled={isSearching}
            >
              {isSearching ? <Spinner size="sm" /> : <FaSearch />}
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-1"
          disabled={isSearching}
        >
          <FaMapMarkerAlt />
          <span className="hidden sm:inline">Current</span>
        </button>
      </div>

      <div className="h-96 border border-gray-300 rounded-lg overflow-hidden">
        <MapContainer
          center={position || [20.5937, 78.9629]} // Default to center of India if no position
          zoom={position ? 16 : 5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={(pos) => handlePositionChange(pos)} 
          />
        </MapContainer>
      </div>

      {address && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700">Selected Location:</h4>
          <p className="text-gray-600 text-sm mt-1">{address}</p>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Click on the map to select a specific location, or use the search box to find an address.
      </div>
    </div>
  );
};

export default LocationSelector; 