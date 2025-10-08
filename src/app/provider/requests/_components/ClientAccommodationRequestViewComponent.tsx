'use client';

import { AccomodationRequestView } from '@/lib/request/client/view/types';

interface ClientAccommodationRequestViewComponentProps {
  data: AccomodationRequestView;
}

/**
 * Компонент отображения заявки на размещение для провайдеров
 * 
 * Отображает:
 * - Даты заезда и выезда
 * - Количество взрослых и детей
 * - Бюджет и комментарий
 * - Статус заявки
 */
export function ClientAccommodationRequestViewComponent({ 
  data 
}: ClientAccommodationRequestViewComponentProps) {
  return (
    <div className="space-y-3">
      {/* Основная информация */}
      <div className="grid grid-cols-1 gap-3">
        {/* Даты */}
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
            Даты проживания
          </h4>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-gray-600">Заезд:</span>
              <span className="text-xs font-medium text-gray-900">
                {data.dateFrom || 'Не указано'}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-gray-600">Выезд:</span>
              <span className="text-xs font-medium text-gray-900">
                {data.dateTo || 'Не указано'}
              </span>
            </div>
          </div>
        </div>

        {/* Количество гостей */}
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
            Количество гостей
          </h4>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-gray-600">Взрослых:</span>
              <span className="text-xs font-medium text-gray-900">
                {data.adultsQty || 'Не указано'}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-gray-600">Детей:</span>
              <span className="text-xs font-medium text-gray-900">
                {data.kidsQty || 'Не указано'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Бюджет и статус */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
            Бюджет
          </h4>
          <div className="text-lg font-bold text-green-600">
            {data.budget} ₽
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
            Статус
          </h4>
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getStatusText(data.status)}
          </div>
        </div>
      </div>

      {/* Комментарий */}
      {data.comment && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
            Комментарий клиента
          </h4>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.comment}
            </p>
          </div>
        </div>
      )}

      {/* Дополнительная информация */}
      <div className="pt-3 border-t border-gray-200">
        <div className="space-y-1 text-xs text-gray-600">
          <div>
            <span className="font-medium">ID заявки:</span> #{data.id}
          </div>
          <div>
            <span className="font-medium">Создана:</span> {data.createdAt}
          </div>
          <div>
            <span className="font-medium">Регион:</span> {data.areaName}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Возвращает читаемый текст статуса заявки
 */
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'open': 'Открыта',
    'client_closed': 'Закрыта клиентом',
    'client_cancelled': 'Отменена клиентом',
    'system_cancelled': 'Отменена системой'
  };
  
  return statusMap[status] || status;
}
