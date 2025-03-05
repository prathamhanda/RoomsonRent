import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerificationSent = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div 
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
              <svg
                className="h-8 w-8 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to your email address. Please check your inbox and click
            the link to verify your account.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg text-blue-700 mb-6">
            <p>
              If you don't see the email, please check your spam folder or request a new
              verification link.
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <Link
              to="/login"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
            >
              Back to Login
            </Link>
            <button
              type="button"
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-300"
              onClick={() => window.location.reload()}
            >
              Resend Verification Email
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationSent; 