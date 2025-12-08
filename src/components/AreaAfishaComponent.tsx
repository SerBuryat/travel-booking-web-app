import React from 'react';
import { getAfishaServices } from '@/lib/service/searchAfisha';
import { AfishaServicesList } from './AfishaServicesList';

/**
 * Серверный компонент для получения и отображения списка сервисов афиши по текущей локации пользователя.
 * Сервисы отображаются в горизонтальном скролле.
 */
export const AreaAfishaComponent: React.FC = async () => {
  const services = await getAfishaServices();

  return (
    <div className="px-4 py-4">
      {/* Заголовок */}
      <div className="mb-4">
        <span
          className="text-[#707579]"
          style={{
            fontSize: '13px',
            fontWeight: 400,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          АФИША
        </span>
      </div>

      {/* Горизонтальный скролл сервисов или сообщение об отсутствии */}
      <AfishaServicesList services={services} />
    </div>
  );
};

