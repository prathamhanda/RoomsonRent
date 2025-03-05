import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Check if token is expired
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token is expired
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // Set auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          getCurrentUser();
        }
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      toast.success('Registration successful! Please check your email to verify your account.');
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Add Google authentication function
  const googleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get Google account info
      const { displayName, email, photoURL } = result.user;
      
      // Check if user exists in our database
      const response = await fetch(`${API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: displayName,
          email,
          photo: photoURL,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to login with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google login as landlord
  const googleLoginAsLandlord = () => {
    window.location.href = `${API_URL}/auth/google?role=landlord`;
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      setError(error.response?.data?.message || 'Failed to get user data');
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/auth/profile`, profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      toast.success('Password reset email sent. Please check your inbox.');
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email');
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      return { success: false, error: error.response?.data?.message || 'Failed to send reset email' };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/reset-password`, { token, password });
      toast.success('Password reset successful. You can now login with your new password.');
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
      toast.error(error.response?.data?.message || 'Failed to reset password');
      return { success: false, error: error.response?.data?.message || 'Failed to reset password' };
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      await axios.get(`${API_URL}/auth/verify-email/${token}`);
      
      // Update user verification status if logged in
      if (user) {
        await getCurrentUser();
      }
      
      toast.success('Email verified successfully!');
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify email');
      toast.error(error.response?.data?.message || 'Failed to verify email');
      return { success: false, error: error.response?.data?.message || 'Failed to verify email' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        googleLogin,
        googleLoginAsLandlord,
        logout,
        updateProfile,
        requestPasswordReset,
        resetPassword,
        verifyEmail,
        isAuthenticated: !!user,
        isLandlord: user?.role === 'landlord',
        isStudent: user?.role === 'student',
        isVerified: user?.isVerified
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useAuthContext = useAuth; 