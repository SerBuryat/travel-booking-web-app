'use client';

import React, { useState } from 'react';
import { ClientWithAuthType } from '@/model/ClientType';

interface ProfileCardComponentProps {
  user: ClientWithAuthType;
}

export default function ProfileCardComponent({ user }: ProfileCardComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для получения инициалов
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0]?.toUpperCase() || 'U';
  };

  // Получение основной информации пользователя
  const getUserInfo = () => {
    const activeAuth = user.tclients_auth.find(auth => auth.is_active);
    const authContext = activeAuth?.auth_context as any;
    
    return {
      id: user.id,
      name: user.name,
      role: activeAuth?.role || 'user',
      telegram_id: authContext?.id,
      username: authContext?.username
    };
  };

  // Открытие модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Карточка профиля в header */}
      <div 
        className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleOpenModal}
      >
        {/* Аватарка */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
          {getInitials(getUserInfo().name)}
        </div>
        
        {/* Имя и ID */}
        <div className="flex-1">
          <div className="font-bold text-gray-900">{getUserInfo().name}</div>
          <div className="text-blue-600 text-sm">id#{getUserInfo().id}</div>
        </div>
        
        {/* Стрелочка */}
        <div className="text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Заголовок */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Данные пользователя</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* JSON данные */}
            <div className="p-4">
              <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded border overflow-auto max-h-96">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
