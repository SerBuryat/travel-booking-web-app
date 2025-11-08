'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnyRequestView } from '@/lib/request/client/view/types';
import { RequestType } from '@/lib/request/requestType';
import { ClientAccommodationRequestViewComponent } from './ClientAccommodationRequestViewComponent';
import { ClientTransportRequestViewComponent } from './ClientTransportRequestViewComponent';
import { ClientEntertainmentRequestViewComponent } from './ClientEntertainmentRequestViewComponent';
import { ClientDefaultRequestViewComponent } from './ClientDefaultRequestViewComponent';
import { ProviderClientRequestItem } from '@/lib/request/provider/clientRequestsForProvider';
import { markAlertsAsRead } from '@/lib/request/provider/alerts';

type FilterOption = 'all' | 'new' | 'read';

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новые' },
  { key: 'read', label: 'Отвеченные' },
];

interface ClientRequestsListProps {
  providerId: number | null;
  requests: ProviderClientRequestItem[];
}

/**
 * Компонент списка заявок клиентов для провайдеров
 * 
 * Особенности:
 * - Collapsible дизайн: номер заявки + стрелка вниз
 * - При клике раскрывается детальная информация
 * - Разные компоненты для разных типов заявок
 */
export function ClientRequestsList({ providerId, requests }: ClientRequestsListProps) {
  const [expandedRequests, setExpandedRequests] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<FilterOption>('all');
  const router = useRouter();

  const requestMap = useMemo(() => {
    const map = new Map<number, ProviderClientRequestItem>();
    requests.forEach(item => {
      map.set(item.request.id, item);
    });
    return map;
  }, [requests]);

  const markAsRead = useCallback(
    (requestId: number) => {
      const requestItem = requestMap.get(requestId);
      if (!requestItem || requestItem.isAlertForRequestRead) {
        return;
      }
      if (!providerId) {
        return;
      }

      void markAlertsAsRead(providerId, requestId).catch(error => {
        console.error(`Failed to mark alerts as read for provider ${providerId} and request ${requestId}`, error);
      });
    },
    [providerId, requestMap]
  );

  const toggleRequest = (requestId: number) => {
    const isCurrentlyExpanded = expandedRequests.has(requestId);

    setExpandedRequests(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyExpanded) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });

    if (!isCurrentlyExpanded) {
      markAsRead(requestId);
    }
  };

  const handleProposalClick = (requestId: number) => {
    router.push(`/provider/requests/${requestId}/proposal`);
  };

  const visibleRequests = useMemo(() => {
    return requests.filter(({ request, isAlertForRequestRead }) => {
      const isRequestRead = isAlertForRequestRead;
      if (filter === 'new') {
        return !isRequestRead;
      }

      if (filter === 'read') {
        return isRequestRead;
      }

      return true;
    });
  }, [requests, filter]);

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
    <div className="space-y-3">
      <div className="mb-3 overflow-x-auto">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          {FILTER_OPTIONS.map(option => {
            const isActive = filter === option.key;
            return (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${isActive ? 'text-white' : ''}`}
                style={{
                  backgroundColor: isActive ? '#B0D5FD' : '#F5F5F5',
                  color: '#000000',
                  fontWeight: 500
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {visibleRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Нет заявок по выбранному фильтру
          </div>
          <p className="text-gray-400 mt-2">
            Попробуйте выбрать другой фильтр
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleRequests.map(({ request, isAlertForRequestRead }) => {
            const isRequestRead = isAlertForRequestRead;
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
                    <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 flex-wrap gap-1 text-xs">
                      {!isRequestRead && (
                        <span className="px-1.5 py-0.5 bg-blue-500 text-white rounded-full uppercase tracking-wide">
                          Новое
                        </span>
                      )}
                      <div className="px-1.5 py-0.5 bg-blue-100 rounded">
                        <span className="text-blue-600 font-medium">
                          №{request.number || request.id}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 min-w-0 flex-shrink text-xs sm:text-sm">
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
      )}
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
