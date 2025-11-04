'use server';

import { prisma } from '@/lib/db/prisma';
import { getUserAuthOrThrow } from '@/lib/auth/getUserAuth';

/**
 * Удаление сервиса (soft delete).
 * Проверяет, что сервис принадлежит текущему провайдеру.
 * 
 * @param {number} serviceId - ID сервиса для удаления
 * @throws {Error} Если пользователь не авторизован, не является провайдером или сервис не принадлежит ему
 */
export async function deleteService(serviceId: number): Promise<void> {
  // Получаем авторизованного пользователя
  const userAuth = await getUserAuthOrThrow();

  // Проверяем роль и наличие providerId
  if (userAuth.role !== 'provider' || !userAuth.providerId) {
    throw new Error('Access denied: Only providers can delete services');
  }

  // Находим сервис
  const service = await prisma.tservices.findUnique({
    where: { id: serviceId },
    select: { provider_id: true },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  // Проверяем принадлежность сервиса провайдеру
  if (service.provider_id !== userAuth.providerId) {
    throw new Error('Access denied: This service does not belong to you');
  }

  // Выполняем soft delete
  await prisma.tservices.update({
    where: { id: serviceId },
    data: {
      active: false,
      status: 'archived',
    },
  });
}

