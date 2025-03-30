import React from 'react';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-blue-500 transition-all duration-100 ease-linear"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress; 