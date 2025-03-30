import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';
import backendURL from '@/config/config';

  

const LoginPage = () => {
    
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const [phone, setphone] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const loginUser = async () => {
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
          alert('OTP sent to your WhatsApp!');
          setIsOtpSent(true);
        } catch (error) {
          console.error('Error logging in', error);
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
    <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white border-2 border-[#FE6F61] p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-[#FE6F61] text-center mb-6">Login</h2>
                {!isOtpSent ? (
                <>
                <input
                    type="phone"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FE6F61] transition duration-200"
                    required
                />
                <Button onClick={loginUser} className="bg-[#FE6F61] w-full text-white rounded-lg p-2 font-semibold mt-4">
                    Login
                </Button>
                </>
                ):(
                <div>
                    <label className="block text-gray-700">OTP</label>
                    <input 
                        type="text" 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FE6F61] transition duration-200" 
                        placeholder="Enter OTP sent to your phone" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button onClick={verifyOtp} className="bg-[#FE6F61] w-full text-white rounded-lg p-2 font-semibold">Verify OTP</Button>
                </div>
                )}
            <p className="mt-4 text-center text-gray-600">
                Don't have an account? <a href="/register" className="text-[#FE6F61] font-semibold">Sign Up</a>
            </p>
        </div>
    </div>
  )
}

export default LoginPage
