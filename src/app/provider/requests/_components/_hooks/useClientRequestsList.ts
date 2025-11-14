import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProviderClientRequestItem } from '@/lib/request/provider/clientRequestsForProvider';
import { markAlertsAsRead } from '@/lib/request/provider/alerts';

export type FilterOption = 'all' | 'new' | 'awaiting' | 'responded' | 'archived';

export interface UseClientRequestsListReturn {
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  visibleRequests: ProviderClientRequestItem[];
  expandedRequests: Set<number>;
  toggleRequest: (requestId: number) => void;
  handleProposalClick: (requestId: number) => void;
}

/**
 * Custom hook для управления списком заявок клиентов
 * 
 * Обрабатывает:
 * - Фильтрацию заявок
 * - Раскрытие/сворачивание заявок
 * - Отметку заявок как прочитанных
 * - Навигацию к предложению
 */
export function useClientRequestsList(
  providerId: number | null,
  requests: ProviderClientRequestItem[]
): UseClientRequestsListReturn {
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

  const toggleRequest = useCallback(
    (requestId: number) => {
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
    },
    [expandedRequests, markAsRead]
  );

  const handleProposalClick = useCallback(
    (requestId: number) => {
      router.push(`/provider/requests/${requestId}/proposal`);
    },
    [router]
  );

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
          return hasProviderProposal;
        case 'archived':
          return isArchived;
        default:
          return true;
      }
    });
  }, [requests, filter]);

  return {
    filter,
    setFilter,
    visibleRequests,
    expandedRequests,
    toggleRequest,
    handleProposalClick,
  };
}

