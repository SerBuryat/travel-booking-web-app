'use client';

import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return (
    <h3 className="text-base font-semibold text-gray-800" style={{ fontSize: '15px', fontWeight: 600 }}>
      {children}
    </h3>
  );
};

