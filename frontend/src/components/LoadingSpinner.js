import React from 'react';

const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-uber-black rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;