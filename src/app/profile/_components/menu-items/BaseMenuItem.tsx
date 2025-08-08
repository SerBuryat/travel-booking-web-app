'use client';

import React from 'react';

interface BaseMenuItemProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  className?: string;
}

export default function BaseMenuItem({ 
  title, 
  icon, 
  onClick, 
  variant = 'default',
  className = ''
}: BaseMenuItemProps) {
  const baseClasses = "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-lg hover:shadow-md";
  
  const variantClasses = {
    default: "hover:bg-gray-50 text-gray-900",
    danger: "hover:bg-red-50 text-red-600"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div className={variant === 'danger' ? 'text-red-600' : 'text-gray-600'}>
        {icon}
      </div>
      <span className="font-bold">{title}</span>
    </button>
  );
}
