'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

type OrderListItemProps = {
  serviceId: number;
  name: string;
  respondedAt: Date;
  itemIndex: number;
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

export default function OrderListItem({ serviceId, name, respondedAt, itemIndex }: OrderListItemProps) {
  const router = useRouter();
  const gradient = gradientPool[itemIndex % gradientPool.length];

  return (
    <button
      onClick={() => router.push(`/services/${serviceId}`)}
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
    >
      <div
        className="w-12 h-12 rounded-lg flex-shrink-0"
        style={{ background: gradient }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-gray-900 font-medium truncate">{name}</div>
        <div className="text-gray-500 text-sm">{formatMonthYear(respondedAt)}</div>
      </div>
      <div className="text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}


