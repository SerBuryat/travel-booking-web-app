'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnyRequestView } from '@/lib/request/client/view/types';
import { RequestType } from '@/lib/request/requestType';
import { ClientAccommodationRequestViewComponent } from './ClientAccommodationRequestViewComponent';
import { ClientTransportRequestViewComponent } from './ClientTransportRequestViewComponent';
import { ClientEntertainmentRequestViewComponent } from './ClientEntertainmentRequestViewComponent';
import { ClientDefaultRequestViewComponent } from './ClientDefaultRequestViewComponent';
import { ClientFoodRequestViewComponent } from './ClientFoodRequestViewComponent';
import { ClientHealthRequestViewComponent } from './ClientHealthRequestViewComponent';
import { ClientPackageRequestViewComponent } from './ClientPackageRequestViewComponent';
import { ProviderClientRequestItem } from '@/lib/request/provider/clientRequestsForProvider';
import { markAlertsAsRead } from '@/lib/request/provider/alerts';

type FilterOption = 'all' | 'new' | 'awaiting' | 'responded' | 'archived';

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новые' },
  { key: 'awaiting', label: 'Ждут отклика' },
  { key: 'responded', label: 'Откликались' },
  { key: 'archived', label: 'Архив' },
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
    return requests.filter(item => {
      const { request, isAlertForRequestRead, hasProviderProposal } = item;
      const isRequestRead = isAlertForRequestRead;
      const isArchived = request.status !== 'open';

      switch (filter) {
        case 'new':
          return !isRequestRead;
        case 'awaiting':
          return request.status === 'open' && !hasProviderProposal;
        case 'responded':
          return request.status === 'open' && hasProviderProposal;
        case 'archived':
          return isArchived;
        default:
          return true;
      }
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
      <div className="mb-3 overflow-x-auto scrollbar-hide">
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
        <div className="space-y-3">
          {visibleRequests.map(({ request, isAlertForRequestRead }) => {
            const isRequestRead = isAlertForRequestRead;
            const isExpanded = expandedRequests.has(request.id);
            const isArchived = request.status !== 'open';
            const requestTitleColor = isArchived
              ? 'text-gray-400'
              : isExpanded
                ? 'text-[#007AFF]'
                : 'text-[#131313]';

            return (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Заголовок заявки */}
                <button
                  onClick={() => toggleRequest(request.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 flex items-center gap-2 text-left">
                    {!isRequestRead && (
                      <span className="relative inline-flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#007AFF] opacity-80" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#005FCC]" />
                      </span>
                    )}
                    <span className={`text-[16px] font-semibold transition-colors ${requestTitleColor}`}>
                      Заявка {request.number || request.id}
                    </span>
                    {isArchived && (
                      <span className="text-xs text-gray-400">(архив)</span>
                    )}
                  </div>
                  <div className={`ml-3 flex items-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg
                      className="w-4 h-4 text-black"
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
                </button>

                {/* Детали заявки */}
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="pt-3">
                      {renderRequestComponent(request)}
                    </div>
                    <div className="mt-3 text-xs text-gray-400 text-right">
                      Создано {request.createdAt}
                    </div>
                    {/* Кнопка отклика */}
                    <div className="mt-4">
                      <button
                        onClick={() => handleProposalClick(request.id)}
                        className="w-full text-black transition-transform hover:scale-[1.01]"
                        style={{ backgroundColor: '#95E59D', borderRadius: 30, fontSize: 17, fontWeight: 400, padding: '10px 16px' }}
                      >
                        Посмотреть
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
    case RequestType.FOOD:
      return <ClientFoodRequestViewComponent data={request as any} />;
    case RequestType.HEALTH:
      return <ClientHealthRequestViewComponent data={request as any} />;
    case RequestType.PACKAGE:
      return <ClientPackageRequestViewComponent data={request as any} />;
    default:
      return <ClientDefaultRequestViewComponent data={request} />;
  }
}
