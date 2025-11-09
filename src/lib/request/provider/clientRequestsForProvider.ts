'use server';

import { withUserAuth } from '@/lib/auth/withUserAuth';
import { prisma } from '@/lib/db/prisma';
import { requestById } from '@/lib/request/client/view/requestById';
import { AnyRequestView } from '@/lib/request/client/view/types';
import { getActiveProviderId } from '@/lib/provider/searchProvider';

export interface ProviderClientRequestItem {
  request: AnyRequestView;
  isAlertForRequestRead: boolean;
  hasProviderProposal: boolean;
}

/**
 * Получает список заявок клиентов, подходящих для текущего провайдера.
 * 
 * Логика работы:
 * 1. Проверяет аутентификацию и роль пользователя (должен быть provider)
 * 2. Получает tproviders запись для пользователя
 * 3. Находит все talerts записи по tproviders_id
 * 4. Извлекает tbids_id из алертов
 * 5. Для каждой заявки получает детали через requestById
 * 
 * @returns Promise<ProviderClientRequestItem[]> - массив заявок клиентов
 * @returns null - если пользователь не аутентифицирован или не провайдер
 */
export async function getClientRequestsForProvider(): Promise<ProviderClientRequestItem[] | null> {
  return withUserAuth(async ({ userAuth }) => {
    if (userAuth.role !== 'provider') {
      return null;
    }

    const provider = await getActiveProviderId(userAuth.userId);
    if (!provider) {
      return [];
    }

    // Получаем все алерты для провайдера
    const alerts = await getAlertsForProvider(provider.id);
    if (alerts.length === 0) {
      return [];
    }

    // Извлекаем уникальные ID заявок
    const alertMap = new Map<number, boolean>();
    alerts.forEach(alert => {
      const current = alertMap.get(alert.tbids_id);
      if (current === undefined) {
        alertMap.set(alert.tbids_id, alert.is_read);
        return;
      }
      if (!current && alert.is_read) {
        return;
      }
      if (current && !alert.is_read) {
        alertMap.set(alert.tbids_id, false);
      }
    });

    const bidIds = [...alertMap.keys()];

    const bidIdsWithProposals = await getBidIdsWithProviderProposals({
      bidIds,
      providerId: provider.id
    });

    // Получаем детали каждой заявки
    const requests = await Promise.all(
      bidIds.map(async bidId => {
        const request = await getRequestDetails(bidId, userAuth);
        if (!request) {
          return null;
        }
        return {
          request,
          isAlertForRequestRead: alertMap.get(bidId) ?? false,
          hasProviderProposal: bidIdsWithProposals.has(bidId)
        };
      })
    );

    // Фильтруем успешно полученные заявки
    const validRequests = requests.filter(
      (item): item is ProviderClientRequestItem => item !== null
    );

    // Сначала открытые заявки, затем по статусу прочитанности и дате создания (новые выше)
    validRequests.sort((a, b) => {
      const statusPriorityA = getStatusPriority(a.request.status);
      const statusPriorityB = getStatusPriority(b.request.status);

      if (statusPriorityA !== statusPriorityB) {
        return statusPriorityA - statusPriorityB;
      }

      if (a.isAlertForRequestRead !== b.isAlertForRequestRead) {
        return a.isAlertForRequestRead ? 1 : -1;
      }

      const dateB = getTimestamp(b.request.createdAt);
      const dateA = getTimestamp(a.request.createdAt);

      return dateB - dateA;
    });

    return validRequests;
  });
}

/**
 * Получает все алерты для провайдера
 */
async function getAlertsForProvider(providerId: number) {
  return prisma.talerts.findMany({
    where: { tproviders_id: providerId },
    select: { tbids_id: true, is_read: true }
  });
}

/**
 * Получает детали заявки через requestById
 * Обрабатывает ошибки и возвращает null для неудачных запросов
 */
async function getRequestDetails(bidId: number, userAuth: any): Promise<AnyRequestView | null> {
  try {
    return await requestById(bidId, userAuth);
  } catch (error) {
    // Логируем ошибку, но не прерываем обработку других заявок
    console.error(`Failed to get request details for bid ${bidId}:`, error);
    return null;
  }
}

async function getBidIdsWithProviderProposals({
  bidIds,
  providerId
}: {
  bidIds: number[];
  providerId: number;
}) {
  if (bidIds.length === 0) {
    return new Set<number>();
  }

  const proposals = await prisma.tproposals.findMany({
    where: {
      tproviders_id: providerId,
      tbids_id: {
        in: bidIds
      }
    },
    select: {
      tbids_id: true
    }
  });

  return new Set(proposals.map(({ tbids_id }) => tbids_id));
}

function getTimestamp(value: string | number | Date | null | undefined): number {
  if (!value) {
    return 0;
  }

  const date = new Date(value);
  const time = date.getTime();

  return Number.isFinite(time) ? time : 0;
}

function getStatusPriority(status: AnyRequestView['status']): number {
  return status === 'open' ? 0 : 1;
}
