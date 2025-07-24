import React from 'react';

const mockRequests = [
  {
    id: 1,
    serviceName: 'Safari Adventure',
    date: '2024-06-01',
    status: 'pending',
    provider: 'Wild Tours',
    price: '$200',
  },
  {
    id: 2,
    serviceName: 'Wine Tasting',
    date: '2024-06-05',
    status: 'confirmed',
    provider: 'Vineyard Co.',
    price: '$60',
  },
  {
    id: 3,
    serviceName: 'Airport Transfer',
    date: '2024-06-10',
    status: 'completed',
    provider: 'City Transport',
    price: '$30',
  },
];

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-white pb-24 sm:pb-0">
      <div className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4 text-black">My Requests</h1>
        <ul className="space-y-4">
          {mockRequests.map((req) => (
            <li key={req.id} className="rounded-lg border p-4 bg-gray-50">
              <div className="font-semibold text-lg text-black">{req.serviceName}</div>
              <div className="text-sm text-gray-500 mb-2">Provider: {req.provider}</div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-600">Date: {req.date}</span>
                <span className="text-blue-600">Price: {req.price}</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                req.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : req.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 