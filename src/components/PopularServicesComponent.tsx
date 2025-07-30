'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShortViewServiceComponent } from './ShortViewServiceComponent';
import { ServiceType } from '@/model/ServiceType';

interface PopularServicesComponentProps {
  services: ServiceType[];
}

export const PopularServicesComponent: React.FC<PopularServicesComponentProps> = ({ 
  services
}) => {
  const router = useRouter();

  const handleAllServicesClick = () => {
    router.push('/services/popular');
  };

  return (
    <div className="px-4 py-6">
      {/* Заголовок с кнопкой All */}
      <div className="flex justify-between items-center mb-4">
        <span 
          className="text-[#707579]"
          style={{ 
            fontSize: '13px', 
            fontWeight: 400,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase'
          }}
        >
          Popular
        </span>
        <button
          onClick={handleAllServicesClick}
          className="text-blue-600 font-semibold hover:underline"
          style={{ 
            fontSize: '16px', 
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          All
        </button>
      </div>

      {/* Список популярных сервисов в 2 колонки */}
      <div className="grid grid-cols-2 gap-3">
        {services.map((service) => (
          <ShortViewServiceComponent
            key={service.id}
            service={service}
          />
        ))}
      </div>
    </div>
  );
}; 