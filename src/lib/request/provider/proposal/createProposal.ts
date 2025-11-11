'use server';

import { prisma } from '@/lib/db/prisma';
import { withUserAuth } from '@/lib/auth/withUserAuth';
import { createProposalSchema, CreateProposalData } from '@/schemas/proposal/createProposalSchema';
import { createNewProposalNotificationForClient } from '@/lib/notifications/createNewProposalNotificationForClient';
import {getActiveProviderId} from "@/lib/provider/searchProvider";

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
 * @returns Promise<{success: boolean, message: string}> - результат создания
 */
export async function createProposal(proposalData: CreateProposalData): Promise<{success: boolean, message: string}> {
  try {
    // Валидируем входные данные
    const validatedData = createProposalSchema.parse(proposalData);

    const result = await withUserAuth(async ({ userAuth }) => {
      // Проверяем, что пользователь - провайдер
      if (userAuth.role !== 'provider') {
        return { success: false, message: 'Доступ запрещен. Только провайдеры могут создавать предложения.' };
      }

      // Получаем tproviders запись пользователя
      const provider = await getActiveProviderId(userAuth.userId);
      if (!provider) {
        return { success: false, message: 'Провайдер не найден.' };
      }

      // Проверяем, что выбранные сервисы принадлежат провайдеру
      const servicesValidation = await validateServicesOwnership(validatedData.serviceIds, provider.id);
      if (!servicesValidation.isValid) {
        return { success: false, message: servicesValidation.message };
      }

      // Создаем предложения для каждого выбранного сервиса
      const proposalIds = await createProposalRecords(validatedData, provider.id);

      // Создаем уведомления для клиента о новых откликах (неблокирующий)
      if (proposalIds.length > 0) {
        Promise.resolve().then(() => {
          createNewProposalNotificationForClient(proposalIds).catch(error => {
            console.error('Error creating proposal notifications for client:', error);
          });
        });
      }

      return { 
        success: true, 
        message: `Предложение успешно создано. Создано ${proposalIds.length} предложений.` 
      };
    });

    return result || { success: false, message: 'Ошибка аутентификации' };
  } catch (error) {
    console.error('Error creating proposal:', error);
    return { 
      success: false, 
      message: 'Ошибка при создании предложения. Попробуйте еще раз.' 
    };
  }
}

/**
 * Проверяет, что выбранные сервисы принадлежат провайдеру
 */
async function validateServicesOwnership(serviceIds: number[], providerId: number): Promise<{isValid: boolean, message: string}> {
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
}

/**
 * Создает записи предложений в tproposals
 */
async function createProposalRecords(data: CreateProposalData, providerId: number): Promise<number[]> {
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
}
