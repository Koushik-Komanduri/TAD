import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-800"></div>
    </div>
  );
};

export default LoadingIndicator;
