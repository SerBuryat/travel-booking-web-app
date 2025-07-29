'use client';

import React from 'react';
import { Navbar, NAVBAR_BUTTONS } from '@/utils/navbar';

export const Footer: React.FC = () => {
  return (
    <footer>
      <Navbar buttons={NAVBAR_BUTTONS} />
    </footer>
  );
}; 