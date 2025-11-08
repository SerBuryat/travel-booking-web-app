'use server';

import { prisma } from '@/lib/db/prisma';
import { withUserAuth } from '@/lib/auth/withUserAuth';
import { ServiceType } from '@/model/ServiceType';
import {getActiveProviderId} from "@/lib/provider/searchProvider";
import { getServicesByIds } from '@/lib/service/searchServices';

export interface ProposalServiceType extends ServiceType {
  isUsedInProposal: boolean;
}

export interface ProviderServicesForRequest {
  services: ProposalServiceType[];
}

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
 * @returns Promise<ProviderServicesForRequest | null> - объект с сервисами и флагом использования
 * @returns null - если пользователь не аутентифицирован или не провайдер
 */
export async function getProviderServicesForRequest(requestId: number): Promise<ProviderServicesForRequest | null> {
  const result = await withUserAuth(async ({ userAuth }) => {
    if (userAuth.role !== 'provider') {
      return null;
    }

    const provider = await getActiveProviderId(userAuth.userId);
    if (!provider) {
      return { services: [] };
    }

    // Получаем алерты для данной заявки и провайдера
    const alerts = await getAlertsForRequestAndProvider(requestId, provider.id);
    if (alerts.length === 0) {
      return { services: [] };
    }

    // Извлекаем ID сервисов
    const serviceIds = alerts.map(alert => alert.tservices_id);

    // Получаем детали сервисов
    const services = await getServicesByIds(serviceIds);

    // Получаем уже использованные сервисы для этой заявки
    const usedServiceIds = await getUsedServiceIds(requestId, provider.id);

    // Добавляем флаг isUsedInProposal к каждому сервису
    const servicesWithUsageFlag = services.map(service => ({
      ...service,
      isUsedInProposal: usedServiceIds.includes(service.id)
    }));

    return {
      services: servicesWithUsageFlag
    };
  });

  return result || null;
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
 * Получает ID сервисов, уже использованных для данной заявки данным провайдером
 */
async function getUsedServiceIds(requestId: number, providerId: number): Promise<number[]> {
  const proposals = await prisma.tproposals.findMany({
    where: {
      tbids_id: requestId,
      tproviders_id: providerId
    },
    select: { tservices_id: true }
  });

  return proposals.map(proposal => proposal.tservices_id);
}
