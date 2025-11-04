'use server';

import { prisma } from '@/lib/db/prisma';
import { ServiceType } from '@/model/ServiceType';
import { getServiceById } from '@/lib/service/searchServices';

// Типы для предложений
export interface ProposalServiceItem {
  id: number; // tproposals.id
  price: string | null; // предложенная цена
  service: ServiceType;
  originalPrice: string; // текущая цена сервиса
}

export interface ProposalView {
  provider: {
    id: number;
    company_name: string;
    phone: string;
  };
  comment: string | null;
  created_at: string;
  services: ProposalServiceItem[]; // массив сервисов в предложении
}

export interface RequestProposalsResult {
  proposals: ProposalView[];
  count: number;
}

/**
 * Получает все предложения для конкретной заявки клиента
 * Группирует предложения по провайдеру и дате создания
 */
export async function getRequestProposals(requestId: number): Promise<RequestProposalsResult> {
  const proposals = await prisma.tproposals.findMany({
    where: {
      tbids_id: requestId,
    },
    include: {
      tservices: {
        select: {
          id: true,
          price: true,
        },
      },
      tproviders: {
        select: {
          id: true,
          company_name: true,
          phone: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  // Получаем уникальные ID сервисов
  const uniqueServiceIds = [...new Set(proposals.map(p => p.tservices.id))];
  
  // Параллельно загружаем все сервисы через getServiceById
  const servicesMap = new Map<number, ServiceType>();
  await Promise.all(
    uniqueServiceIds.map(async (serviceId) => {
      const service = await getServiceById(serviceId);
      if (service) {
        servicesMap.set(serviceId, service);
      }
    })
  );

  // Группируем предложения по провайдеру и дате
  const groupedProposals = new Map<string, ProposalView>();

  proposals.forEach(proposal => {
    const { tservices: service, tproviders: provider } = proposal;
    const mappedService = servicesMap.get(service.id);

    // Пропускаем, если сервис не найден
    if (!mappedService) {
      return;
    }

    // Создаем ключ для группировки (провайдер + дата)
    const groupKey = `${provider.id}_${proposal.created_at.toISOString()}`;

    // Создаем элемент сервиса в предложении
    const serviceItem: ProposalServiceItem = {
      id: proposal.id,
      price: proposal.price ? String(proposal.price) : null,
      service: mappedService,
      originalPrice: String(service.price),
    };

    // Если группа уже существует, добавляем сервис
    if (groupedProposals.has(groupKey)) {
      const existingProposal = groupedProposals.get(groupKey)!;
      existingProposal.services.push(serviceItem);
    } else {
      // Создаем новую группу
      groupedProposals.set(groupKey, {
        provider: {
          id: provider.id,
          company_name: provider.company_name,
          phone: provider.phone,
        },
        comment: proposal.comment,
        created_at: proposal.created_at instanceof Date ? proposal.created_at.toISOString() : String(proposal.created_at),
        services: [serviceItem],
      });
    }
  });

  // Преобразуем Map в массив
  const mappedProposals: ProposalView[] = Array.from(groupedProposals.values());

  return {
    proposals: mappedProposals,
    count: mappedProposals.length,
  };
}
