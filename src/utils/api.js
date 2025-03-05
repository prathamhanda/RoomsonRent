import { API_URL } from '../config/constants';

// Helper function for making API requests
const fetchApi = async (url, options = {}) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };
  
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API endpoints for listings
export const listingApi = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchApi(`/api/listings?${queryString}`);
  },
  
  getFeatured: () => fetchApi('/api/listings/featured'),
  
  getById: (id) => fetchApi(`/api/listings/${id}`),
  
  create: (listingData) => fetchApi('/api/listings', {
    method: 'POST',
    body: JSON.stringify(listingData)
  }),
  
  update: (id, listingData) => fetchApi(`/api/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(listingData)
  }),
  
  delete: (id) => fetchApi(`/api/listings/${id}`, {
    method: 'DELETE'
  }),
  
  toggleFavorite: (id) => fetchApi(`/api/listings/${id}/favorite`, {
    method: 'POST'
  }),
  
  getFavorites: () => fetchApi('/api/listings/favorites')
};

// API endpoints for bookings
export const bookingApi = {
  create: (bookingData) => fetchApi('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  
  getById: (id) => fetchApi(`/api/bookings/${id}`),
  
  getUserBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchApi(`/api/bookings/user?${queryString}`);
  },
  
  getOwnerBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchApi(`/api/bookings/owner?${queryString}`);
  },
  
  updateStatus: (id, status) => fetchApi(`/api/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
};

// API endpoints for user
export const userApi = {
  updateProfile: (userData) => fetchApi('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  
  updatePassword: (passwordData) => fetchApi('/api/users/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  })
};

// API endpoints for locations
export const locationApi = {
  getAll: () => fetchApi('/api/locations'),
  
  search: (query) => fetchApi(`/api/locations/search?query=${query}`),
  
  getNearby: (lat, lng) => fetchApi(`/api/locations/nearby?lat=${lat}&lng=${lng}`)
};

// API endpoints for authentication
export const authApi = {
  login: (credentials) => fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => fetchApi('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  forgotPassword: (email) => fetchApi('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  resetPassword: (token, password) => fetchApi('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password })
  }),
  
  verifyEmail: (token) => fetchApi(`/api/auth/verify-email/${token}`),
  
  getProfile: () => fetchApi('/api/auth/profile'),
  
  googleLogin: (googleData) => fetchApi('/api/auth/google-login', {
    method: 'POST',
    body: JSON.stringify(googleData)
  })
}; 