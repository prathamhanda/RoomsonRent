import React from 'react';

const Spinner = ({ size = 'medium', color = 'primary' }) => {
  // Size classes
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Color classes
  const colorClasses = {
    primary: 'text-[#FE6F61]',
    secondary: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${colorClasses[color]} ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Spinner; 