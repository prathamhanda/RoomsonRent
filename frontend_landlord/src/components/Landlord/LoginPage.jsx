import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';
import backendURL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const { isAuthenticated, checkLogin } = useAuth();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const loginUser = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();

      if (!data.status) {
        throw new Error(data.error || 'Login failed');
      }
      
      toast.success('OTP sent to your WhatsApp!', {
        icon: '📱',
        duration: 4000
      });
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error logging in', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/auth/verifyOTP`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      
      if (data.msg === 'Invalid OTP') {
        throw new Error('Incorrect OTP, please try again.');
      }

      toast.success('Login successful! Redirecting...', {
        icon: '✅',
        duration: 3000
      });
      
      await checkLogin();
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return isAuthenticated ? null : (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg w-96 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#FE6F61]">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to continue to your account</p>
        </div>
        
        {!isOtpSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent transition-all"
                required
              />
            </div>
            
            <Button 
              onClick={loginUser} 
              disabled={isLoading}
              className="w-full py-3 bg-[#FE6F61] hover:bg-[#e5635b] text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent transition-all" 
                placeholder="Enter OTP sent to your WhatsApp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">OTP sent to: {phone}</p>
            </div>
            
            <Button 
              onClick={verifyOtp} 
              disabled={isLoading}
              className="w-full py-3 bg-[#FE6F61] hover:bg-[#e5635b] text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            
            <button 
              onClick={() => setIsOtpSent(false)} 
              className="w-full text-sm text-gray-500 hover:text-[#FE6F61] transition-colors"
            >
              Use a different phone number
            </button>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-[#FE6F61] font-semibold hover:underline transition-all">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;