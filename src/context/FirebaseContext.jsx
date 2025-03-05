import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { useAuthContext } from './AuthContext';

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const { googleLogin, logout } = useAuthContext();

  useEffect(() => {
    try {
      const firebaseApp = initializeApp(firebaseConfig);
      setApp(firebaseApp);
      setAuth(getAuth(firebaseApp));
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get user info from Google
      const { displayName, email, photoURL } = result.user;
      
      // Send to our backend for authentication
      return await googleLogin({
        name: displayName,
        email,
        photo: photoURL
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) return;
    
    try {
      await firebaseSignOut(auth);
      await logout();
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        app,
        auth,
        signInWithGoogle,
        signOut
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}; 