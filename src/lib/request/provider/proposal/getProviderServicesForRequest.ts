'use server';

import { prisma } from '@/lib/db/prisma';
import { withUserAuth } from '@/lib/auth/withUserAuth';
import { ServiceType } from '@/model/ServiceType';
import { CategoryEntity } from '@/entity/CategoryEntity';

/**
 * Получает сервисы провайдера, подходящие для конкретной заявки клиента.
 * 
 * Логика:
 * 1. Проверяет аутентификацию и роль пользователя (должен быть provider)
 * 2. Получает tproviders запись для пользователя
 * 3. Находит все talerts записи для данной заявки и провайдера
 * 4. Извлекает tservices_id из алертов
 * 5. Получает детали сервисов
 * 
 * @param {number} requestId ID заявки клиента (tbids.id)
 * @returns Promise<ServiceType[]> - массив подходящих сервисов провайдера
 * @returns null - если пользователь не аутентифицирован или не провайдер
 */
export async function getProviderServicesForRequest(requestId: number): Promise<ServiceType[] | null> {
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

    // Получаем алерты для данной заявки и провайдера
    const alerts = await getAlertsForRequestAndProvider(requestId, provider.id);
    if (alerts.length === 0) {
      return [];
    }

    // Извлекаем ID сервисов
    const serviceIds = alerts.map(alert => alert.tservices_id);

    // Получаем детали сервисов
    const services = await getServicesByIds(serviceIds);

    return services;
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
 * Получает все алерты для конкретной заявки и провайдера
 */
async function getAlertsForRequestAndProvider(requestId: number, providerId: number) {
  return prisma.talerts.findMany({
    where: { 
      tbids_id: requestId,
      tproviders_id: providerId 
    },
    select: { tservices_id: true }
  });
}

/**
 * Получение сервисов по массиву ID.
 */
async function getServicesByIds(serviceIds: number[]): Promise<ServiceType[]> {
  if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
    return [];
  }

  const services = await prisma.tservices.findMany({
    where: {
      id: { in: serviceIds },
      active: true
    },
    include: { tcategories: true },
    orderBy: { priority: 'desc' }
  });

  if (services.length === 0) {
    return [];
  }

  return services.map(mapToServiceType);
}

/**
 * Преобразует результат Prisma в ServiceType
 */
function mapToServiceType(service: any): ServiceType {
  const { tcategories: category, ...rest } = service;
  const mappedCategory: CategoryEntity = {
    id: category.id,
    code: category.code,
    sysname: category.sysname,
    name: category.name,
    photo: category.photo,
    parent_id: category.parent_id,
  };

  return {
    id: rest.id,
    name: rest.name,
    description: rest.description,
    price: String(rest.price),
    tcategories_id: rest.tcategories_id,
    provider_id: rest.provider_id,
    status: rest.status,
    created_at: rest.created_at,
    priority: rest.priority,
    category: mappedCategory,
    rating: rest.rating ? Number(rest.rating) : undefined,
    view_count: rest.view_count
  };
}
