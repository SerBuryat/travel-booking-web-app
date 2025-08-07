'use client';

import React from 'react';
import { ClientWithAuthType } from '@/model/ClientType';
import ProfileCardComponent from '@/components/ProfileCardComponent';
import ProfileMenuComponent from '@/components/ProfileMenuComponent';

interface ProfileClientProps {
  user: ClientWithAuthType;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header с карточкой профиля */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <ProfileCardComponent user={user} />
      </div>

      {/* Тело с меню профиля */}
      <div className="max-w-md mx-auto pt-6 px-4">
        <ProfileMenuComponent />
      </div>
    </div>
  );
}
