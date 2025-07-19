'use client';

import React from 'react';

const services = [
  { name: 'Airport Transfer', price: '$30', rating: 4.7, description: 'Private transfer from airport to hotel.' },
  { name: 'Safari Adventure', price: '$200', rating: 4.9, description: 'Full-day safari with lunch included.' },
  { name: 'Wine Tasting', price: '$60', rating: 4.6, description: 'Tour of local vineyards and wine tasting.' },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white pb-24 sm:pb-0">
      <div className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Services</h1>
        <ul className="space-y-4">
          {services.map((s, i) => (
            <li key={i} className="rounded-lg border p-4 bg-gray-50">
              <div className="font-semibold text-lg  text-black">{s.name}</div>
              <div className="text-sm text-gray-500">{s.description}</div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-blue-600">Price: {s.price}</span>
                <span className="text-blue-600">⭐ {s.rating}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 