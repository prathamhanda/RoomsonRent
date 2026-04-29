import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../shared/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import backendURL from '@/config/config';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({ locations: [], listings: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    sharing: '',
    city: '',
    searchText: searchParams.get('q') || '',
    lat: '',
    lng: ''
  });

  const [maxDistance, setMaxDistance] = useState(5000);

  const propertyTypes = ['PG', 'Apartment', 'Hostel', 'Shared Flat'];
  const sharingOptions = ['Single', 'Double', 'Triple', '4 Sharing'];
  const cities = ['Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad'];

  // design-focused styles
  const cardClass = "bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all cursor-pointer border border-gray-100";
  const badgeClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-[#1a2b4c]";

  useEffect(() => {
    searchListings();
    
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, lat: name === 'searchText' ? '' : prev.lat, lng: name === 'searchText' ? '' : prev.lng }));
    
    if (name === 'searchText') {
      fetchSuggestions(value);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions({ locations: [], listings: [] });
      setShowSuggestions(false);
      return;
    }

    try {
      const [locationRes, listingRes] = await Promise.all([
        axios.get(`${backendURL}/api/locations/search?query=${query}`),
        axios.get(`${backendURL}/api/listings/search/advanced?searchText=${query}&limit=5`)
      ]);

      setSuggestions({
        locations: locationRes.data.data || [],
        listings: listingRes.data.data || []
      });
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = (item, type) => {
    let newFilters = { ...filters };
    if (type === 'location') {
      newFilters = {
        ...newFilters,
        searchText: item.name, 
        lat: item.geometry?.coordinates?.[1] || '', 
        lng: item.geometry?.coordinates?.[0] || '' 
      };
    } else {
      newFilters = { ...newFilters, searchText: item.title, lat: '', lng: '' };
    }
    
    setFilters(newFilters);
    setShowSuggestions(false);
    
    // search immediately with updated filters
    searchListings(newFilters);
  };

  const searchListings = async (overrideFilters = null) => {
    setLoading(true);
    try {
      const activeFilters = overrideFilters || filters;
      let endpoint = `${backendURL}/api/listings/search/advanced`;
      let params = new URLSearchParams();

      if (activeFilters.minPrice) params.append('minPrice', activeFilters.minPrice);
      if (activeFilters.maxPrice) params.append('maxPrice', activeFilters.maxPrice);
      if (activeFilters.propertyType) params.append('propertyType', activeFilters.propertyType);
      if (activeFilters.sharing) params.append('sharing', activeFilters.sharing);
      if (activeFilters.city) params.append('city', activeFilters.city);
      
      // If we have lat/lng (from a selected location suggestion), we don't strictly filter by searchText
      // because searchText is just acting as the display label for the location
      if (activeFilters.searchText && !activeFilters.lat) {
        params.append('searchText', activeFilters.searchText);
      }
      
      if (activeFilters.lat) params.append('lat', activeFilters.lat);
      if (activeFilters.lng) params.append('lng', activeFilters.lng);

      const response = await axios.get(`${endpoint}?${params.toString()}`);
      setListings(response.data.data || []);
    } catch (error) {
      console.error('Error searching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchListings();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[88px] relative">
      <Navbar textClass="text-[#1a2b4c] bg-white shadow-sm" />
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src="/images/78c3c990590b6c112e5b5cb34f1fbfac.webp" alt="Room Banner" className="object-cover w-full h-full absolute inset-0 z-0" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg"
          >
            Find Your Perfect Room
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 drop-shadow-md"
          >
            {listings.length > 0 ? `Found ${listings.length} amazing listings` : 'Search and discover your ideal accommodation'}
          </motion.p>
        </div>
      </div>

      <div className="flex-1 -mt-10 z-30">
        <div className="container mx-auto px-4 pb-12">
          {/* Filters Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 mb-12 border border-gray-100"
          >
            {/* Top Search Bar */}
            <div className="relative max-w-4xl mx-auto mb-8" ref={suggestionRef}>
              <input
                type="text"
                name="searchText"
                value={filters.searchText}
                onChange={handleFilterChange}
                onFocus={() => {
                  if (filters.searchText?.length >= 2) setShowSuggestions(true);
                }}
                placeholder="Search by area, location, or city..."
                className="w-full pl-6 pr-32 py-4 text-lg border-2 border-gray-100 rounded-[30px] shadow-inner focus:outline-none focus:border-[#FE6F61] transition-colors bg-gray-50/50"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-8 bg-[#FE6F61] hover:bg-[#ff7a6e] text-white rounded-[24px] font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? 'Searching...' : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Search
                  </>
                )}
              </button>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (suggestions.locations.length > 0 || suggestions.listings.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                  >
                    {suggestions.locations.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Locations / Colleges
                        </div>
                        {suggestions.locations.map(loc => (
                          <div 
                            key={loc._id}
                            onClick={() => handleSelectSuggestion(loc, 'location')}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                          >
                            <span className="text-[#FE6F61] bg-orange-50 p-2 rounded-full">
                              📍
                            </span>
                            <div>
                              <p className="font-semibold text-[#1a2b4c]">{loc.name}</p>
                              <p className="text-xs text-gray-500">{loc.city}, {loc.state}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {suggestions.listings.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Properties / PGs
                        </div>
                        {suggestions.listings.map(listing => (
                          <div 
                            key={listing._id}
                            onClick={() => handleSelectSuggestion(listing, 'listing')}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                          >
                            <span className="text-[#1a2b4c] bg-blue-50 p-2 rounded-full">
                              🏠
                            </span>
                            <div>
                              <p className="font-semibold text-[#1a2b4c]">{listing.title}</p>
                              <p className="text-xs text-gray-500">{listing.location?.city || listing.address}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <hr className="mb-8 border-gray-100" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-[#1a2b4c] uppercase tracking-wider mb-2">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="₹0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent outline-none bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4c] uppercase tracking-wider mb-2">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="₹50000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent outline-none bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4c] uppercase tracking-wider mb-2">Type</label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent outline-none bg-gray-50"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4c] uppercase tracking-wider mb-2">Sharing</label>
                <select
                  name="sharing"
                  value={filters.sharing}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent outline-none bg-gray-50"
                >
                  <option value="">Any</option>
                  {sharingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex">
                <button
                  onClick={() => {
                    const emptyFilters = { minPrice: '', maxPrice: '', propertyType: '', sharing: '', city: '', searchText: '', lat: '', lng: '' };
                    setFilters(emptyFilters);
                    setSuggestions({ locations: [], listings: [] });
                    setShowSuggestions(false);
                    searchListings(emptyFilters);
                  }}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          {listings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10"
            >
              {listings.map((listing, idx) => {
                // Stabilized pseudo-random price if missing (range: 10,000 - 19,000)
                const fallBackBase = listing._id ? String(listing._id).charCodeAt(listing._id.length - 1) : 0;
                const displayPrice = listing.price || (10000 + (fallBackBase % 10) * 1000);
                
                // Find deeply nested photo if top-level is absent
                const displayImage = (listing.images && listing.images.length > 0 && listing.images[0]) || 
                                     (listing.photos && listing.photos.length > 0 && listing.photos[0]) || 
                                     (listing.floors?.[0]?.rooms?.[0]?.photos?.[0]) || 
                                     '/images/78c3c990590b6c112e5b5cb34f1fbfac.webp';

                return (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden hover:shadow-[0_12px_40px_rgb(254,111,97,0.15)] transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#FE6F61]/30 flex flex-col group transform hover:-translate-y-1"
                  onClick={() => navigate(`/property/${listing._id}`)}
                >
                  <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={displayImage} 
                      alt={listing.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span>
                       <span className="text-xs font-bold text-[#1a2b4c]">Available</span>
                    </div>
                    {listing.featured && (
                      <div className="absolute top-4 left-4 bg-[#FE6F61] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md">Featured</div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#FE6F61]">
                          {listing.propertyType || 'PG / Hostel'}
                        </span>
                        <p className="text-xl font-bold text-[#1a2b4c] whitespace-nowrap">₹{displayPrice.toLocaleString()} <span className="text-xs text-gray-400 font-medium">/mo</span></p>
                      </div>

                      <h3 className="font-extrabold text-lg text-[#1a2b4c] mb-2 line-clamp-1 group-hover:text-[#FE6F61] transition-colors">{listing.title}</h3>
                      
                      <div className="flex items-start gap-2 mb-4 text-gray-500">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#FE6F61]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="text-sm font-medium line-clamp-2 leading-snug">
                          {listing.address ? `${listing.address}${listing.location?.city ? `, ${listing.location.city}` : ''}` : (listing.location?.city || 'Address Unavailable')}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap mb-4">
                        {listing.floors?.[0]?.rooms?.[0]?.sharingOptions && listing.floors[0].rooms[0].sharingOptions.length > 0 ? (
                          listing.floors[0].rooms[0].sharingOptions.slice(0, 3).map((share, i) => (
                            <span key={i} className="text-xs bg-gray-50 border border-gray-100 text-[#1a2b4c] px-3 py-1 rounded-lg font-semibold">{share}</span>
                          ))
                        ) : (
                          <span className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-3 py-1 rounded-lg font-semibold">Multiple Options</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                      <button className="text-sm font-bold text-[#FE6F61] flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Property <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                      <div className="text-xs text-gray-400 font-semibold bg-gray-50 px-2 py-1 rounded-md">
                        {listing.distance ? `${listing.distance.toFixed(1)} km away` : 'Explore Now'}
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FE6F61] mb-4"></div>
                <p className="text-gray-600">Searching listings...</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500 text-lg">Start searching to find your perfect accommodation</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
