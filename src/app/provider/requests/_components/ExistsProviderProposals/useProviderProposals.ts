'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchProposals, ProviderProposal } from '@/lib/request/provider/proposal/searchProposals';

export interface UseProviderProposalsReturn {
  proposals: ProviderProposal[];
  isLoading: boolean;
  error: string | null;
  loadProposals: () => Promise<void>;
}

/**
 * Custom hook для загрузки proposals провайдера по requestId
 * 
 * Загружает proposals только когда requestId и providerId заданы
 * Данные загружаются автоматически при монтировании компонента
 */
export function useProviderProposals(
  requestId: number | null,
  providerId: number | null
): UseProviderProposalsReturn {
  const [proposals, setProposals] = useState<ProviderProposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProposals = useCallback(async () => {
    if (!requestId || !providerId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchProposals(requestId, providerId);
      setProposals(data);
    } catch (err) {
      console.error('Failed to load proposals:', err);
      setError('Не удалось загрузить Ваши отклики по данной заявке, попробуйте перезагрузить страницу');
    } finally {
      setIsLoading(false);
    }
  }, [requestId, providerId]);

  useEffect(() => {
    if (requestId && providerId) {
      void loadProposals();
    }
  }, [requestId, providerId, loadProposals]);

  return {
    proposals,
    isLoading,
    error,
    loadProposals,
  };
}
