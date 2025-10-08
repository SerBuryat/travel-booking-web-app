'use server';

import { withUserAuth } from '@/lib/auth/withUserAuth';
import { prisma } from '@/lib/db/prisma';
import { requestById } from '@/lib/request/client/view/requestById';
import { AnyRequestView } from '@/lib/request/client/view/types';

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
 * @returns Promise<AnyRequestView[]> - массив заявок клиентов
 * @returns null - если пользователь не аутентифицирован или не провайдер
 */
export async function getClientRequestsForProvider(): Promise<AnyRequestView[] | null> {
  return withUserAuth(async ({ userAuth }) => {
    // Проверяем, что пользователь - провайдер
    if (userAuth.role !== 'provider') {
      return null;
    }

    // Получаем tproviders запись пользователя
    const provider = await getProviderByUserId(userAuth.userId);
    if (!provider) {
      return [];
    }

    // Получаем все алерты для провайдера
    const alerts = await getAlertsForProvider(provider.id);
    if (alerts.length === 0) {
      return [];
    }

    // Извлекаем уникальные ID заявок
    const bidIds = [...new Set(alerts.map(alert => alert.tbids_id))];

    // Получаем детали каждой заявки
    const requests = await Promise.all(
      bidIds.map(bidId => getRequestDetails(bidId, userAuth))
    );

    // Фильтруем успешно полученные заявки
    return requests.filter((request): request is AnyRequestView => request !== null);
  });
}

/**
 * Получает tproviders запись по userId
 */
async function getProviderByUserId(userId: number) {
  return prisma.tproviders.findFirst({
    where: { tclients_id: userId },
    select: { id: true }
  });
}

/**
 * Получает все алерты для провайдера
 */
async function getAlertsForProvider(providerId: number) {
  return prisma.talerts.findMany({
    where: { tproviders_id: providerId },
    select: { tbids_id: true }
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
