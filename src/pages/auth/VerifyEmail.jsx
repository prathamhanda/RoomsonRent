import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';

const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { verifyEmail } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          setError('Invalid verification link. Token is missing.');
          setVerifying(false);
          return;
        }

        await verifyEmail(token);
        setSuccess(true);
        setVerifying(false);
        
        // Redirect to login after successful verification
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Email verification failed. Please try again.');
        setVerifying(false);
      }
    };

    verifyEmailToken();
  }, [location, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Email Verification</h1>
        </div>

        {verifying ? (
          <div className="flex flex-col items-center py-6">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </div>
        ) : success ? (
          <div className="text-center py-6">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
              <svg
                className="h-12 w-12 text-green-500 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="font-medium">Your email has been successfully verified!</p>
            </div>
            <p className="text-gray-600 mb-6">
              Thank you for verifying your email. You can now login to your account.
            </p>
            <p className="text-gray-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              <svg
                className="h-12 w-12 text-red-500 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="font-medium">Email verification failed</p>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-gray-500 mb-4">
              The verification link may have expired or is invalid.
            </p>
            <Link
              to="/login"
              className="inline-block w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 