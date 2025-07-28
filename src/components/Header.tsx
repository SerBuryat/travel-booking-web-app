import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="bg-white pt-8 px-4 pb-4">
      <div className="max-w-md mx-auto flex flex-col">
        {children}
      </div>
    </header>
  );
}; 