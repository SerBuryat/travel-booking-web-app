'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnyRequestView } from '@/lib/request/client/view/types';
import { RequestType } from '@/lib/request/requestType';
import { ClientAccommodationRequestViewComponent } from './ClientAccommodationRequestViewComponent';
import { ClientTransportRequestViewComponent } from './ClientTransportRequestViewComponent';
import { ClientEntertainmentRequestViewComponent } from './ClientEntertainmentRequestViewComponent';
import { ClientDefaultRequestViewComponent } from './ClientDefaultRequestViewComponent';

interface ClientRequestsListProps {
  requests: AnyRequestView[];
}

/**
 * Компонент списка заявок клиентов для провайдеров
 * 
 * Особенности:
 * - Collapsible дизайн: номер заявки + стрелка вниз
 * - При клике раскрывается детальная информация
 * - Разные компоненты для разных типов заявок
 */
export function ClientRequestsList({ requests }: ClientRequestsListProps) {
  const [expandedRequests, setExpandedRequests] = useState<Set<number>>(new Set());
  const router = useRouter();

  const toggleRequest = (requestId: number) => {
    setExpandedRequests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });
  };

  const handleProposalClick = (requestId: number) => {
    router.push(`/provider/requests/${requestId}/proposal`);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          Пока нет заявок от клиентов
        </div>
        <p className="text-gray-400 mt-2">
          Новые заявки будут появляться здесь, когда клиенты создадут запросы
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requests.map((request) => {
        const isExpanded = expandedRequests.has(request.id);
        
        return (
          <div
            key={request.id}
            className="bg-white rounded border border-gray-200 hover:shadow-sm transition-shadow"
          >
            {/* Заголовок заявки */}
            <button
              onClick={() => toggleRequest(request.id)}
              className="w-full px-3 py-2 text-center hover:bg-gray-50 transition-colors"
            >
              {/* Центрированная компоновка */}
              <div className="flex flex-col items-center">
                {/* Основная строка: номер + категория + бюджет + стрелка */}
                <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 flex-wrap gap-1">
                  <div className="px-1.5 py-0.5 bg-blue-100 rounded text-xs">
                    <span className="text-blue-600 font-medium">
                      №{request.number || request.id}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 min-w-0 flex-shrink">
                    {request.categoryName}
                  </h3>
                  <div className="text-sm font-semibold text-green-600">
                    {request.budget}₽
                  </div>
                  <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg
                      className="w-3 h-3 text-gray-400"
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
                  </div>
                </div>
                
                {/* Дополнительная информация */}
                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mt-1">
                  <span>{request.areaName}</span>
                  <span>•</span>
                  <span>{request.createdAt}</span>
                </div>
              </div>
            </button>

            {/* Детали заявки */}
            {isExpanded && (
              <div className="px-3 pb-3 border-t border-gray-100">
                <div className="pt-2">
                  {renderRequestComponent(request)}
                </div>
                
                {/* Кнопка отклика */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleProposalClick(request.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Откликнуться
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Рендерит соответствующий компонент для типа заявки
 */
function renderRequestComponent(request: AnyRequestView) {
  switch (request.requestType) {
    case RequestType.ACCOMMODATION:
      return <ClientAccommodationRequestViewComponent data={request as any} />;
    case RequestType.TRANSPORT:
      return <ClientTransportRequestViewComponent data={request as any} />;
    case RequestType.ENTERTAINMENT:
      return <ClientEntertainmentRequestViewComponent data={request as any} />;
    default:
      return <ClientDefaultRequestViewComponent data={request} />;
  }
}
