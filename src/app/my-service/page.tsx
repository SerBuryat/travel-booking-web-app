'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const myServices = [
  { name: 'Airport Transfer', price: '$30', rating: 4.7, description: 'Private transfer from airport to hotel.' },
  { name: 'Safari Adventure', price: '$200', rating: 4.9, description: 'Full-day safari with lunch included.' },
  { name: 'Wine Tasting', price: '$60', rating: 4.6, description: 'Tour of local vineyards and wine tasting.' },
];

function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-center bg-transparent z-50 pb-2">
      <div className="flex gap-12 bg-white/80 dark:bg-gray-900/80 rounded-full px-6 py-2 shadow-md">
        <Link href="/catalog" className="flex flex-col items-center">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className={pathname === '/catalog' ? 'text-blue-600 font-bold' : 'text-gray-500'}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="4" y="4" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
        </Link>
        <Link href="/my-service" className="flex flex-col items-center">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className={pathname === '/my-service' ? 'text-blue-600 font-bold' : 'text-gray-500'}><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/></svg>
        </Link>
      </div>
    </nav>
  );
}

export default function MyServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 sm:pb-0">
      {/* Hamburger for large screens */}
      <div className="hidden sm:block fixed top-4 left-4 z-50">
        <button className="rounded-full p-2 bg-transparent">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect y="5" width="24" height="3" rx="1.5" fill="#222"/><rect y="10.5" width="24" height="3" rx="1.5" fill="#222"/><rect y="16" width="24" height="3" rx="1.5" fill="#222"/></svg>
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
      <NavBar />
    </div>
  );
} 