'use client';

import React from 'react';

interface BaseMenuItemProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  className?: string;
  disabled?: boolean;
}

export default function BaseMenuItem({ 
  title, 
  icon, 
  onClick, 
  variant = 'default',
  className = '',
  disabled = false
}: BaseMenuItemProps) {
  const baseClasses = "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-lg";
  
  const variantClasses = {
    default: disabled ? "text-gray-400 cursor-not-allowed" : "hover:shadow-md hover:bg-gray-50 text-gray-900",
    danger: disabled ? "text-gray-400 cursor-not-allowed" : "hover:shadow-md hover:bg-red-50 text-red-600"
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div className={variant === 'danger' && !disabled ? 'text-red-600' : disabled ? 'text-gray-400' : 'text-gray-600'}>
        {icon}
      </div>
      <span className="font-bold">{title}</span>
    </button>
  );
}
