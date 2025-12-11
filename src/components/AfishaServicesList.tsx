'use client';

import React from 'react';
import { AfishaServiceType } from '@/lib/service/searchAfisha';
import { useRouter } from 'next/navigation';

interface AfishaServicesListProps {
  services: AfishaServiceType[];
}

/**
 * Клиентский компонент для отображения списка сервисов афиши.
 * Сервисы отображаются в горизонтальном скролле.
 */
export const AfishaServicesList: React.FC<AfishaServicesListProps> = ({ services }) => {
  if (services.length === 0) {
    return (
      <div className="py-8 text-center">
        <p
          className="text-[#707579]"
          style={{
            fontSize: '14px',
            fontWeight: 400,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Скоро добавим интересные события для вашей локации
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Контейнер со скроллом */}
      <div
        className="overflow-x-auto scrollbar-hide"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
        }}
      >
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {services.map((service) => (
            <AfishaServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент карточки сервиса афиши.
 */
const AfishaServiceCard: React.FC<{ service: AfishaServiceType }> = ({ service }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/services/${service.id}`);
  };

  // Форматируем цену
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return 'Цена не указана';
    return `${Math.round(numPrice).toLocaleString('ru-RU')} ₽`;
  };

  return (
    <div
      className="bg-white rounded-[24px] overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
      style={{ fontFamily: 'Inter, sans-serif', width: 'calc(100vw - 6rem)', minWidth: 'calc(100vw - 6rem)', flexShrink: 0 }}
    >
      <div className="flex flex-col h-60">
        {/* Изображение сервиса */}
        <div
          className="w-full h-2/3 bg-cover bg-center"
          style={{
            backgroundImage: `url(${service.preview_photo_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Контент сервиса */}
        <div className="w-full h-1/3 p-4 flex flex-col justify-between">
          {/* Название */}
          <div className="mb-2">
            <h3
              className="text-black font-semibold line-clamp-2"
              style={{ fontWeight: 600, fontSize: '15px' }}
            >
              {service.name}
            </h3>
          </div>

          {/* Дата и цена */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: '#707579', fontWeight: 400 }}
            >
              {service.event_date}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: '#007AFF', fontWeight: 600 }}
            >
              {formatPrice(service.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

