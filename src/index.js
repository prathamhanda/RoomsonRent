import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './styles/map.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ListingProvider } from './context/ListingContext';
import { BookingProvider } from './context/BookingContext';
import { LocationProvider } from './context/LocationContext';
import { FirebaseProvider } from './context/FirebaseContext';
import { NotificationProvider } from './context/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <FirebaseProvider>
            <LocationProvider>
              <ListingProvider>
                <BookingProvider>
                  <App />
                </BookingProvider>
              </ListingProvider>
            </LocationProvider>
          </FirebaseProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
); 