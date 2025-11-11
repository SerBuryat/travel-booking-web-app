'use client';

import { useState } from 'react';
import { AnyRequestView } from '@/lib/request/client/view/types';
import { RequestType } from '@/lib/request/requestType';

interface RequestDetailsProps {
  request: AnyRequestView;
}

/**
 * Компонент для отображения деталей заявки клиента с возможностью раскрытия
 */
export function RequestDetails({ request }: RequestDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-3">
      {/* Основная информация - компактная сетка */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500">Категория</label>
          <p className="text-sm text-gray-900 font-medium">{request.categoryName}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Бюджет</label>
          <p className="text-sm text-green-600 font-semibold">
            {request.budget}₽
          </p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Регион</label>
          <p className="text-sm text-gray-900">{request.areaName}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Дата</label>
          <p className="text-sm text-gray-900">{request.createdAt}</p>
        </div>
      </div>

      {/* Комментарий клиента - компактный */}
      {request.comment && (
        <div>
          <label className="text-xs font-medium text-gray-500">Комментарий</label>
          <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded text-xs leading-relaxed">
            {request.comment}
          </p>
        </div>
      )}

      {/* Компактная кнопка раскрытия */}
      <div className="border-t border-gray-200 pt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <span className="text-xs font-medium text-gray-600">
            Показать детали
          </span>
          <svg
            className={`w-3 h-3 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Дополнительные детали - компактные */}
        {isExpanded && (
          <div className="mt-3 space-y-3">
            {renderRequestSpecificDetails(request)}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Рендерит специфичные для типа заявки детали
 */
function renderRequestSpecificDetails(request: AnyRequestView) {
  switch (request.requestType) {
    case RequestType.ACCOMMODATION:
      return renderAccommodationDetails(request as any);
    case RequestType.TRANSPORT:
      return renderTransportDetails(request as any);
    case RequestType.ENTERTAINMENT:
      return renderEntertainmentDetails(request as any);
    default:
      return null;
  }
}

function renderAccommodationDetails(request: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {request.dateFrom && (
        <div>
          <label className="text-xs font-medium text-gray-500">Заезд</label>
          <p className="text-sm text-gray-900">{request.dateFrom}</p>
        </div>
      )}
      {request.dateTo && (
        <div>
          <label className="text-xs font-medium text-gray-500">Выезд</label>
          <p className="text-sm text-gray-900">{request.dateTo}</p>
        </div>
      )}
      {request.adultsQty && (
        <div>
          <label className="text-xs font-medium text-gray-500">Взрослые</label>
          <p className="text-sm text-gray-900">{request.adultsQty}</p>
        </div>
      )}
      {request.kidsQty && (
        <div>
          <label className="text-xs font-medium text-gray-500">Дети</label>
          <p className="text-sm text-gray-900">{request.kidsQty}</p>
        </div>
      )}
    </div>
  );
}

function renderTransportDetails(request: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {request.provisionTime && (
        <div>
          <label className="text-xs font-medium text-gray-500">Время</label>
          <p className="text-sm text-gray-900">{request.provisionTime}</p>
        </div>
      )}
      {request.adultsQty && (
        <div>
          <label className="text-xs font-medium text-gray-500">Взрослые</label>
          <p className="text-sm text-gray-900">{request.adultsQty}</p>
        </div>
      )}
      {request.kidsQty && (
        <div>
          <label className="text-xs font-medium text-gray-500">Дети</label>
          <p className="text-sm text-gray-900">{request.kidsQty}</p>
        </div>
      )}
    </div>
  );
}

function renderEntertainmentDetails(request: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {request.provisionTime && (
        <div>
          <label className="text-xs font-medium text-gray-500">Время</label>
          <p className="text-sm text-gray-900">{request.provisionTime}</p>
        </div>
      )}
      {request.adultsQty && (
        <div>
          <label className="text-xs font-medium text-gray-500">Взрослые</label>
          <p className="text-sm text-gray-900">{request.adultsQty}</p>
        </div>
      )}
      {request.kidsQty && (
        <div>
          <label className="text-xs font-medium text-gray-500">Дети</label>
          <p className="text-sm text-gray-900">{request.kidsQty}</p>
        </div>
      )}
    </div>
  );
}
