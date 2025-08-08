'use client';

import React from 'react';
import { ClientWithAuthType } from '@/model/ClientType';
import ProfileCard from './ProfileCard';

interface ProfileHeaderProps {
  user: ClientWithAuthType;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="px-4 py-3">
      <ProfileCard user={user} />
    </div>
  );
}
