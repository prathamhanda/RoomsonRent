import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BookingContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  // Get all bookings for the current user
  const getUserBookings = async (status = '') => {
    try {
      setLoading(true);
      const queryParams = status ? `?status=${status}` : '';
      const response = await axios.get(`${API_URL}/bookings/user${queryParams}`);
      
      setBookings(response.data.bookings);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch bookings' };
    } finally {
      setLoading(false);
    }
  };

  // Get all bookings for the owner's listings
  const getOwnerBookings = async (status = '') => {
    try {
      setLoading(true);
      const queryParams = status ? `?status=${status}` : '';
      const response = await axios.get(`${API_URL}/bookings/owner${queryParams}`);
      
      setBookings(response.data.bookings);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch owner bookings');
      toast.error(error.response?.data?.message || 'Failed to fetch owner bookings');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch owner bookings' };
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const getBookingById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bookings/${id}`);
      setBooking(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch booking');
      toast.error(error.response?.data?.message || 'Failed to fetch booking');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch booking' };
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/bookings`, bookingData);
      
      toast.success('Booking created successfully');
      return { success: true, booking: response.data.booking };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
      toast.error(error.response?.data?.message || 'Failed to create booking');
      return { success: false, error: error.response?.data?.message || 'Failed to create booking' };
    } finally {
      setLoading(false);
    }
  };

  // Update booking status (for owner)
  const updateBookingStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${API_URL}/bookings/${id}/status`, { status });
      
      // Update booking in state if it exists
      if (booking && booking._id === id) {
        setBooking({
          ...booking,
          status: response.data.booking.status
        });
      }
      
      // Update bookings list if it contains the updated booking
      setBookings(bookings.map(b => 
        b._id === id ? { ...b, status: response.data.booking.status } : b
      ));
      
      toast.success(`Booking ${status} successfully`);
      return { success: true, booking: response.data.booking };
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${status} booking`);
      toast.error(error.response?.data?.message || `Failed to ${status} booking`);
      return { success: false, error: error.response?.data?.message || `Failed to ${status} booking` };
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking (for user)
  const cancelBooking = async (id, reason) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${API_URL}/bookings/${id}/cancel`, { reason });
      
      // Update booking in state if it exists
      if (booking && booking._id === id) {
        setBooking({
          ...booking,
          status: 'cancelled',
          cancellationReason: reason
        });
      }
      
      // Update bookings list if it contains the cancelled booking
      setBookings(bookings.map(b => 
        b._id === id ? { ...b, status: 'cancelled', cancellationReason: reason } : b
      ));
      
      toast.success('Booking cancelled successfully');
      return { success: true, booking: response.data.booking };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel booking');
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
      return { success: false, error: error.response?.data?.message || 'Failed to cancel booking' };
    } finally {
      setLoading(false);
    }
  };

  // Add payment details to booking
  const addPaymentDetails = async (id, paymentData) => {
    try {
      setLoading(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add payment data to FormData
      Object.keys(paymentData).forEach(key => {
        if (key === 'paymentProof' && paymentData.paymentProof instanceof File) {
          formData.append('paymentProof', paymentData.paymentProof);
        } else {
          formData.append(key, paymentData[key]);
        }
      });
      
      const response = await axios.post(`${API_URL}/bookings/${id}/payment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update booking in state if it exists
      if (booking && booking._id === id) {
        setBooking({
          ...booking,
          payment: response.data.booking.payment
        });
      }
      
      // Update bookings list if it contains the updated booking
      setBookings(bookings.map(b => 
        b._id === id ? { ...b, payment: response.data.booking.payment } : b
      ));
      
      toast.success('Payment details added successfully');
      return { success: true, booking: response.data.booking };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add payment details');
      toast.error(error.response?.data?.message || 'Failed to add payment details');
      return { success: false, error: error.response?.data?.message || 'Failed to add payment details' };
    } finally {
      setLoading(false);
    }
  };

  // Check availability for a listing
  const checkAvailability = async (listingId, checkInDate, checkOutDate) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/bookings/check-availability?listingId=${listingId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      );
      
      return { success: true, available: response.data.available };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to check availability');
      toast.error(error.response?.data?.message || 'Failed to check availability');
      return { success: false, error: error.response?.data?.message || 'Failed to check availability' };
    } finally {
      setLoading(false);
    }
  };

  // Get booking statistics for owner
  const getBookingStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bookings/stats`);
      return { success: true, stats: response.data };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch booking statistics');
      toast.error(error.response?.data?.message || 'Failed to fetch booking statistics');
      return { success: false, error: error.response?.data?.message || 'Failed to fetch booking statistics' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        booking,
        loading,
        error,
        pagination,
        getUserBookings,
        getOwnerBookings,
        getBookingById,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        addPaymentDetails,
        checkAvailability,
        getBookingStats
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext); 