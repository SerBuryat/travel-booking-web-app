'use client';

import React from 'react';

const homeData = [
  { title: 'Welcome Back!', subtitle: 'Ready to explore today?', status: 'Active' },
  { title: 'Recent Activity', subtitle: '3 new notifications', status: 'New' },
  { title: 'Quick Actions', subtitle: 'Book your next adventure', status: 'Available' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-24 sm:pb-0">
      <div className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Home</h1>
        <ul className="space-y-4">
          {homeData.map((item, i) => (
            <li key={i} className="rounded-lg border p-4 bg-gray-100">
              <div className="font-semibold text-lg text-black">{item.title}</div>
              <div className="text-sm text-gray-500">{item.subtitle}</div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-blue-600">Status: {item.status}</span>
                <span className="text-blue-600">→</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 