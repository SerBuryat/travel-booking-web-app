'use client';

import React from 'react';
import {ShortViewServiceComponent} from './ShortViewServiceComponent';
import {ServiceType} from '@/model/ServiceType';
import {PAGE_ROUTES} from '@/utils/routes';

interface PopularServicesComponentProps {
  services: ServiceType[];
}

export const PopularServicesComponent: React.FC<PopularServicesComponentProps> = ({ 
  services
}) => {
  return (
    <div className="px-4 py-4">
      {/* Заголовок с кнопкой "Все" */}
      <div className="mb-4 flex justify-between items-center">
        <span 
          className="text-[#707579]"
          style={{ 
            fontSize: '13px', 
            fontWeight: 400,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase'
          }}
        >
          Популярное
        </span>
        <a 
          href={PAGE_ROUTES.CATALOG.POPULAR}
          className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Все
        </a>
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