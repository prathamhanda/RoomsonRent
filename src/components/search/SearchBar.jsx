import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaLocationArrow } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationContext } from '../../context/LocationContext';
import Spinner from '../common/Spinner';
import { useNotification } from '../../context/NotificationContext';

const SearchBar = ({ variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { 
    suggestions, 
    getSuggestions, 
    suggestionsLoading, 
    suggestionsError,
    getCurrentLocation
  } = useLocationContext();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { showError, showInfo } = useNotification();

  const isHomepage = variant === 'homepage';

  useEffect(() => {
    if (query.trim().length > 2) {
      getSuggestions(query);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query, getSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) && 
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (locationName) => {
    if (locationName || query) {
      const searchTerm = locationName || query;
      navigate(`/search?location=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleGetCurrentLocation = async () => {
    setLoadingLocation(true);
    showInfo('Fetching your current location...');

    try {
      const locationData = await getCurrentLocation();
      
      if (locationData.locationName) {
        const displayLocation = locationData.cityName 
          ? `${locationData.locationName}, ${locationData.cityName}` 
          : locationData.locationName;
          
        setQuery(displayLocation);
        handleSearch(displayLocation);
      } else {
        showError('Could not determine your location name');
      }
    } catch (error) {
      console.error('Location error:', error);
      showError('Unable to get your location. Please check browser permissions.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const searchBarClasses = isHomepage
    ? 'max-w-3xl w-full px-4 py-6 bg-white rounded-lg shadow-lg'
    : 'w-full md:w-auto';

  return (
    <div className={searchBarClasses}>
      {isHomepage && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Find your perfect PG accommodation
        </h2>
      )}
      
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative flex-grow">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter location (e.g., Koramangala, HSR Layout)"
              className={`w-full pl-4 pr-10 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                isHomepage ? 'text-lg' : 'text-base'
              }`}
              onFocus={() => {
                if (query.trim().length > 2) {
                  setIsOpen(true);
                }
              }}
            />
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 focus:outline-none disabled:opacity-50 ${
                loadingLocation ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              disabled={loadingLocation}
              title="Use current location"
            >
              {loadingLocation ? (
                <Spinner size="sm" className="text-primary-500" />
              ) : (
                <FaLocationArrow className="h-4 w-4" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className={`bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-r-lg transition-colors duration-300 flex items-center justify-center ${
              isHomepage ? 'text-lg' : 'text-base'
            }`}
          >
            <FaSearch className={isHomepage ? 'h-5 w-5' : 'h-4 w-4'} />
            <span className="ml-2 hidden md:inline">Search</span>
          </button>
        </form>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto"
            >
              {suggestionsLoading ? (
                <div className="p-4 flex justify-center">
                  <Spinner size="md" />
                </div>
              ) : suggestionsError ? (
                <div className="p-4 text-red-500 text-center">{suggestionsError}</div>
              ) : suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion._id}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        const displayLocation = suggestion.city 
                          ? `${suggestion.name}, ${suggestion.city}` 
                          : suggestion.name;
                        setQuery(displayLocation);
                        handleSearch(displayLocation);
                      }}
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-sm text-gray-500">
                        {suggestion.city}{suggestion.state ? `, ${suggestion.state}` : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : query.trim().length > 2 ? (
                <div className="p-4 text-center text-gray-500">No locations found</div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar; 