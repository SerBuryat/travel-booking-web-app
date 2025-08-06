'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Функция для получения инициалов
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0]?.toUpperCase() || 'U';
  };

  // Если загрузка - показать спиннер
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Если не авторизован - показать сообщение
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Не авторизован</h1>
          <p className="text-gray-600">Войдите в систему для просмотра профиля</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 sm:pb-0">
      <div className="max-w-md mx-auto pt-2 px-4">
                 {/* Заголовок */}
         <div className="text-center pt-4 mb-8">
           <h1 className="text-xl font-bold text-gray-800 mb-1">Профиль</h1>
           <p className="text-gray-600 text-xs">Данные пользователя</p>
         </div>

                 {/* Карточка профиля */}
                   <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                       {/* Аватар */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-base font-bold mx-auto shadow-lg">
                {getInitials(user.name)}
              </div>
            </div>

                       {/* Информация о пользователе */}
            <div className="space-y-3">
                           <div className="bg-gray-50 rounded-xl p-3">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Имя</label>
                <p className="text-base font-semibold text-gray-800 mt-1">{user.name}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID пользователя</label>
                <p className="text-base font-semibold text-gray-800 mt-1">{user.id}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Роль</label>
                <p className="text-base font-semibold text-gray-800 mt-1 capitalize">{user.role}</p>
              </div>
           </div>

                       {/* Кнопка выхода */}
            <div className="mt-4 pt-3 border-t border-gray-200">
             <button
               onClick={logout}
               className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
             >
               Выйти из системы
             </button>
           </div>
         </div>
      </div>
    </div>
  );
} 