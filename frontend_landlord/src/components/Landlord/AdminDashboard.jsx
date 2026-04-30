import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavbarMain from '../Navbar';
import { Footer } from '../Footer';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [listingsByCity, setListingsByCity] = useState([]);
  const [priceDistribution, setPriceDistribution] = useState([]);
  const [roomStats, setRoomStats] = useState(null);
  const [popularLocations, setPopularLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [stats, cities, prices, rooms, locations] = await Promise.all([
        axios.get('/api/analytics/dashboard'),
        axios.get('/api/analytics/listings-by-city'),
        axios.get('/api/analytics/price-distribution'),
        axios.get('/api/analytics/room-sharing-stats'),
        axios.get('/api/analytics/popular-locations')
      ]);

      setDashboardStats(stats.data);
      setListingsByCity(cities.data.data || []);
      setPriceDistribution(prices.data.data || []);
      setRoomStats(rooms.data);
      setPopularLocations(locations.data.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, suffix = '', icon: Icon }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value?.toLocaleString()}{suffix}
          </p>
        </div>
        {Icon && (
          <div className="bg-blue-100 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavbarMain />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarMain />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-300">Monitor your property performance and market insights</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
            {['overview', 'cities', 'prices', 'rooms', 'locations'].map(tab => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ y: -2 }}
                className={`px-6 py-3 font-semibold capitalize whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Property Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Listings" value={dashboardStats?.data?.totalListings} />
                <StatCard label="Total Rooms" value={dashboardStats?.data?.totalRooms} />
                <StatCard label="Avg Price" value={Math.round(dashboardStats?.data?.avgPrice || 0)} suffix=" ₹" />
                <StatCard label="Min Price" value={dashboardStats?.data?.minPrice} suffix=" ₹" />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-8"
              >
                <h3 className="text-xl font-bold mb-6 text-gray-900">Listings by Type</h3>
                <div className="space-y-5">
                  {dashboardStats?.data?.listingsByType?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="text-gray-700 font-medium">{item._id || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                (item.count / (dashboardStats?.data?.listingsByType?.[0]?.count || 1)) * 100
                              }%`
                            }}
                            transition={{ duration: 1 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                          ></motion.div>
                        </div>
                        <span className="font-bold text-blue-600 w-12 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Cities Tab */}
          {activeTab === 'cities' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Listings by City</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listingsByCity.map((city, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-5">{city._id}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Listings:</span>
                        <span className="text-2xl font-bold text-blue-600">{city.count}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Avg Price:</span>
                        <span className="font-bold text-gray-900">₹{Math.round(city.avgPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Rooms:</span>
                        <span className="font-bold text-gray-900">{city.totalRooms}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Prices Tab */}
          {activeTab === 'prices' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Price Distribution</h2>
              <div className="space-y-4">
                {priceDistribution.map((bucket, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-md"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        ₹{bucket._id?.min?.toLocaleString()} - ₹{bucket._id?.max?.toLocaleString()}
                      </h3>
                      <span className="text-2xl font-bold text-blue-600">{bucket.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (bucket.count / (priceDistribution[0]?.count || 1)) * 100
                          }%`
                        }}
                        transition={{ duration: 1 }}
                        className="bg-gradient-to-r from-green-400 to-green-600 h-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Room Statistics</h2>
              {roomStats?.data?.sharingDistribution && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {Object.entries(roomStats.data.sharingDistribution).map(([sharing, count]) => (
                    <motion.div 
                      key={sharing}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
                    >
                      <p className="text-gray-600 text-sm font-semibold mb-2">{sharing} Sharing</p>
                      <p className="text-3xl font-bold text-blue-600">{count}</p>
                      <p className="text-gray-500 text-sm mt-2">Rooms</p>
                    </motion.div>
                  ))}
                </div>
              )}
              {roomStats?.data?.tenantsPerRoom && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-2xl shadow-md"
                >
                  <h3 className="text-xl font-bold mb-6 text-gray-900">Occupancy Metrics</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Avg Tenants per Room</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {roomStats.data.tenantsPerRoom.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Locations</h2>
              <div className="space-y-3 max-w-2xl">
                {popularLocations.map((location, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <span className="text-lg font-medium text-gray-900">{location._id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (location.count / (popularLocations[0]?.count || 1)) * 100
                            }%`
                          }}
                          transition={{ duration: 1 }}
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-full"
                        ></motion.div>
                      </div>
                      <span className="font-bold text-purple-600 w-10 text-right">{location.count}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="container mx-auto px-4 pb-8">
        <motion.button
          onClick={fetchAnalytics}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md"
        >
          Refresh Data
        </motion.button>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
