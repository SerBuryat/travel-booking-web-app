'use client';

import { AnyRequestView } from '@/lib/request/client/view/types';
import { RequestType } from '@/lib/request/requestType';

interface RequestDetailsProps {
  request: AnyRequestView;
}

/**
 * Компонент для отображения деталей заявки клиента
 */
export function RequestDetails({ request }: RequestDetailsProps) {
  return (
    <div className="space-y-3">
      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Категория</label>
          <p className="text-sm text-gray-900">{request.categoryName}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Бюджет</label>
          <p className="text-sm text-gray-900 font-semibold text-green-600">
            {request.budget}₽
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Регион</label>
          <p className="text-sm text-gray-900">{request.areaName}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Дата создания</label>
          <p className="text-sm text-gray-900">{request.createdAt}</p>
        </div>
      </div>

      {/* Комментарий клиента */}
      {request.comment && (
        <div>
          <label className="text-sm font-medium text-gray-500">Комментарий клиента</label>
          <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
            {request.comment}
          </p>
        </div>
      )}

      {/* Дополнительные атрибуты в зависимости от типа заявки */}
      {renderRequestSpecificDetails(request)}
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {request.dateFrom && (
        <div>
          <label className="text-sm font-medium text-gray-500">Дата заезда</label>
          <p className="text-sm text-gray-900">{request.dateFrom}</p>
        </div>
      )}
      {request.dateTo && (
        <div>
          <label className="text-sm font-medium text-gray-500">Дата выезда</label>
          <p className="text-sm text-gray-900">{request.dateTo}</p>
        </div>
      )}
      {request.adultsQty && (
        <div>
          <label className="text-sm font-medium text-gray-500">Количество взрослых</label>
          <p className="text-sm text-gray-900">{request.adultsQty}</p>
        </div>
      )}
      {request.kidsQty && (
        <div>
          <label className="text-sm font-medium text-gray-500">Количество детей</label>
          <p className="text-sm text-gray-900">{request.kidsQty}</p>
        </div>
      )}
    </div>
  );
}

function renderTransportDetails(request: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {request.provisionTime && (
        <div>
          <label className="text-sm font-medium text-gray-500">Время предоставления</label>
          <p className="text-sm text-gray-900">{request.provisionTime}</p>
        </div>
      )}
      {request.adultsQty && (
        <div>
          <label className="text-sm font-medium text-gray-500">Количество взрослых</label>
          <p className="text-sm text-gray-900">{request.adultsQty}</p>
        </div>
      )}
      {request.kidsQty && (
        <div>
          <label className="text-sm font-medium text-gray-500">Количество детей</label>
          <p className="text-sm text-gray-900">{request.kidsQty}</p>
        </div>
      )}
    </div>
  );
}

function renderEntertainmentDetails(request: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {request.provisionTime && (
        <div>
          <label className="text-sm font-medium text-gray-500">Время предоставления</label>
          <p className="text-sm text-gray-900">{request.provisionTime}</p>
        </div>
      )}
      {request.adultsQty && (
        <div>
          <label className="text-sm font-medium text-gray-500">Количество взрослых</label>
          <p className="text-sm text-gray-900">{request.adultsQty}</p>
        </div>
      )}
      {request.kidsQty && (
        <div>
          <label className="text-sm font-medium text-gray-500">Количество детей</label>
          <p className="text-sm text-gray-900">{request.kidsQty}</p>
        </div>
      )}
    </div>
  );
}
