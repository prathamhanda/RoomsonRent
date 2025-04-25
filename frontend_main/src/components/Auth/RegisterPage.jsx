import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';
import backendURL from '@/config/config';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '../Navbar';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const registerUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, role: 'user' }),
      });
      const data = await response.json();

      if (!data.status) {
        throw new Error(data.error || 'Registration failed');
      }
      
      toast.success('OTP sent to your WhatsApp!', {
        icon: '📱',
        duration: 4000
      });
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
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

      toast.success('Account created successfully! Redirecting...', {
        icon: '✅',
        duration: 3000
      });
      
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A2540] to-[#0E3154]">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <Toaster position="top-center" reverseOrder={false} />
        
        <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg w-96 transition-all duration-300 hover:shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#FE6F61]">Join Us</h2>
            <p className="text-gray-500 mt-2">Create your account</p>
          </div>
          
          {!isOtpSent ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent transition-all"
                  required
                />
              </div>
              
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
                onClick={registerUser} 
                disabled={isLoading}
                className="w-full py-3 bg-[#FE6F61] hover:bg-[#e5635b] text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? 'Processing...' : 'Create Account'}
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
                Edit registration details
              </button>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FE6F61] font-semibold hover:underline transition-all">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 