import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@heroui/card';
import { Phone, Mail, Calendar, Home, User, Shield, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import backendURL from '@/config/config';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.4 }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // Don't fetch if authUser is not ready yet
    if (!authUser?.id) {
      console.log('Auth user not ready yet, waiting...');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        console.log('Fetching user details for ID:', authUser.id);
        console.log('Backend URL:', backendURL);
        const response = await axios.get(`${backendURL}/api/users/${authUser.id}`, {
          withCredentials: true
        });
        console.log('User API Response:', response.data);
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch user details');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.response?.data?.message || err.message || 'Error fetching user details');
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.id) {
      fetchUserDetails();
    }
  }, [authUser, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#fe6f61]"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-red-500">
              <h2 className="text-2xl font-bold mb-2">Error</h2>
              <p>{error || 'User profile not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Back Button */}
      <div className="fixed top-24 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative h-[300px] md:h-[400px] bg-gradient-to-r from-[#fe6f61] to-[#fe8f61]"
        variants={cardVariants}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-white overflow-hidden mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            {userData.avatar ? (
              <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <User size={40} className="text-gray-500" />
              </div>
            )}
          </motion.div>
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {userData.name || 'N/A'}
          </motion.h1>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Shield size={16} />
            <span className="capitalize">{userData.role || 'User'}</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Section */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Information */}
          <motion.div variants={cardVariants} className="md:col-span-1">
            <Card className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fe6f61]/10 flex items-center justify-center">
                    <Phone className="text-[#fe6f61]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userData.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fe6f61]/10 flex items-center justify-center">
                    <Mail className="text-[#fe6f61]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData.email || 'N/A'}</p>
                  </div>
                </div>
                {userData.createdAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fe6f61]/10 flex items-center justify-center">
                      <Calendar className="text-[#fe6f61]" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-medium">
                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Current Accommodations */}
          <motion.div variants={cardVariants} className="md:col-span-2">
            <Card className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Current Accommodations</h2>
              <div className="space-y-6">
                {userData.currentRooms?.filter(room => room.active)?.map((room) => (
                  <motion.div
                    key={`${room.listingId}-${room.roomId}`}
                    className="border border-gray-200 rounded-lg p-4"
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{room.listingName || 'Unnamed Property'}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Home size={16} />
                            <span>
                              Floor {room.floorNumber || '?'}, Room {room.roomNumber || '?'}
                            </span>
                          </div>
                          {room.assignedAt && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} />
                              <span>
                                Assigned: {new Date(room.assignedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {room.sharingType && (
                            <div className="inline-block px-3 py-1 bg-[#fe6f61]/10 text-[#fe6f61] rounded-full text-sm">
                              {room.sharingType}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {(!userData.currentRooms || userData.currentRooms.filter(room => room.active).length === 0) && (
                  <p className="text-gray-500 text-center py-4">No active accommodations</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Verification Status */}
          {userData.verified && (
            <motion.div variants={cardVariants} className="md:col-span-3">
              <Card className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Verification Status</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Verified Account
                  </span>
                </div>
                <p className="text-gray-600">
                  Welcome to your profile! Here you can manage your account and view your activity.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default UserProfile; 