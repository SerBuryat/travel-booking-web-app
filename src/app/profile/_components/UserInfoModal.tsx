'use client';

import React, { useEffect } from 'react';
import {ClientWithAuthType, AuthRole} from '@/model/ClientType';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ClientWithAuthType;
}

export default function UserInfoModal({ isOpen, onClose, user }: UserInfoModalProps) {
  // Закрытие по клавише Escape и блокировка скролла body
  useEffect(() => {
    if (!isOpen) return;
    
    // Блокировка скролла body
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Функция для получения инициалов
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0]?.toUpperCase() || 'U';
  };

  // Форматирование даты
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Не указано';
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return 'Не указано';
    }
  };

  // Получение последней информации об аутентификации (сортировка по last_login или id)
  const latestAuth = user.tclients_auth && user.tclients_auth.length > 0 
    ? [...user.tclients_auth].sort((a, b) => {
        // Сортируем по last_login (самая свежая первая), если нет - по id
        const aDate = a.last_login ? new Date(a.last_login).getTime() : 0;
        const bDate = b.last_login ? new Date(b.last_login).getTime() : 0;
        if (aDate !== bDate) return bDate - aDate;
        return b.id - a.id;
      })[0]
    : null;

  // Получение самой свежей даты последнего входа
  const lastLogin = latestAuth?.last_login 
    ? new Date(latestAuth.last_login)
    : null;

  // Цвета для ролей
  const getRoleColor = (role: AuthRole | undefined) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'provider':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Название роли на русском
  const getRoleName = (role: AuthRole | undefined) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'provider':
        return 'Провайдер';
      case 'user':
        return 'Пользователь';
      default:
        return 'Не указано';
    }
  };

  // Тип аутентификации на русском
  const getAuthTypeName = (authType: string | null | undefined) => {
    if (!authType) return 'Не указано';
    switch (authType.toLowerCase()) {
      case 'telegram':
        return 'Telegram';
      case 'google':
        return 'Google';
      case 'email':
        return 'Email';
      default:
        return authType;
    }
  };

  // Обработка клика на overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp relative">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          aria-label="Закрыть"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Контент */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Аватар и имя пользователя */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-200">
                {getInitials(user.name)}
              </div>
            )}
            <div>
              <div className="text-xl font-semibold text-gray-900">{user.name}</div>
              <div className="text-gray-500 text-sm">ID: #{user.id}</div>
            </div>
          </div>

          {/* Роль и статус */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-gray-600 font-medium">Роль</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRoleColor(latestAuth?.role)}`}>
                {getRoleName(latestAuth?.role)}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600 font-medium">Статус</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                latestAuth?.is_active 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {latestAuth?.is_active ? 'Активен' : 'Неактивен'}
              </div>
            </div>
          </div>

          {/* Информационные карточки */}
          <div className="space-y-4">
            {/* Email */}
            {user.email && (
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-medium mb-1">Email</div>
                  <div className="text-gray-900 font-semibold">{user.email}</div>
                </div>
              </div>
            )}

            {/* Тип аутентификации */}
            {latestAuth?.auth_type && (
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-medium mb-1">Тип входа</div>
                  <div className="text-gray-900 font-semibold">{getAuthTypeName(latestAuth.auth_type)}</div>
                </div>
              </div>
            )}

            {/* Дата регистрации */}
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 font-medium mb-1">Дата регистрации</div>
                <div className="text-gray-900 font-semibold">{formatDate(user.created_at)}</div>
              </div>
            </div>

            {/* Последний вход */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 font-medium mb-1">Последний вход</div>
                <div className="text-gray-900 font-semibold">
                  {lastLogin ? formatDate(lastLogin) : 'Никогда'}
                </div>
                {lastLogin && (
                  <div className="text-xs text-gray-500 mt-1">
                    {(() => {
                      const diff = Date.now() - lastLogin.getTime();
                      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      if (days > 0) return `${days} дн. назад`;
                      if (hours > 0) return `${hours} ч. назад`;
                      return 'Только что';
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
