'use client';

import React from 'react';

interface ProgressBarProps {
  isVisible: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-600">
        <div className="h-full bg-blue-400 animate-pulse" style={{ width: '100%' }}>
          <div className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse"></div>
        </div>
      </div>
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        Создание сервиса...
      </div>
    </div>
  );
};
