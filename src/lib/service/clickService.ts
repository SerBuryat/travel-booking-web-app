'use server';

import { prisma } from '@/lib/db/prisma';
import { getUserAuthOrThrow } from '@/lib/auth/getUserAuth';

/**
 * Модель клика клиента по сервису
 */
export interface ServiceClick {
  id: number;
  serviceId: number;
  serviceName: string;
  timestamp: Date;
}

/**
 * Результат создания или обновления клика
 */
export interface CreateClickResult {
  id: number;
  timestamp: Date;
}

/**
 * Создание или обновление клика клиента по сервису.
 * 
 * Логика работы:
 * - Если клик с такой комбинацией (clientId, serviceId, tproposals_id) уже существует, обновляется timestamp
 * - Если клика нет, создается новая запись и увеличивается счетчик просмотров сервиса (view_count)
 * 
 * @param {number} serviceId - Идентификатор сервиса, по которому кликнул клиент
 * @param {number|null} [tproposals_id=null] - Опциональный идентификатор предложения (proposal), связанного с кликом
 * @returns {Promise<CreateClickResult>} Результат операции с id и timestamp клика
 * @throws {Error} Если пользователь не авторизован
 */
export async function createOrUpdateClick(
  serviceId: number,
  tproposals_id: number | null = null
): Promise<CreateClickResult> {
  // Проверяем авторизацию пользователя
  const userAuth = await getUserAuthOrThrow();
  const clientId = userAuth.userId;

  // Проверяем валидность serviceId
  if (!Number.isFinite(serviceId)) {
    throw new Error('Invalid serviceId');
  }

  // Проверяем валидность tproposals_id, если передан
  if (tproposals_id !== null && !Number.isFinite(tproposals_id)) {
    throw new Error('Invalid tproposals_id');
  }

  // Формируем условие поиска существующего клика
  // Уникальность определяется комбинацией (clientId, serviceId, tproposals_id)
  const whereCondition: {
    tclients_id: number;
    tservices_id: number;
    tproposals_id?: number | null;
  } = {
    tclients_id: clientId,
    tservices_id: serviceId,
  };

  // Если tproposals_id передан, добавляем его в условие поиска
  // Если null, ищем запись где tproposals_id тоже null
  if (tproposals_id !== null) {
    whereCondition.tproposals_id = tproposals_id;
  } else {
    whereCondition.tproposals_id = null;
  }

  // Ищем существующий клик по комбинации (clientId, serviceId, tproposals_id)
  const existing = await prisma.tservices_clicks.findFirst({
    where: whereCondition,
  });

  // Если клик существует, обновляем timestamp
  if (existing) {
    const updated = await prisma.tservices_clicks.update({
      where: { id: existing.id },
      data: { timestamp: new Date() },
    });
    
    return {
      id: updated.id,
      timestamp: updated.timestamp,
    };
  }

  // Если клика нет, создаем новую запись и увеличиваем счетчик просмотров
  // Используем транзакцию для атомарности операций
  const result = await prisma.$transaction(async (tx) => {
    // Формируем данные для создания записи о клике
    const clickData: {
      tclients_id: number;
      tservices_id: number;
      tproposals_id?: number | null;
    } = {
      tclients_id: clientId,
      tservices_id: serviceId,
    };

    // Если tproposals_id передан, добавляем его в данные
    if (tproposals_id !== null) {
      clickData.tproposals_id = tproposals_id;
    }

    // Создаем запись о клике
    const created = await tx.tservices_clicks.create({
      data: clickData,
    });

    // Увеличиваем счетчик просмотров сервиса на 1
    await tx.tservices.update({
      where: { id: serviceId },
      data: {
        view_count: {
          increment: 1,
        },
      },
    });

    return created;
  });

  return {
    id: result.id,
    timestamp: result.timestamp,
  };
}

/**
 * Получение всех кликов клиента по сервисам.
 * 
 * Возвращает список всех сервисов, по которым клиент кликнул,
 * отсортированный по дате клика (от новых к старым).
 * 
 * @param {number} clientId - Идентификатор клиента
 * @returns {Promise<ServiceClick[]>} Массив кликов с информацией о сервисах
 */
export async function getClicksByClientId(clientId: number): Promise<ServiceClick[]> {
  // Проверяем валидность clientId
  if (!Number.isFinite(clientId)) {
    return [];
  }

  // Получаем все клики клиента с информацией о сервисах
  const clicks = await prisma.tservices_clicks.findMany({
    where: { tclients_id: clientId },
    orderBy: { timestamp: 'desc' },
    include: {
      tservices: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Преобразуем результат в нужный формат
  return clicks.map((click) => ({
    id: click.id,
    serviceId: click.tservices.id,
    serviceName: click.tservices.name,
    timestamp: click.timestamp,
  }));
}

/**
 * Получение всех кликов текущего авторизованного клиента по сервисам.
 * 
 * Удобная функция-обертка, которая автоматически получает clientId
 * из контекста авторизации.
 * 
 * @returns {Promise<ServiceClick[]>} Массив кликов с информацией о сервисах
 * @throws {Error} Если пользователь не авторизован
 */
export async function getMyClicks(): Promise<ServiceClick[]> {
  // Получаем авторизованного пользователя
  const userAuth = await getUserAuthOrThrow();
  
  // Возвращаем клики текущего клиента
  return getClicksByClientId(userAuth.userId);
}

