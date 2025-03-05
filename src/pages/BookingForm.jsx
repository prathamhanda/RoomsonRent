import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListing } from '../context/ListingContext';
import { useBooking } from '../context/BookingContext';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/common/Spinner';

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getListingById } = useListing();
  const { createBooking, loading, error } = useBooking();
  
  const listingId = searchParams.get('listingId');
  
  const [listing, setListing] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    duration: 1, // in months
    occupants: 1,
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/bookings/new?listingId=${listingId}` } });
      return;
    }
    
    if (!listingId) {
      navigate('/search');
      return;
    }
    
    const fetchListing = async () => {
      try {
        const data = await getListingById(listingId);
        setListing(data);
        
        // Set default check-in date to be tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setBookingData(prev => ({
          ...prev,
          checkInDate: tomorrow.toISOString().split('T')[0]
        }));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setFetchError('Failed to load listing details. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchListing();
  }, [listingId, getListingById, navigate, user]);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Check-in date validation
    if (!bookingData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    } else {
      const selectedDate = new Date(bookingData.checkInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.checkInDate = 'Check-in date cannot be in the past';
      }
      
      if (listing?.availableFrom) {
        const availableFrom = new Date(listing.availableFrom);
        availableFrom.setHours(0, 0, 0, 0);
        
        if (selectedDate < availableFrom) {
          newErrors.checkInDate = `PG is only available from ${availableFrom.toLocaleDateString()}`;
        }
      }
    }
    
    // Duration validation
    if (!bookingData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (bookingData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 month';
    } else if (bookingData.duration > 12) {
      newErrors.duration = 'Duration cannot exceed 12 months';
    }
    
    // Occupants validation
    if (!bookingData.occupants) {
      newErrors.occupants = 'Number of occupants is required';
    } else if (bookingData.occupants < 1) {
      newErrors.occupants = 'At least 1 occupant is required';
    } else if (listing?.maxOccupancy && bookingData.occupants > listing.maxOccupancy) {
      newErrors.occupants = `Maximum ${listing.maxOccupancy} occupants allowed`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'occupants' ? parseInt(value, 10) : value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const result = await createBooking({
          listingId,
          ...bookingData,
          amount: calculateTotalAmount()
        });
        
        if (result.success) {
          navigate(`/bookings/${result.bookingId}/confirm`);
        }
      } catch (err) {
        console.error('Booking error:', err);
      }
    }
  };
  
  // Format currency for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate total amount based on duration
  const calculateTotalAmount = () => {
    if (!listing) return 0;
    return listing.price * bookingData.duration;
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" color="indigo" />
        </div>
      </MainLayout>
    );
  }
  
  if (fetchError || !listing) {
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
                <p className="text-sm text-red-700">
                  {fetchError || 'Listing not found. Please try again.'}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/search"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61]"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link to={`/listings/${listingId}`} className="ml-2 text-gray-500 hover:text-gray-700">
                  {listing.title}
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="ml-2 text-gray-900 font-medium">Book Now</span>
              </li>
            </ol>
          </nav>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h1 className="text-2xl font-bold text-gray-900">Book Your Stay</h1>
                  <p className="text-gray-600">Fill in the details to complete your booking</p>
                </div>
                
                {error && (
                  <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Check-in Date */}
                    <div>
                      <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                        Check-in Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          id="checkInDate"
                          name="checkInDate"
                          value={bookingData.checkInDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]} // Minimum date is today
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.checkInDate ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm`}
                        />
                        {errors.checkInDate && <p className="mt-2 text-sm text-red-600">{errors.checkInDate}</p>}
                        <p className="mt-1 text-sm text-gray-500">Available from {new Date(listing.availableFrom).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Duration (in months)
                      </label>
                      <div className="mt-1">
                        <select
                          id="duration"
                          name="duration"
                          value={bookingData.duration}
                          onChange={handleChange}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.duration ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm`}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                            <option key={month} value={month}>
                              {month} {month === 1 ? 'month' : 'months'}
                            </option>
                          ))}
                        </select>
                        {errors.duration && <p className="mt-2 text-sm text-red-600">{errors.duration}</p>}
                      </div>
                    </div>
                    
                    {/* Number of Occupants */}
                    <div>
                      <label htmlFor="occupants" className="block text-sm font-medium text-gray-700">
                        Number of Occupants
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="occupants"
                          name="occupants"
                          value={bookingData.occupants}
                          onChange={handleChange}
                          min="1"
                          max={listing.maxOccupancy || 4}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.occupants ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm`}
                        />
                        {errors.occupants && <p className="mt-2 text-sm text-red-600">{errors.occupants}</p>}
                        <p className="mt-1 text-sm text-gray-500">Maximum {listing.maxOccupancy || 'N/A'} occupants allowed</p>
                      </div>
                    </div>
                    
                    {/* Additional Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message to Owner (Optional)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="message"
                          name="message"
                          value={bookingData.message}
                          onChange={handleChange}
                          rows="3"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm"
                          placeholder="Any special requests or questions..."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Spinner size="small" color="white" /> : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Booking Summary</h2>
                </div>
                
                <div className="p-6">
                  {/* Property Details */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={listing.images[0] || '/images/placeholder.jpg'} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-md font-semibold text-gray-900">{listing.title}</h3>
                        <p className="text-sm text-gray-600">{listing.location.name}, {listing.location.city}</p>
                        <p className="text-sm text-gray-600 mt-1">{listing.type} | {listing.occupancy}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price Details */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Price Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monthly Rent</span>
                        <span className="text-sm text-gray-900">{formatPrice(listing.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="text-sm text-gray-900">{bookingData.duration} {bookingData.duration === 1 ? 'month' : 'months'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Security Deposit</span>
                        <span className="text-sm text-gray-900">{formatPrice(listing.securityDeposit)}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                        <span className="font-semibold text-gray-900">Total Amount</span>
                        <span className="font-semibold text-[#FE6F61]">{formatPrice(calculateTotalAmount())}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cancellation Policy */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
                    <p className="text-sm text-gray-600">
                      Free cancellation within 24 hours of booking. After that, the security deposit is non-refundable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingForm; 