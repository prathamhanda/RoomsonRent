import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import Spinner from './components/common/Spinner';
import PrivateRoute from './components/auth/PrivateRoute';
import OwnerRoute from './components/auth/OwnerRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy-loaded pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerificationSent = lazy(() => import('./pages/auth/VerificationSent'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const Search = lazy(() => import('./pages/Search'));
const ListingDetails = lazy(() => import('./pages/ListingDetails'));
const BookingForm = lazy(() => import('./pages/BookingForm'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const UserBookings = lazy(() => import('./pages/UserBookings'));
const UserFavorites = lazy(() => import('./pages/UserFavorites'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Owner pages
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'));
const OwnerListings = lazy(() => import('./pages/owner/OwnerListings'));
const CreateListing = lazy(() => import('./pages/owner/CreateListing'));
const OwnerBookings = lazy(() => import('./pages/owner/OwnerBookings'));

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [], requireVerified = true }) => {
  const { user, initialLoading, isEmailVerified } = useAuth();
  
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" color="indigo" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireVerified && !isEmailVerified) {
    return <Navigate to="/verification-sent" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Redirect if logged in
const RedirectIfLoggedIn = ({ children }) => {
  const { user, initialLoading } = useAuth();
  
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" color="indigo" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const { user, loading } = useAuth();

  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="flex justify-center items-center min-h-screen">
            <Spinner size="large" color="indigo" />
          </div>
        </MainLayout>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/not-found" element={<NotFound />} />

        {/* Auth Routes - Only accessible if not logged in */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/verification-sent"
          element={
            <PublicOnlyRoute>
              <VerificationSent />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicOnlyRoute>
              <VerifyEmail />
            </PublicOnlyRoute>
          }
        />

        {/* User Routes - Requires authentication */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/bookings"
          element={
            <PrivateRoute>
              <UserBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <UserFavorites />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings/new/:listingId"
          element={
            <PrivateRoute>
              <BookingForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings/confirmation/:bookingId"
          element={
            <PrivateRoute>
              <BookingConfirmation />
            </PrivateRoute>
          }
        />

        {/* Owner Routes - Requires owner role */}
        <Route
          path="/dashboard"
          element={
            <OwnerRoute>
              <DashboardLayout>
                <OwnerDashboard />
              </DashboardLayout>
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/listings"
          element={
            <OwnerRoute>
              <DashboardLayout>
                <OwnerListings />
              </DashboardLayout>
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/listings/create"
          element={
            <OwnerRoute>
              <DashboardLayout>
                <CreateListing />
              </DashboardLayout>
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/listings/edit/:id"
          element={
            <OwnerRoute>
              <DashboardLayout>
                <CreateListing />
              </DashboardLayout>
            </OwnerRoute>
          }
        />
        <Route
          path="/dashboard/bookings"
          element={
            <OwnerRoute>
              <DashboardLayout>
                <OwnerBookings />
              </DashboardLayout>
            </OwnerRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;