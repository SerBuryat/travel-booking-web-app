'use server';

import { prisma } from '@/lib/db/prisma';
import { ServiceType } from '@/model/ServiceType';
import { CategoryEntity } from '@/entity/CategoryEntity';

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
        include: {
          tcategories: {
            select: {
              id: true,
              code: true,
              sysname: true,
              name: true,
              photo: true,
              parent_id: true,
            },
          },
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

  // Группируем предложения по провайдеру и дате
  const groupedProposals = new Map<string, ProposalView>();

  proposals.forEach(proposal => {
    const { tservices: service, tproviders: provider } = proposal;
    const { tcategories: category } = service;

    // Создаем ключ для группировки (провайдер + дата)
    const groupKey = `${provider.id}_${proposal.created_at.toISOString()}`;

    // Маппинг категории
    const mappedCategory: CategoryEntity = {
      id: category.id,
      code: category.code,
      sysname: category.sysname,
      name: category.name,
      photo: category.photo,
      parent_id: category.parent_id,
    };

    // Маппинг сервиса
    const mappedService: ServiceType = {
      id: service.id,
      name: service.name,
      description: service.description ?? '',
      price: String(service.price), // оригинальная цена сервиса
      tcategories_id: service.tcategories_id,
      provider_id: service.provider_id,
      status: service.status,
      created_at: service.created_at instanceof Date ? service.created_at.toISOString() : String(service.created_at),
      priority: String(service.priority),
      category: mappedCategory,
      rating: service.rating ? Number(service.rating) : undefined,
      view_count: service.view_count,
      service_options: service.service_options
    };

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
