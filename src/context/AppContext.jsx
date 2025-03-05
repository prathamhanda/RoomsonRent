import { AuthProvider } from './AuthContext';
import { ListingProvider } from './ListingContext';
import { BookingProvider } from './BookingContext';
import { LocationProvider } from './LocationContext';
import { Toaster } from 'react-hot-toast';

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <LocationProvider>
        <ListingProvider>
          <BookingProvider>
            <Toaster position="top-center" />
            {children}
          </BookingProvider>
        </ListingProvider>
      </LocationProvider>
    </AuthProvider>
  );
};