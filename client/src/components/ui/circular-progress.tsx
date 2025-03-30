import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: React.ReactNode;
  showValue?: boolean;
  valueClassName?: string;
  status?: 'good' | 'warning' | 'error';
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  label,
  showValue = true,
  valueClassName,
  status = 'good',
}: CircularProgressProps) {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Calculate SVG parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  
  // Set color based on status
  const getStrokeColor = () => {
    switch (status) {
      case 'good':
        return 'stroke-success';
      case 'warning':
        return 'stroke-warning';
      case 'error':
        return 'stroke-error';
      default:
        return 'stroke-primary';
    }
  };

  return (
    <div className={cn('relative inline-flex flex-col items-center justify-center', className)}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className="stroke-gray-200"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          className={cn(getStrokeColor(), "transition-all duration-500 ease-in-out")}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className={cn('text-2xl font-bold', valueClassName)}>
            {normalizedValue}
          </span>
        )}
        {label && <div className="text-sm text-gray-500 mt-1">{label}</div>}
      </div>
    </div>
  );
}