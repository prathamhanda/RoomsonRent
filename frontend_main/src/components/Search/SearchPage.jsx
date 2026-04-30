import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../shared/Footer';
import { motion } from 'framer-motion';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const propertyTypes = ['PG', 'Apartment', 'Hostel', 'Shared Flat'];
  const sharingOptions = ['Single', 'Double', 'Triple', '4 Sharing'];
  const cities = ['Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad'];

  useEffect(() => {
    if (searchParams.get('q')) {
      searchListings();
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const searchListings = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/listings/search/advanced';
      let params = new URLSearchParams();

      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.sharing) params.append('sharing', filters.sharing);
      if (filters.city) params.append('city', filters.city);
      if (filters.searchText) params.append('searchText', filters.searchText);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            Find Your Perfect Room
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300"
          >
            {listings.length > 0 ? `Found ${listings.length} amazing listings` : 'Search and discover your ideal accommodation'}
          </motion.p>
        </div>
      </div>

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Filters Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Advanced Search Filters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (₹)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (₹)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="50000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sharing</label>
                <select
                  name="sharing"
                  value={filters.sharing}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">All Sharing</option>
                  {sharingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Text</label>
                <input
                  type="text"
                  name="searchText"
                  value={filters.searchText}
                  onChange={handleFilterChange}
                  placeholder="WiFi, AC, Kitchen..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <motion.button
                onClick={handleSearch}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Searching...' : 'Search'}
              </motion.button>
              
              <button
                onClick={() => setFilters({ minPrice: '', maxPrice: '', propertyType: '', sharing: '', city: '', searchText: '' })}
                className="px-8 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Results Section */}
          {listings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listings.map((listing, idx) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                  onClick={() => navigate(`/property/${listing._id}`)}
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"></div>
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-3">₹{listing.price?.toLocaleString()}<span className="text-sm text-gray-500">/month</span></p>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {listing.location?.city || 'Location'}
                    </div>

                    <div className="flex gap-2 mb-4">
                      {listing.floors?.[0]?.rooms?.[0]?.sharingOptions?.map((share, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {share}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm">
                        View Details
                      </button>
                      <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 font-semibold text-sm">
                        Site Visit
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
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
