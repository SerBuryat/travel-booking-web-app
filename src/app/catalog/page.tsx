'use client';

import React from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { getNavbarButtons } from '@/components/navbar/navbarConfig';

const services = [
  { name: 'City Tour', price: '$50', rating: 4.5, description: 'Explore the city highlights with a local guide.' },
  { name: 'Mountain Hike', price: '$120', rating: 4.8, description: 'Guided hike in the beautiful mountains.' },
  { name: 'Beach Relax', price: '$80', rating: 4.2, description: 'Day at the private beach with amenities.' },
];

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 sm:pb-0">
      {/* Hamburger for large screens */}
      <div className="hidden sm:block fixed top-4 left-4 z-50">
        <button className="rounded-full p-2 bg-transparent">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect y="5" width="24" height="3" rx="1.5" fill="#222" /><rect y="10.5" width="24" height="3" rx="1.5" fill="#222" /><rect y="16" width="24" height="3" rx="1.5" fill="#222" /></svg>
        </button>
      </div>
      <div className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Catalog</h1>
        <ul className="space-y-4">
          {services.map((s, i) => (
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
      <Navbar buttons={getNavbarButtons()} />
    </div>
  );
} 