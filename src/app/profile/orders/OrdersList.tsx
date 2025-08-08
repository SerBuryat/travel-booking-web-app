'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

type OrderItem = {
  serviceId: number;
  name: string;
  respondedAt: Date;
};

const gradientPool = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}

export default function OrdersList() {
  const router = useRouter();

  const orders: OrderItem[] = useMemo(
    () => [
      {
        serviceId: 14,
        name: 'Сервис №14',
        respondedAt: new Date('2025-02-10'),
      },
      {
        serviceId: 18,
        name: 'Сервис №18',
        respondedAt: new Date('2024-07-05'),
      },
    ],
    []
  );

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
      {orders.map((order, index) => {
        const gradient = gradientPool[index % gradientPool.length];
        return (
          <button
            key={order.serviceId}
            onClick={() => router.push(`/services/${order.serviceId}`)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
          >
            <div
              className="w-12 h-12 rounded-lg flex-shrink-0"
              style={{ background: gradient }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 font-medium truncate">{order.name}</div>
              <div className="text-gray-500 text-sm">
                {formatMonthYear(order.respondedAt)}
              </div>
            </div>
            <div className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        );
      })}
    </div>
  );
}


