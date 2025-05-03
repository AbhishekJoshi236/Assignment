import React from 'react';

interface ComponentLoaderProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const ComponentLoader: React.FC<ComponentLoaderProps> = ({ children, isLoading }) => {
  if (!isLoading) return <>{children}</>;
  
  return (
    <div className="p-4 bg-black text-white min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-40 bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
      
      <div className="bg-gray-900 rounded-xl shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="md:w-40 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="md:w-40 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-gray-900 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex mb-4">
              <div className="flex-1">
                <div className="h-6 w-48 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-800 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-gray-800 rounded-full"></div>
            </div>
            <div className="h-20 bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentLoader; 