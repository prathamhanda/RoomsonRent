import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useListing } from '../../context/ListingContext';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';
import axios from 'axios';

const OwnerDashboard = () => {
  const { getOwnerListings } = useListing();
  const { getOwnerBookings } = useBooking();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalEarnings: 0,
    monthlyEarnings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch owner listings
        const listings = await getOwnerListings();
        const activeListings = listings.filter(listing => listing.isActive);
        
        // Fetch owner bookings
        const bookings = await getOwnerBookings();
        const pendingBookings = bookings.filter(booking => booking.status === 'pending');
        const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
        const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');
        
        // Calculate total earnings from confirmed bookings
        const totalEarnings = confirmedBookings.reduce((sum, booking) => sum + booking.amount, 0);
        
        // Calculate monthly earnings (bookings from current month)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyEarnings = confirmedBookings
          .filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear;
          })
          .reduce((sum, booking) => sum + booking.amount, 0);
        
        // Get recent bookings (last 5)
        const recent = [...bookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        // Update state
        setStats({
          totalListings: listings.length,
          activeListings: activeListings.length,
          totalBookings: bookings.length,
          pendingBookings: pendingBookings.length,
          confirmedBookings: confirmedBookings.length,
          cancelledBookings: cancelledBookings.length,
          totalEarnings,
          monthlyEarnings
        });
        setRecentBookings(recent);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [getOwnerListings, getOwnerBookings]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get('/api/owner/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  // Format currency for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="large" color="indigo" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Total Listings</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Active Bookings</h2>
          <p className="text-3xl font-bold text-green-600">{stats.activeListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Total Earnings</h2>
          <p className="text-3xl font-bold text-purple-600">
            ${stats.totalEarnings.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard; 