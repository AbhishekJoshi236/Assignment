import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AppLoaderProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children, isLoading }) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  
  useEffect(() => {
    // If loading is done, wait a bit then hide the loader
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1000); // Transition delay
      
      return () => clearTimeout(timer);
    } else {
      setShowLoader(true);
    }
  }, [isLoading]);
  
  return (
    <>
      {showLoader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center flex flex-col items-center justify-center">
            <motion.div
              className="w-16 h-16 mb-6 relative"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-blue-400 border-l-transparent animate-spin"></div>
            </motion.div>
            
            <motion.h2 
              className="text-2xl font-bold text-gray-100 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Habit Tracker
            </motion.h2>
            
            <motion.p 
              className="text-base text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Loading your data...
            </motion.p>
          </div>
        </motion.div>
      )}
      
      {children}
    </>
  );
};

export default AppLoader; 