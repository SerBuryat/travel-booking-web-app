'use client';

import React from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import HomeIcon from '@/components/navbar/HomeIcon';
import CatalogIcon from '@/components/navbar/CatalogIcon';
import MyServiceIcon from '@/components/navbar/MyServiceIcon';
import MyProfileIcon from '@/components/navbar/MyProfileIcon';

const homeData = [
  { title: 'Welcome Back!', subtitle: 'Ready to explore today?', status: 'Active' },
  { title: 'Recent Activity', subtitle: '3 new notifications', status: 'New' },
  { title: 'Quick Actions', subtitle: 'Book your next adventure', status: 'Available' },
];

const navbarButtons = [
  {
    href: '/home',
    icon: HomeIcon,
    title: 'Home',
  },
  {
    href: '/catalog',
    icon: CatalogIcon,
    title: 'Catalog',
  },
  {
    href: '/my-service',
    icon: MyServiceIcon,
    title: 'Services',
  },
  {
    href: '/my-profile',
    icon: MyProfileIcon,
    title: 'Profile',
    badgeContent: 4,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 sm:pb-0">
      {/* Hamburger for large screens */}
      <div className="hidden sm:block fixed top-4 left-4 z-50">
        <button className="rounded-full p-2 bg-transparent">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect y="5" width="24" height="3" rx="1.5" fill="#222" /><rect y="10.5" width="24" height="3" rx="1.5" fill="#222" /><rect y="16" width="24" height="3" rx="1.5" fill="#222" /></svg>
        </button>
      </div>
      <div className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Home</h1>
        <ul className="space-y-4">
          {homeData.map((item, i) => (
            <li key={i} className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800">
              <div className="font-semibold text-lg">{item.title}</div>
              <div className="text-sm text-gray-500">{item.subtitle}</div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Status: {item.status}</span>
                <span className="text-blue-600">→</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Navbar buttons={navbarButtons} />
    </div>
  );
} 