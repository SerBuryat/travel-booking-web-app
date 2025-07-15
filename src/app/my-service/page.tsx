'use client';

import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/navbar/Navbar';

const myServices = [
  { name: 'Airport Transfer', price: '$30', rating: 4.7, description: 'Private transfer from airport to hotel.' },
  { name: 'Safari Adventure', price: '$200', rating: 4.9, description: 'Full-day safari with lunch included.' },
  { name: 'Wine Tasting', price: '$60', rating: 4.6, description: 'Tour of local vineyards and wine tasting.' },
];

const navbarButtons = [
  {
    href: '/catalog',
    icon: <Image src="/catalog-icon.svg" alt="Catalog" width={28} height={28} />,
    title: 'Catalog',
  },
  {
    href: '/my-service',
    icon: <Image src="/my-service-icon.svg" alt="My Service" width={28} height={28} />,
    title: 'My services',
  },
];

export default function MyServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 sm:pb-0">
      {/* Hamburger for large screens */}
      <div className="hidden sm:block fixed top-4 left-4 z-50">
        <button className="rounded-full p-2 bg-transparent">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect y="5" width="24" height="3" rx="1.5" fill="#222" /><rect y="10.5" width="24" height="3" rx="1.5" fill="#222" /><rect y="16" width="24" height="3" rx="1.5" fill="#222" /></svg>
        </button>
      </div>
      <div className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">My Service</h1>
        <ul className="space-y-4">
          {myServices.map((s, i) => (
            <li key={i} className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800">
              <div className="font-semibold text-lg">{s.name}</div>
              <div className="text-sm text-gray-500">{s.description}</div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Price: {s.price}</span>
                <span>⭐ {s.rating}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Navbar buttons={navbarButtons} />
    </div>
  );
} 