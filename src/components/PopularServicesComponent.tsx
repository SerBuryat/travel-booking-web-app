'use client';

import React from 'react';
import {ShortViewServiceComponent} from './ShortViewServiceComponent';
import {ServiceType} from '@/model/ServiceType';

interface PopularServicesComponentProps {
  services: ServiceType[];
}

export const PopularServicesComponent: React.FC<PopularServicesComponentProps> = ({ 
  services
}) => {
  return (
    <div className="px-4 py-6">
      {/* Заголовок */}
      <div className="mb-4">
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