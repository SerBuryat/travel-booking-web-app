import React from 'react';

const services = [
  { name: 'City Tour', price: '$50', rating: 4.5, description: 'Explore the city highlights with a local guide.' },
  { name: 'Mountain Hike', price: '$120', rating: 4.8, description: 'Guided hike in the beautiful mountains.' },
  { name: 'Beach Relax', price: '$80', rating: 4.2, description: 'Day at the private beach with amenities.' },
];

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 sm:pb-0">
      {/* Sticky hamburger for large screens */}
      <div className="hidden sm:block fixed top-4 left-4 z-50">
        <button className="rounded-full p-3 bg-gray-200 dark:bg-gray-800 shadow-lg">
          <span role="img" aria-label="menu">🍔</span>
        </button>
      </div>
      {/* Sticky bottom nav for mobile */}
      <div className="sm:hidden fixed bottom-4 left-0 w-full flex justify-center z-50">
        <div className="flex gap-4">
          <button className="rounded-full p-4 bg-blue-500 text-white shadow-lg"><span role="img" aria-label="catalog">📚</span></button>
          <button className="rounded-full p-4 bg-green-500 text-white shadow-lg"><span role="img" aria-label="service">🛎️</span></button>
        </div>
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
    </div>
  );
} 