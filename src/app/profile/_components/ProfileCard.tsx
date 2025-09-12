'use client';

import React, {useState} from 'react';
import {ClientWithAuthType} from '@/model/ClientType';
import UserInfoModal from './UserInfoModal';

interface ProfileCardProps {
  user: ClientWithAuthType;
}

export default function ProfileCard({ user }: ProfileCardProps) {
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

  return (
    <>
      <div 
        className="flex items-center gap-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Аватарка */}
        {user.photo ? (
          <img
            src={user.photo}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
            {getInitials(user.name)}
          </div>
        )}
        
        {/* Имя и ID */}
        <div className="flex-1">
          <div className="font-bold text-gray-900">{user.name}</div>
          <div className="text-blue-600 text-sm">id#{user.id}</div>
        </div>
        
        {/* Стрелочка */}
        <div className="text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <UserInfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </>
  );
}
