import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListing } from '../context/ListingContext';
import { useLocationContext } from '../context/LocationContext';
import MainLayout from '../layouts/MainLayout';
import ListingCard from '../components/listings/ListingCard';
import SearchBar from '../components/search/SearchBar';
import Spinner from '../components/common/Spinner';
import Map from '../components/common/Map';

const Search = () => {
  const [searchParams] = useSearchParams();
  const { searchListings, loading, error } = useListing();
  const { locations, fetchLocations } = useLocationContext();
  
  // Get query parameters from URL
  const initialQuery = searchParams.get('query') || '';
  const initialLocation = searchParams.get('location') || '';
  
  // State for listings and filters
  const [listings, setListings] = useState([]);
  const [totalListings, setTotalListings] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    amenities: [],
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Available amenities for filter
  const availableAmenities = [
    'Wi-Fi', 'AC', 'TV', 'Fridge', 'Washing Machine', 
    'Geyser', 'Power Backup', 'Parking', 'Food', 'Security'
  ];
  
  // Available types for filter
  const types = ['Single Room', 'Double Sharing', 'Triple Sharing', 'Four Sharing'];
  
  useEffect(() => {
    fetchLocations();
    performSearch();
  }, [initialQuery, initialLocation]);
  
  const performSearch = async () => {
    try {
      const result = await searchListings({
        query: initialQuery,
        location: initialLocation,
        type: filters.type,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        amenities: filters.amenities,
        sortBy: filters.sortBy,
        page
      });
      
      setListings(result.listings);
      setTotalListings(result.total);
    } catch (err) {
      console.error('Search error:', err);
    }
  };
  
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    setFilters({
      ...filters,
      amenities: updatedAmenities
    });
  };
  
  const applyFilters = () => {
    setPage(1);
    performSearch();
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };
  
  const resetFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      amenities: [],
      sortBy: 'newest'
    });
    setPage(1);
    performSearch();
  };

  // Create markers array from listings
  const markers = listings.map(listing => ({
    coordinates: {
      lat: listing.location.coordinates?.lat || 0,
      lng: listing.location.coordinates?.lng || 0
    },
    title: listing.title,
    address: `${listing.address}, ${listing.location.name}`
  }));

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Search Results</h1>
          <button
            onClick={() => setShowMap(!showMap)}
            className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        <div className="flex flex-wrap gap-6">
          {/* Filters column */}
          <div className="w-full lg:w-1/4">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar initialQuery={initialQuery} initialLocation={initialLocation} />
            </div>
            
            {/* Filters Section - Mobile Toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {/* Filters Section */}
            <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                
                {/* Type Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PG Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm"
                  >
                    <option value="">All Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm"
                    />
                  </div>
                </div>
                
                {/* Amenities Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          id={`amenity-${amenity}`}
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="h-4 w-4 text-[#FE6F61] focus:ring-[#FE6F61] border-gray-300 rounded"
                        />
                        <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-700">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sort By Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                
                {/* Filter Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 bg-[#FE6F61] hover:bg-[#e55a4d] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
                  >
                    Apply
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results column */}
          <div className="w-full lg:w-2/3">
            {/* Map view */}
            {showMap && (
              <div className="mb-6">
                <Map 
                  markers={markers}
                  height="500px"
                  className="rounded-lg border border-gray-300 mb-6"
                  zoom={12}
                />
              </div>
            )}

            {/* List view */}
            <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {loading ? 'Searching...' : `${totalListings} results found`}
                </h2>
                <p className="text-sm text-gray-500">
                  {initialLocation ? `in ${initialLocation}` : 'across all locations'}
                  {initialQuery ? ` for "${initialQuery}"` : ''}
                </p>
              </div>
            </div>
            
            {/* Listings */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="large" color="indigo" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Error loading listings. Please try again later.
                    </p>
                  </div>
                </div>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalListings > 0 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex items-center">
                  <button
                    onClick={() => {
                      if (page > 1) {
                        setPage(page - 1);
                        performSearch();
                        window.scrollTo(0, 0);
                      }
                    }}
                    disabled={page === 1}
                    className={`mr-2 px-3 py-1 rounded-md ${
                      page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-300`}
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-1 text-sm text-gray-700">
                    Page {page} of {Math.ceil(totalListings / 9)}
                  </span>
                  
                  <button
                    onClick={() => {
                      if (page < Math.ceil(totalListings / 9)) {
                        setPage(page + 1);
                        performSearch();
                        window.scrollTo(0, 0);
                      }
                    }}
                    disabled={page >= Math.ceil(totalListings / 9)}
                    className={`ml-2 px-3 py-1 rounded-md ${
                      page >= Math.ceil(totalListings / 9)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-300`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Search; 