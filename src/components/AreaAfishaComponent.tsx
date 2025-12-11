import React from 'react';
import { getAfishaServices } from '@/lib/service/searchAfisha';
import { AfishaServicesList } from './AfishaServicesList';
import { PAGE_ROUTES } from '@/utils/routes';

/**
 * Серверный компонент для получения и отображения списка сервисов афиши по текущей локации пользователя.
 * Сервисы отображаются в горизонтальном скролле.
 * Если сервисов нет, компонент не отображается.
 */
export const AreaAfishaComponent: React.FC = async () => {
  const services = await getAfishaServices();

  // Не отображаем раздел, если сервисов нет
  if (services.length === 0) {
    return null;
  }

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
            textTransform: 'uppercase',
          }}
        >
          АФИША
        </span>
        <a 
          href={PAGE_ROUTES.CATALOG.AFISHA_POPULAR}
          className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Все
        </a>
      </div>

      {/* Горизонтальный скролл сервисов */}
      <AfishaServicesList services={services} />
    </div>
  );
};

