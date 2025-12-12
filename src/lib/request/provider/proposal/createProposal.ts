'use server';

import { prisma } from '@/lib/db/prisma';
import { withUserAuth } from '@/lib/auth/withUserAuth';
import { createProposalSchema, CreateProposalData } from '@/schemas/proposal/createProposalSchema';
import { createNewProposalNotificationForClient } from '@/lib/notifications/createNewProposalNotificationForClient';
import {getActiveProviderIdBYClientId} from "@/lib/provider/searchProvider";
import { log } from '@/lib/utils/logger';

/**
 * Создает предложение провайдера на заявку клиента.
 * 
 * Логика:
 * 1. Валидирует входные данные
 * 2. Проверяет аутентификацию и роль пользователя (должен быть provider)
 * 3. Получает tproviders запись для пользователя
 * 4. Проверяет, что выбранные сервисы принадлежат провайдеру
 * 5. Создает записи в tproposals для каждого выбранного сервиса
 * 
 * @param {CreateProposalData} proposalData Данные предложения
 * @param {string} traceId Идентификатор для отслеживания процесса
 * @returns Promise<{success: boolean, message: string}> - результат создания
 */
export async function createProposal(
  proposalData: CreateProposalData,
  traceId?: string
): Promise<{success: boolean, message: string}> {
  log(
    'createProposal',
    'Начало создания предложения',
    'info',
    {
      requestId: proposalData.requestId,
      serviceIds: proposalData.serviceIds,
      servicesCount: proposalData.serviceIds.length
    },
    undefined,
    traceId
  );

  try {
    // Валидируем входные данные
    const validatedData = createProposalSchema.parse(proposalData);

    const result = await withUserAuth(async ({ userAuth }) => {
      // Проверяем, что пользователь - провайдер
      if (userAuth.role !== 'provider') {
        log(
          'createProposal',
          'Доступ запрещен: пользователь не является провайдером',
          'error',
          {
            requestId: validatedData.requestId,
            userId: userAuth.userId,
            role: userAuth.role
          },
          undefined,
          traceId
        );
        return { success: false, message: 'Доступ запрещен. Только провайдеры могут создавать предложения.' };
      }

      // Получаем tproviders запись пользователя
      const provider = await getActiveProviderIdBYClientId(userAuth.userId);
      if (!provider) {
        log(
          'createProposal',
          'Провайдер не найден',
          'error',
          {
            requestId: validatedData.requestId,
            userId: userAuth.userId
          },
          undefined,
          traceId
        );
        return { success: false, message: 'Провайдер не найден.' };
      }

      // Проверяем, что выбранные сервисы принадлежат провайдеру
      const servicesValidation = await validateServicesOwnership(validatedData.serviceIds, provider.id, traceId);
      if (!servicesValidation.isValid) {
        log(
          'createProposal',
          'Ошибка валидации сервисов',
          'error',
          {
            requestId: validatedData.requestId,
            providerId: provider.id,
            serviceIds: validatedData.serviceIds,
            errorMessage: servicesValidation.message
          },
          undefined,
          traceId
        );
        return { success: false, message: servicesValidation.message };
      }

      // Создаем предложения для каждого выбранного сервиса
      const proposalIds = await createProposalRecords(validatedData, provider.id, traceId);

      // Создаем уведомления для клиента о новых откликах (неблокирующий)
      if (proposalIds.length > 0) {
        Promise.resolve().then(() => {
          createNewProposalNotificationForClient(proposalIds).catch(error => {
            log(
              'createProposal',
              'Ошибка создания уведомлений для клиента (неблокирующий)',
              'warn',
              {
                requestId: validatedData.requestId,
                proposalIds
              },
              error,
              traceId
            );
          });
        });
      }

      log(
        'createProposal',
        'Предложение успешно создано',
        'info',
        {
          requestId: validatedData.requestId,
          providerId: provider.id,
          proposalIds,
          proposalsCount: proposalIds.length
        },
        undefined,
        traceId
      );

      return { 
        success: true, 
        message: `Предложение успешно создано. Создано ${proposalIds.length} предложений.` 
      };
    });

    if (!result) {
      log(
        'createProposal',
        'Ошибка аутентификации',
        'error',
        {
          requestId: proposalData.requestId
        },
        undefined,
        traceId
      );
    }

    return result || { success: false, message: 'Ошибка аутентификации' };
  } catch (error) {
    log(
      'createProposal',
      'Критическая ошибка при создании предложения',
      'error',
      {
        requestId: proposalData.requestId,
        serviceIds: proposalData.serviceIds
      },
      error,
      traceId
    );
    return { 
      success: false, 
      message: 'Ошибка при создании предложения. Попробуйте еще раз.' 
    };
  }
}

/**
 * Проверяет, что выбранные сервисы принадлежат провайдеру
 */
async function validateServicesOwnership(
  serviceIds: number[], 
  providerId: number,
  traceId?: string
): Promise<{isValid: boolean, message: string}> {
  try {
    const services = await prisma.tservices.findMany({
      where: {
        id: { in: serviceIds },
        provider_id: providerId,
        active: true
      },
      select: { id: true, name: true }
    });

    if (services.length !== serviceIds.length) {
      const foundIds = services.map(s => s.id);
      const missingIds = serviceIds.filter(id => !foundIds.includes(id));
      return {
        isValid: false,
        message: `Некоторые сервисы не найдены или не принадлежат вам: ${missingIds.join(', ')}`
      };
    }

    return { isValid: true, message: '' };
  } catch (error) {
    log(
      'validateServicesOwnership',
      'Ошибка проверки принадлежности сервисов',
      'error',
      {
        providerId,
        serviceIds
      },
      error,
      traceId
    );
    return {
      isValid: false,
      message: 'Ошибка при проверке сервисов'
    };
  }
}

/**
 * Создает записи предложений в tproposals
 */
async function createProposalRecords(
  data: CreateProposalData, 
  providerId: number,
  traceId?: string
): Promise<number[]> {
  try {
    const proposals = data.serviceIds.map(serviceId => ({
      tbids_id: data.requestId,
      tproviders_id: providerId,
      tservices_id: serviceId,
      price: data.price || 0, // Если цена не указана, используем 0
      comment: data.comment || null,
      status: 'pending' as const,
      created_at: new Date()
    }));

    // Создаем предложения и получаем их ID
    const createdProposals = await Promise.all(
      proposals.map(proposal => 
        prisma.tproposals.create({
          data: proposal,
          select: { id: true }
        })
      )
    );

    return createdProposals.map(proposal => proposal.id);
  } catch (error) {
    log(
      'createProposalRecords',
      'Ошибка создания записей предложений в БД',
      'error',
      {
        requestId: data.requestId,
        providerId,
        serviceIds: data.serviceIds
      },
      error,
      traceId
    );
    throw error;
  }
}
