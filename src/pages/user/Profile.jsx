import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const { user, updateUserProfile, updatePassword, loading, error, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    // Clear error for this field if it exists
    if (profileErrors[name]) {
      setProfileErrors({ ...profileErrors, [name]: '' });
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    // Clear error for this field if it exists
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: '' });
    }
  };
  
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.name.trim()) errors.name = 'Name is required';
    if (!profileData.email.trim()) errors.email = 'Email is required';
    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) errors.email = 'Email is invalid';
    
    if (profileData.phone && !/^\d{10}$/.test(profileData.phone)) errors.phone = 'Phone should be 10 digits';
    if (profileData.pincode && !/^\d{6}$/.test(profileData.pincode)) errors.pincode = 'Pincode should be 6 digits';
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (!passwordData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      await updateUserProfile(profileData);
      setSuccessMessage('Profile updated successfully!');
      // Reset form errors
      setProfileErrors({});
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccessMessage('Password updated successfully!');
      // Reset form and errors
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
    } catch (err) {
      console.error('Error updating password:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" color="indigo" />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account information and preferences
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile'
                      ? 'border-[#FE6F61] text-[#FE6F61]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`${
                    activeTab === 'security'
                      ? 'border-[#FE6F61] text-[#FE6F61]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Security
                </button>
              </nav>
            </div>
            
            {/* Profile tab content */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="p-6">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-start">
                  <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-medium uppercase">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-medium text-gray-900 mb-1">{user.name}</h2>
                    <p className="text-sm text-gray-500 mb-1">{user.email}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.role === 'owner' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'owner' ? 'Owner' : 'Tenant'}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/profile/bookings"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        My Bookings
                      </Link>
                      <Link
                        to="/favorites"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Saved PGs
                      </Link>
                      {user.role === 'owner' && (
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Owner Dashboard
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          profileErrors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                        }`}
                      />
                      {profileErrors.name && <p className="mt-2 text-sm text-red-600">{profileErrors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          profileErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                        }`}
                        disabled // Email cannot be changed
                      />
                      {profileErrors.email && <p className="mt-2 text-sm text-red-600">{profileErrors.email}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          profileErrors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                        }`}
                      />
                      {profileErrors.phone && <p className="mt-2 text-sm text-red-600">{profileErrors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={profileData.gender}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={profileData.state}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">PIN Code</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={profileData.pincode}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          profileErrors.pincode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                        }`}
                      />
                      {profileErrors.pincode && <p className="mt-2 text-sm text-red-600">{profileErrors.pincode}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61] disabled:opacity-50"
                  >
                    {isSubmitting ? <Spinner size="small" color="white" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
            
            {/* Security tab content */}
            {activeTab === 'security' && (
              <div className="p-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ensure your account is using a strong password to stay secure.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          passwordErrors.currentPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                        }`}
                      />
                      {passwordErrors.currentPassword && <p className="mt-2 text-sm text-red-600">{passwordErrors.currentPassword}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          passwordErrors.newPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                        }`}
                      />
                      {passwordErrors.newPassword && <p className="mt-2 text-sm text-red-600">{passwordErrors.newPassword}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          passwordErrors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                        }`}
                      />
                      {passwordErrors.confirmPassword && <p className="mt-2 text-sm text-red-600">{passwordErrors.confirmPassword}</p>}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE6F61] hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6F61] disabled:opacity-50"
                    >
                      {isSubmitting ? <Spinner size="small" color="white" /> : 'Update Password'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Account Deletion</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
                          </p>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => window.confirm('Are you sure you want to delete your account? This action cannot be undone.') && logout()}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;