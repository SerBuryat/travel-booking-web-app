'use client';

import React from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import CatalogIcon from '@/components/navbar/CatalogIcon';
import MyServiceIcon from '@/components/navbar/MyServiceIcon';
import MyProfileIcon from '@/components/navbar/MyProfileIcon';

const profileData = [
  { name: 'John Doe', email: 'john.doe@example.com', phone: '+1 234 567 8900' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1 234 567 8901' },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com', phone: '+1 234 567 8902' },
];

const navbarButtons = [
  {
    href: '/catalog',
    icon: CatalogIcon,
    title: 'Catalog',
  },
  {
    href: '/my-service',
    icon: MyServiceIcon,
    title: 'My services',
  },
  {
    href: '/my-profile',
    icon: MyProfileIcon,
    title: 'My Profile',
    badgeContent: 4,
  },
];

export default function MyProfilePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 sm:pb-0">
      {/* Hamburger for large screens */}
      <div className="hidden sm:block fixed top-4 left-4 z-50">
        <button className="rounded-full p-2 bg-transparent">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect y="5" width="24" height="3" rx="1.5" fill="#222" /><rect y="10.5" width="24" height="3" rx="1.5" fill="#222" /><rect y="16" width="24" height="3" rx="1.5" fill="#222" /></svg>
        </button>
      </div>
      <div className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <ul className="space-y-4">
          {profileData.map((profile, i) => (
            <li key={i} className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800">
              <div className="font-semibold text-lg">{profile.name}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
              <div className="text-sm text-gray-500">{profile.phone}</div>
            </li>
          ))}
        </ul>
      </div>
      <Navbar buttons={navbarButtons} />
    </div>
  );
} 