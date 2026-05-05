import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavbarMain from '../Navbar';
import { Footer } from '../Footer';
import { backendURL } from '../../config/config';

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
      console.log('📊 Fetching analytics from:', backendURL);
      
      // Add withCredentials: true to send cookies with requests (needed for JWT auth)
      const axiosConfig = { withCredentials: true };
      
      const [stats, cities, prices, rooms, locations] = await Promise.all([
        axios.get(`${backendURL}/api/analytics/dashboard`, axiosConfig),
        axios.get(`${backendURL}/api/analytics/listings-by-city`, axiosConfig),
        axios.get(`${backendURL}/api/analytics/price-distribution`, axiosConfig),
        axios.get(`${backendURL}/api/analytics/room-sharing-stats`, axiosConfig),
        axios.get(`${backendURL}/api/analytics/popular-locations`, axiosConfig)
      ]);

      console.log('✅ Dashboard stats:', stats.data.data);
      console.log('✅ Cities data:', cities.data.data);
      console.log('✅ Price distribution:', prices.data.data);
      console.log('✅ Room stats:', rooms.data.data);
      console.log('✅ Locations:', locations.data.data);

      // Extract the actual data payload from nested structure
      setDashboardStats(stats.data.data);
      setListingsByCity(cities.data.data || []);
      setPriceDistribution(prices.data.data || []);
      setRoomStats(rooms.data.data);
      setPopularLocations(locations.data.data || []);
    } catch (error) {
      console.error('❌ Error fetching analytics:', error.message);
      console.error('❌ Status code:', error.response?.status);
      console.error('❌ Error response:', error.response?.data);
      if (error.response?.status === 401) {
        console.error('🔐 Authentication failed - Please log in again');
      }
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
            {['overview', 'cities', 'prices'].map(tab => (
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
                <StatCard label="Total Listings" value={dashboardStats?.totalListings} />
                <StatCard label="Total Rooms" value={dashboardStats?.totalRooms} />
                <StatCard label="Avg Price" value={Math.round(dashboardStats?.avgPrice || 0)} suffix=" ₹" />
                <StatCard label="Min Price" value={dashboardStats?.minPrice} suffix=" ₹" />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-8"
              >
                <h3 className="text-xl font-bold mb-6 text-gray-900">Listings by Type</h3>
                <div className="space-y-5">
                  {dashboardStats?.listingsByType?.map((item, idx) => (
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
                                (item.count / (dashboardStats?.listingsByType?.[0]?.count || 1)) * 100
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
                        <span className="text-2xl font-bold text-blue-600">{city.totalListings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Avg Price:</span>
                        <span className="font-bold text-gray-900">₹{Math.round(city.avgPrice)}</span>
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
                        {bucket._id === '50000+' ? '₹50,000+' : 
                         bucket._id === 0 ? '₹0 - ₹4,999' :
                         bucket._id === 5000 ? '₹5,000 - ₹9,999' :
                         bucket._id === 10000 ? '₹10,000 - ₹14,999' :
                         bucket._id === 15000 ? '₹15,000 - ₹19,999' :
                         bucket._id === 20000 ? '₹20,000 - ₹49,999' :
                         `₹${bucket._id?.toLocaleString() || 'Unknown'}`}
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

    </div>
  );
};

export default AdminDashboard;
