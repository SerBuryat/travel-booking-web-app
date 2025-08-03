'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, NAVBAR_BUTTONS } from '@/utils/navbar';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  
  // Скрываем навбар на странице авторизации Telegram
  if (pathname === '/telegram-auth') {
    return null;
  }

  return (
    <footer>
      <Navbar buttons={NAVBAR_BUTTONS} />
    </footer>
  );
}; 