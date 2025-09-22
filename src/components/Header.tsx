import React from 'react';
import { CurrentLocation } from '@/components/location/current/CurrentLocation';

interface HeaderProps {
  children: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="bg-white pt-4 px-4">
      <div className="max-w-md mx-auto flex flex-col">
        <CurrentLocation />
        {children}
      </div>
    </header>
  );
}; 