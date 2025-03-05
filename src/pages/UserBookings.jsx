import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/common/Spinner';

const UserBookings = () => {
  const { getAllUserBookings, loading, error, cancelBooking } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelingId, setCancelingId] = useState(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/profile/bookings' } });
      return;
    }
    
    const fetchBookings = async () => {
      try {
        const data = await getAllUserBookings();
        setBookings(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setFetchError('Failed to load bookings. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [getAllUserBookings, navigate, user]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  // Format currency for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setCancelingId(bookingId);
      try {
        await cancelBooking(bookingId);
        // Update the local state to reflect the canceled booking
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
          )
        );
      } catch (err) {
        console.error('Error canceling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      } finally {
        setCancelingId(null);
      }
    }
  };
  
  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const today = new Date();
    const checkInDate = new Date(booking.checkInDate);
    
    if (activeTab === 'upcoming') {
      // Upcoming bookings are those in the future with status pending or confirmed
      return (checkInDate >= today && ['pending', 'confirmed'].includes(booking.status));
    } else if (activeTab === 'past') {
      // Past bookings are those in the past
      return checkInDate < today;
    } else if (activeTab === 'cancelled') {
      // Cancelled bookings
      return booking.status === 'cancelled';
    }
    return true; // Default case: show all
  });
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" color="indigo" />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your PG bookings and view booking status
            </p>
          </div>
          
          {fetchError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{fetchError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`${
                  activeTab === 'upcoming'
                    ? 'border-[#FE6F61] text-[#FE6F61]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Upcoming Bookings
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`${
                  activeTab === 'past'
                    ? 'border-[#FE6F61] text-[#FE6F61]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Past Bookings
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`${
                  activeTab === 'cancelled'
                    ? 'border-[#FE6F61] text-[#FE6F61]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Cancelled Bookings
              </button>
            </nav>
          </div>
          
          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <img 
                src="/images/no-bookings.svg" 
                alt="No bookings" 
                className="w-48 h-48 mx-auto opacity-50"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-gray-500">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming bookings." 
                  : activeTab === 'past' 
                  ? "You don't have any past bookings." 
                  : "You don't have any cancelled bookings."}
              </p>
              {activeTab === 'upcoming' && (
                <div className="mt-6">
                  <Link
                    to="/search"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
                  >
                    Find PG Accommodations
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="lg:flex">
                    {/* Property Image */}
                    <div className="lg:w-1/4 h-48 lg:h-auto bg-gray-200 overflow-hidden">
                      <img 
                        src={booking.listing?.images?.[0] || '/images/placeholder.jpg'} 
                        alt={booking.listing?.title || 'Property'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Booking Details */}
                    <div className="p-6 lg:w-3/4">
                      <div className="lg:flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            <Link to={`/listings/${booking.listing?._id}`} className="hover:text-[#FE6F61]">
                              {booking.listing?.title || 'Property Title'}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.listing?.location?.name}, {booking.listing?.location?.city || 'Location'}
                          </p>
                          
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Check-in:</span> {formatDate(booking.checkInDate)}
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Duration:</span> {booking.duration} {booking.duration === 1 ? 'month' : 'months'}
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Amount:</span> {formatPrice(booking.amount)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 flex flex-col items-end">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Booked on {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#FE6F61]"
                        >
                          View Details
                        </Link>
                        
                        {['pending', 'confirmed'].includes(booking.status) && new Date(booking.checkInDate) > new Date() && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancelingId === booking._id}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelingId === booking._id ? (
                              <>
                                <Spinner size="tiny" color="white" />
                                <span className="ml-1">Cancelling...</span>
                              </>
                            ) : 'Cancel Booking'}
                          </button>
                        )}
                        
                        {booking.listing?.owner?.phone && ['confirmed', 'pending'].includes(booking.status) && (
                          <a
                            href={`tel:${booking.listing.owner.phone}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Contact Owner
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserBookings; 