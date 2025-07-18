'use client';

import React from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { getNavbarButtons } from '@/components/navbar/navbarConfig';

const profileData = [
  { name: 'John Doe', email: 'john.doe@example.com', phone: '+1 234 567 8900' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1 234 567 8901' },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com', phone: '+1 234 567 8902' },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white pb-24 sm:pb-0">
      <div className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Profile</h1>
        <ul className="space-y-4">
          {profileData.map((profile, i) => (
            <li key={i} className="rounded-lg border p-4 bg-gray-50">
              <div className="font-semibold text-lg text-black">{profile.name}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
              <div className="text-sm text-blue-600">{profile.phone}</div>
            </li>
          ))}
        </ul>
      </div>
      <Navbar buttons={getNavbarButtons()} />
    </div>
  );
} 