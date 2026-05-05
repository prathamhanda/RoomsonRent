import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../shared/Footer';
import { motion } from 'framer-motion';
import backendURL from '@/config/config';

// Helper function to extract all photos from a listing's floors and rooms
const getListingPhotos = (listing) => {
  const photos = [];
  if (listing.floors && Array.isArray(listing.floors)) {
    listing.floors.forEach(floor => {
      if (floor.rooms && Array.isArray(floor.rooms)) {
        floor.rooms.forEach(room => {
          if (room.photos && Array.isArray(room.photos)) {
            photos.push(...room.photos);
          }
        });
      }
    });
  }
  return photos;
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    sharing: '',
    city: '',
    searchText: searchParams.get('q') || ''
  });
  const [nearbyMode, setNearbyMode] = useState(false);
  const [maxDistance, setMaxDistance] = useState(5000);

  const propertyTypes = ['PG', 'Boys PG', 'Girls PG', 'Flat', 'Other'];
  const sharingOptions = ['Single', 'Double', 'Triple', '4 Sharing'];
  const cities = ['New Delhi', 'Ludhiana', 'Mumbai', 'Noida', 'Hyderabad', 'Ellenabad'];

  useEffect(() => {
    // Always search listings when component mounts so it shows all listings by default
    searchListings();
  }, []);

  const fetchSearchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    
    try {
      // Fetch both PG names and locations based on search query
      const [listingsRes, locationsRes] = await Promise.all([
        axios.get(`${backendURL}/api/listings?query=${query}&limit=5`),
        axios.get(`${backendURL}/api/locations/search?query=${query}`)
      ]);

      // Combine both results
      const combinedSuggestions = [];
      
      // Add PG suggestions
      if (listingsRes.data.data) {
        listingsRes.data.data.forEach(listing => {
          combinedSuggestions.push({
            id: listing._id,
            label: listing.title,
            type: 'pg',
            city: listing.location?.city,
            data: listing
          });
        });
      }

      // Add location suggestions
      if (locationsRes.data.data) {
        locationsRes.data.data.forEach(location => {
          // Only add if we don't already have this location name
          if (!combinedSuggestions.find(s => s.type === 'location' && s.label === location.name)) {
            combinedSuggestions.push({
              id: location._id,
              label: location.name,
              type: 'location',
              city: location.city,
              data: location
            });
          }
        });
      }

      setSearchSuggestions(combinedSuggestions.slice(0, 8));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Fetch suggestions if it's the search text field
    if (name === 'searchText') {
      fetchSearchSuggestions(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'pg') {
      setFilters(prev => ({ ...prev, searchText: suggestion.label }));
    } else if (suggestion.type === 'location') {
      setFilters(prev => ({ ...prev, city: suggestion.data.city, searchText: suggestion.label }));
    }
    setShowSuggestions(false);
  };

  const searchListings = async () => {
    setLoading(true);
    try {
      // Build query parameters
      let params = new URLSearchParams();

      // Add city filter if selected
      if (filters.city) {
        params.append('city', filters.city);
      }

      // Add price range filters
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice);
      }

      // Add property type filter
      if (filters.propertyType) {
        params.append('propertyType', filters.propertyType);
      }

      // Add sharing option filter
      if (filters.sharing) {
        params.append('sharing', filters.sharing);
      }

      // Add search text filter
      if (filters.searchText) {
        params.append('searchText', filters.searchText);
      }

      // Add limit and pagination
      params.append('limit', '100');
      params.append('page', '1');

      // Call the advanced search endpoint
      const url = `${backendURL}/api/listings/search/advanced?${params.toString()}`;
      console.log('Search URL:', url);
      
      const response = await axios.get(url);
      
      console.log('API Response:', response.data);
      
      // If no filters applied, fetch all listings
      if (params.toString() === 'limit=100&page=1') {
        const allResponse = await axios.get(`${backendURL}/api/listings?limit=100`);
        setListings(allResponse.data.data || []);
      } else {
        setListings(response.data.data || []);
      }
    } catch (error) {
      console.error('Error searching listings:', error);
      
      // Fallback: fetch all listings if advanced search fails
      try {
        const response = await axios.get(`${backendURL}/api/listings?limit=100`);
        setListings(response.data.data || []);
      } catch (fallbackError) {
        console.error('Fallback search error:', fallbackError);
        setListings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchListings();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="relative bg-white shadow-sm">
        <Navbar textColor="text-black" bgColor="bg-white" />
      </div>
      
      {/* Hero Section */}
      <div className="relative w-full h-48 md:h-64 flex items-center justify-center -mt-[height_of_navbar]">
         <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ 
              backgroundImage: 'url("/api/placeholder/1600/900")', 
              filter: 'brightness(0.4)',
              backgroundColor: '#20365F' 
            }}
          />
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-3 text-white"
            style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
          >
            Find Your Perfect Room
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-100 text-lg md:text-xl font-light"
          >
            Search and discover your ideal accommodation
          </motion.p>
        </div>
      </div>

      <div className="flex-1 -mt-8 relative z-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Filters Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] shadow-lg p-6 md:p-8 mb-10 border border-gray-100"
          >
            {/* Main Search Bar with Suggestions */}
            <div className="mb-8 relative">
              <input
                type="text"
                name="searchText"
                value={filters.searchText}
                onChange={handleFilterChange}
                onFocus={() => filters.searchText && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search area, PG or location"
                className="w-full pl-6 pr-20 py-4 text-lg text-black border border-gray-200 rounded-full focus:ring-2 focus:ring-[#FF7F61] focus:border-transparent outline-none bg-white shadow-inner placeholder:text-gray-400"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-[#FF7F61] text-white rounded-full hover:bg-[#ff6945] flex items-center justify-center transition-colors shadow-md disabled:opacity-70"
              >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                )}
              </button>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                  {searchSuggestions.map((suggestion, idx) => (
                    <motion.button
                      key={`${suggestion.type}-${idx}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-6 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between group transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#20365F]">{suggestion.label}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {suggestion.type === 'pg' ? 'PG' : 'Location'} • {suggestion.city}
                        </p>
                      </div>
                      {suggestion.type === 'location' ? (
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#FF7F61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#FF7F61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        </svg>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Sub Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
               <div>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 text-sm text-black bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7F61] focus:border-transparent outline-none appearance-none font-medium"
                    style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 text-sm text-black bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7F61] focus:border-transparent outline-none appearance-none font-medium"
                    style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                  >
                    <option value="">Property Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    name="sharing"
                    value={filters.sharing}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 text-sm text-black bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7F61] focus:border-transparent outline-none appearance-none font-medium"
                    style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                  >
                    <option value="">Sharing Style</option>
                    {sharingOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

              <div>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price (₹)"
                  className="w-full px-4 py-3 text-sm text-black bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7F61] focus:border-transparent outline-none font-medium placeholder:text-gray-400"
                />
              </div>

              <div className="flex gap-2">
                 <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price (₹)"
                  className="w-full flex-1 px-4 py-3 text-sm text-black bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7F61] focus:border-transparent outline-none font-medium placeholder:text-gray-400"
                />
                
                <button
                  onClick={() => {
                     const clearedFilters = { minPrice: '', maxPrice: '', propertyType: '', sharing: '', city: '', searchText: '' };
                     setFilters(clearedFilters);
                     setSearchSuggestions([]);
                     setShowSuggestions(false);
                     // Trigger search with cleared filters
                     setTimeout(() => searchListings(), 0);
                  }}
                  className="px-4 py-3 bg-gray-100 text-black rounded-xl hover:bg-gray-200 font-bold text-sm transition-colors whitespace-nowrap"
                  title="Clear Filters"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          {listings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {listings.map((listing, idx) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full"
                  onClick={() => navigate(`/property/${listing._id}`)}
                >
                  <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                    {(() => {
                      const photos = getListingPhotos(listing);
                      return photos.length > 0 ? (
                        <img 
                          src={photos[0]} 
                          alt={listing.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>No images available</span>
                        </div>
                      );
                    })()}
                    <div className="absolute top-4 right-4 bg-[#FF7F61] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
                      Featured
                    </div>
                    {/* Dark gradient overlay at bottom for text contrast if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-xl text-[#20365F] line-clamp-2 leading-tight">{listing.title}</h3>
                       <div className="text-right ml-4">
                           <p className="text-2xl font-black text-[#FF7F61]">₹{listing.price?.toLocaleString() || 'N/A'}</p>
                           <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">/ Month</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-4 font-medium">
                      <svg className="w-5 h-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.location?.city || listing.city || 'Location Details'}
                    </div>

                    {/* Amenities & Badges */}
                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {listing.floors?.[0]?.rooms?.[0]?.sharingOptions?.map((share, i) => (
                        <span key={`share-${i}`} className="bg-gray-100 text-[#20365F] text-xs px-3 py-1.5 rounded-full font-semibold">
                          {share}
                        </span>
                      ))}
                      <span className="bg-gray-100 text-[#20365F] text-xs px-3 py-1.5 rounded-full font-semibold flex items-center">
                         <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                         WiFi
                      </span>
                       <span className="bg-gray-100 text-[#20365F] text-xs px-3 py-1.5 rounded-full font-semibold flex items-center">
                         <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                         AC Available
                      </span>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button 
                         className="flex-1 bg-[#FF7F61] text-white py-3 rounded-xl hover:bg-[#ff6945] font-bold text-sm transition-colors shadow-sm"
                         onClick={(e) => { e.stopPropagation(); navigate(`/property/${listing._id}`); }}
                      >
                        View Details
                      </button>
                      <button 
                        className="flex-1 bg-white border-2 border-[#20365F] text-[#20365F] py-3 rounded-xl hover:bg-gray-50 font-bold text-sm transition-colors"
                         onClick={(e) => { e.stopPropagation(); navigate(`/property/${listing._id}/visit`); }}
                      >
                        Visit
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F61] mb-4"></div>
                <p className="text-gray-500 font-medium">Searching properties...</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <svg className="w-24 h-24 mx-auto text-gray-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="text-2xl font-bold text-[#20365F] mb-2">No Properties Found</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">We couldn't find any rooms matching your current filters. Try relaxing your search criteria.</p>
               <button 
                  onClick={() => {
                     const clearedFilters = { minPrice: '', maxPrice: '', propertyType: '', sharing: '', city: '', searchText: '' };
                     setFilters(clearedFilters);
                     setSearchSuggestions([]);
                     setShowSuggestions(false);
                     setTimeout(() => searchListings(), 0);
                  }}
                  className="mt-6 px-8 py-3 bg-[#FF7F61] text-white rounded-xl hover:bg-[#ff6945] font-bold transition-colors"
                >
                  View All Listings
                </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
