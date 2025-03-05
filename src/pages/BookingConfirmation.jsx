import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/common/Spinner';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { getBookingById, loading } = useBooking();
  
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details. Please check your bookings in your profile.');
      }
    };
    
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, getBookingById]);
  
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
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" color="indigo" />
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
          <div className="mt-4 text-center">
            <Link
              to="/profile/bookings"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!booking) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Booking not found</h2>
            <p className="mt-2 text-gray-500">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
            <div className="mt-4">
              <Link
                to="/profile/bookings"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
              >
                View My Bookings
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-500 p-6 text-center">
              <div className="flex justify-center">
                <div className="bg-white rounded-full p-2">
                  <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-white">Booking Confirmed!</h1>
              <p className="mt-2 text-white opacity-90">Your booking has been successfully confirmed.</p>
            </div>
            
            {/* Booking ID & Date */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium text-gray-900">{booking._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="flex items-start">
                <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={booking.listing.images[0] || '/images/placeholder.jpg'} 
                    alt={booking.listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Link to={`/listings/${booking.listing._id}`} className="hover:text-[#FE6F61]">
                      {booking.listing.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">{booking.listing.location.name}, {booking.listing.location.city}</p>
                  <p className="text-sm text-gray-600 mt-1">{booking.listing.type} | {booking.listing.occupancy}</p>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Property Owner</p>
                    <p className="text-sm text-gray-900">{booking.listing.owner.name} | {booking.listing.owner.phone}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Details */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Check-in Date</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.checkInDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{booking.duration} {booking.duration === 1 ? 'month' : 'months'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupants</p>
                  <p className="font-medium text-gray-900">{booking.occupants} {booking.occupants === 1 ? 'person' : 'people'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${
                    booking.status === 'confirmed' ? 'text-green-600' :
                    booking.status === 'pending' ? 'text-yellow-600' : 
                    booking.status === 'cancelled' ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </p>
                </div>
              </div>
              
              {booking.message && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Your Message to Owner</p>
                  <p className="mt-1 text-gray-600 border-l-4 border-gray-200 pl-3 italic">{booking.message}</p>
                </div>
              )}
            </div>
            
            {/* Payment Details */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="text-gray-900">{formatPrice(booking.listing.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-900">{booking.duration} {booking.duration === 1 ? 'month' : 'months'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="text-gray-900">{formatPrice(booking.listing.securityDeposit)}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-semibold text-[#FE6F61]">{formatPrice(booking.amount)}</span>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
              <div className="bg-blue-50 p-4 rounded-md">
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                  <li>The property owner will contact you soon to finalize your booking.</li>
                  <li>Be ready with your security deposit and first month's rent for move-in.</li>
                  <li>You can view all your booking details in your <Link to="/profile/bookings" className="text-[#FE6F61] hover:underline">profile section</Link>.</li>
                  <li>For any queries, please contact the owner directly or reach out to our support team.</li>
                </ul>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-4">
                <Link
                  to="/profile/bookings"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
                >
                  View My Bookings
                </Link>
                <Link
                  to="/"
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingConfirmation;