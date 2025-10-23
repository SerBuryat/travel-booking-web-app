'use client';

import React from 'react';
import {ShortViewServiceComponent} from './ShortViewServiceComponent';
import {ServiceType} from '@/model/ServiceType';
import {PAGE_ROUTES} from '@/utils/routes';

interface MoveToAllButton {
  text: string;
  href: string;
}

interface VerticalServicesViewComponentProps {
  services: ServiceType[];
  title?: string;
  moveToAllButton?: MoveToAllButton;
}

export const VerticalServicesViewComponent: React.FC<VerticalServicesViewComponentProps> = ({
  services,
  title,
  moveToAllButton
}) => {
  return (
    <div className="px-4 py-4">
      {/* Заголовок с кнопкой (показываем только если есть title или moveToAllButton) */}
      {(title || moveToAllButton) && (
        <div className="mb-4 flex justify-between items-center">
          {title && (
            <span 
              className="text-[#707579]"
              style={{ 
                fontSize: '13px', 
                fontWeight: 400,
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase'
              }}
            >
              {title}
            </span>
          )}
          {moveToAllButton && (
            <a 
              href={moveToAllButton.href}
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {moveToAllButton.text}
            </a>
          )}
        </div>
      )}

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