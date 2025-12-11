'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AfishaServiceType } from '@/lib/service/searchAfisha';
import { formatDateTime } from '@/utils/date';

interface AfishaShortViewServiceComponentProps {
  service: AfishaServiceType;
  onClick?: (service: AfishaServiceType) => void;
}

export const AfishaShortViewServiceComponent: React.FC<AfishaShortViewServiceComponentProps> = ({ 
  service, onClick
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(service);
    } else {
      // Navigate to service page
      router.push(`/services/${service.id}`);
    }
  };

  // Форматируем дату события
  const formatEventDate = (dateStr: string | null) => {
    if (!dateStr) return 'Дата уточняется';
    return formatDateTime(dateStr);
  };

  return (
    <div 
      className="bg-white rounded-[24px] overflow-hidden shadow-lg cursor-pointer w-40"
      onClick={handleClick}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Service photo header */}
      <div 
        className="h-40 w-full"
        style={{
          backgroundImage: `url(${service.preview_photo_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Service content */}
      <div className="p-3">
        <h3 
          className="text-black font-semibold mb-1 line-clamp-2"
          style={{ fontWeight: 600 }}
        >
          {service.name}
        </h3>
        {/* Дата события */}
        <div className="flex items-center gap-1.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#707579"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span 
            className="text-xs"
            style={{ color: '#707579', fontWeight: 400 }}
          >
            {formatEventDate(service.event_date)}
          </span>
        </div>
      </div>
    </div>
  );
};

