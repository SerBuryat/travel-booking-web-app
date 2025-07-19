'use client';

import React from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { NAVBAR_BUTTONS } from '@/components/navbar/navbarConfig';

export const Footer: React.FC = () => {
  return (
    <footer>
      <Navbar buttons={NAVBAR_BUTTONS} />
    </footer>
  );
}; 