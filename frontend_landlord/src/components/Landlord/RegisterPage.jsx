import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';
import backendURL from '@/config/config';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setphone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      const response = await fetch(`${backendURL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, role: 'landlord' }),
      });
      const data = await response.json();

      if (!data.status) {
        throw new Error(data.error || 'Registration failed');
      }
      alert('OTP sent to your WhatsApp!');
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error registering user:', error);
      alert(error.message);
    }
  };

  const verifyOtp = async () => {
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

      alert('Verification successful! Redirecting...');
      setIsVerified(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F9FAFB]">
      <div className="bg-white rounded-lg border-2 border-[#FE6F61] shadow-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#FE6F61]">Create an Account</h2>
        {!isOtpSent ? (
          <>
            <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 mb-4 block w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#FE6F61]"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 mb-4 block w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#FE6F61]"
            required
          />
          <input
            type="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setphone(e.target.value)}
            className="border border-gray-300 block w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#FE6F61]"
            required
          />
          <br />
          <br />
          <Button type="submit" className="bg-[#FE6F61] w-full text-white rounded-lg p-2 font-semibold" onClick={registerUser}>
            Register
          </Button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#FE6F61]"
            />
            <Button className="bg-[#FE6F61] text-white p-2 font-semibold mt-4" onClick={verifyOtp}>
              Verify OTP
            </Button>
          </>
        )}
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FE6F61] font-semibold">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
