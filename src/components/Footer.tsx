'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, getNavbarButtonsByRole } from '@/utils/navbar';
import { useAuth } from '@/contexts/AuthContext';
import { PAGE_ROUTES } from '@/utils/routes';

// Skeleton компонент для Footer
const FooterSkeleton: React.FC = () => (
  <footer>
    <nav className="fixed bottom-0 w-full z-50 pb-4 pt-2" style={{ background: '#F6F6F6' }}>
      <div className="flex rounded-full px-6 py-2 justify-between w-full" style={{ background: '#F6F6F6' }}>
        {/* 5 skeleton кнопок */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Skeleton иконка */}
            <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse mb-1"></div>
            {/* Skeleton текст */}
            <div className="w-12 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </nav>
  </footer>
);

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  
  // Скрываем навбар на странице авторизации Telegram
  if (pathname === PAGE_ROUTES.TELEGRAM_AUTH) {
    return null;
  }

  // Показываем skeleton пока загружается аутентификация
  if (isLoading) {
    return <FooterSkeleton />;
  }
  
  // Получаем роль пользователя
  const role = user?.user?.role;
  
  const navbarButtons = getNavbarButtonsByRole(role);

  return (
    <footer>
      <Navbar buttons={navbarButtons} />
    </footer>
  );
}; 