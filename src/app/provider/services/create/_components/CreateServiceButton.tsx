'use client';

import React from 'react';

interface CreateServiceButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
}

export const CreateServiceButton: React.FC<CreateServiceButtonProps> = ({ 
  isSubmitting, 
  disabled 
}) => {
  return (
    <div className="flex justify-center">
      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className={`
          px-10 py-4 rounded-2xl font-bold text-white transition-all duration-300 text-lg
          ${disabled || isSubmitting 
            ? 'bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed shadow-md' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95'
          }
        `}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Создание сервиса...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Создать сервис</span>
          </div>
        )}
      </button>
    </div>
  );
};
