'use client';

import { AnyRequestView } from '@/lib/request/client/view/types';

interface ClientDefaultRequestViewComponentProps {
  data: AnyRequestView;
}

/**
 * Компонент отображения заявки по умолчанию для провайдеров
 * 
 * Используется для заявок с неизвестным типом или как fallback
 * Отображает базовую информацию о заявке
 */
export function ClientDefaultRequestViewComponent({ 
  data 
}: ClientDefaultRequestViewComponentProps) {
  return (
    <div className="space-y-4">
      {/* Основная информация */}
      <div className="grid grid-cols-1 gap-4">
        {/* Тип заявки */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
            Тип заявки
          </h4>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-gray-600">Категория:</span>
            <span className="text-sm font-medium text-gray-900">
              {data.categoryName}
            </span>
          </div>
        </div>

        {/* Статус */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
            Статус
          </h4>
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getStatusText(data.status)}
          </div>
        </div>
      </div>

      {/* Бюджет */}
      <div className="space-y-1">
        <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide">
          Бюджет
        </h4>
        <div className="text-lg font-bold text-green-600">
          {data.budget} ₽
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

      {/* Предупреждение о неизвестном типе */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-yellow-800">
            Неизвестный тип заявки: {data.requestType}
          </span>
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
