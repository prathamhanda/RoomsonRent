// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Application Constants
export const APP_NAME = 'Rooms on Rent';
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CURRENCY = 'USD';

// Booking Status Constants
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// User Role Constants
export const USER_ROLES = {
  USER: 'user',
  OWNER: 'owner',
  ADMIN: 'admin'
}; 