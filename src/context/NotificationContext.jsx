import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', timeout = 5000) => {
    const id = Date.now();
    
    setNotifications(prev => [...prev, { id, message, type }]);

    if (timeout) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }

    return id;
  }, []);

  const removeNotification = useCallback(id => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, timeout) => {
    return addNotification(message, 'success', timeout);
  }, [addNotification]);

  const showError = useCallback((message, timeout) => {
    return addNotification(message, 'error', timeout);
  }, [addNotification]);

  const showInfo = useCallback((message, timeout) => {
    return addNotification(message, 'info', timeout);
  }, [addNotification]);

  const showWarning = useCallback((message, timeout) => {
    return addNotification(message, 'warning', timeout);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning
      }}
    >
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
        <AnimatePresence>
          {notifications.map(({ id, message, type }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: -50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`p-4 rounded-lg shadow-lg border-l-4 ${
                type === 'success'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : type === 'error'
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : type === 'warning'
                  ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                  : 'bg-blue-50 border-blue-500 text-blue-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">{message}</div>
                <button
                  onClick={() => removeNotification(id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}; 