'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AfishaServiceType } from '@/lib/service/searchAfisha';

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
    return dateStr;
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
        <p 
          className="text-xs"
          style={{ color: '#707579', fontWeight: 400 }}
        >
          {formatEventDate(service.event_date)}
        </p>
      </div>
    </div>
  );
};

