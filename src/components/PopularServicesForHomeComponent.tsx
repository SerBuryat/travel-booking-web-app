'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShortViewServiceComponent } from './ShortViewServiceComponent';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
  priority: string;
}

interface PopularServicesForHomeComponentProps {
  services: Service[];
}

export const PopularServicesForHomeComponent: React.FC<PopularServicesForHomeComponentProps> = ({ services }) => {
  const router = useRouter();

  const handleAllServicesClick = () => {
    router.push('/catalog');
  };

  return (
    <div className="px-4 py-6">
      {/* Заголовок с кнопкой All */}
      <div className="flex justify-between items-center mb-4">
        <span 
          className="text-gray-700"
          style={{ 
            fontSize: '13px', 
            fontWeight: 400,
            fontFamily: 'Inter, sans-serif'
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