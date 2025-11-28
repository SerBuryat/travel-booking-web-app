"use server";

import {prisma} from '@/lib/db/prisma';
import { createNewAlertNotificationForProviders } from '@/lib/notifications/createNewAlertNotificationForProviders';

/**
 * Interface for bid data needed for alert creation
 */
interface BidData {
  tcategories_id: number | null;
  tarea_id: number;
  tclients_id: number;
}

/**
 * Interface for service data needed for alert creation
 */
interface ServiceData {
  id: number;
  provider_id: number;
}

/**
 * Get bid data by ID - category, area, and client information
 */
async function getBidData(bidId: number): Promise<BidData> {
  const bid = await prisma.tbids.findUnique({
    where: { id: bidId },
    select: {
      tcategories_id: true,
      tarea_id: true,
      tclients_id: true,
    },
  });

  if (!bid) {
    throw new Error(`Bid with ID ${bidId} not found`);
  }

  return {
    tcategories_id: bid.tcategories_id,
    tarea_id: bid.tarea_id,
    tclients_id: bid.tclients_id,
  };
}

/**
 * Находит активные сервисы для заявки по области и категории
 * Объединяет логику поиска активных провайдеров в области и сервисов по категории
 * 
 * @param bidData - Данные заявки (area, category, client)
 * @returns Массив активных сервисов с id и provider_id
 * 
 * Условия поиска:
 * 1. Сервис активен (active: true) и опубликован (status: 'published')
 * 2. Провайдер сервиса активен (tproviders.status: 'active')
 * 3. Провайдер сервиса НЕ является тем же клиентом, что создал заявку
 *    (tproviders.tclients_id !== bidData.tclients_id)
 * 4. У сервиса есть хотя бы одна локация в нужной области (tlocations.tarea_id: areaId)
 * 5. Категория сервиса точно совпадает с categoryId ИЛИ является дочерней категорией
 *    (tcategories_id: categoryId ИЛИ tcategories.parent_id: categoryId)
 */
async function activeServicesForBid(
  bidData: BidData
): Promise<ServiceData[]> {
  // Если категория не указана, сервисы не найдены
  if (!bidData.tcategories_id) {
    return [];
  }

  return prisma.tservices.findMany({
    where: {
      // Условие 1: Сервис должен быть активным и опубликованным
      active: true,
      status: 'published',
      
      // Условие 2: Провайдер сервиса должен быть активным
      // Условие 3: Провайдер сервиса НЕ должен быть тем же клиентом, что создал заявку
      // Проверяем через связь tproviders
      tproviders: {
        status: 'active',
        tclients_id: {
          not: bidData.tclients_id, // Исключаем сервисы от самого клиента
        },
      },
      
      // Условие 4: У сервиса должна быть хотя бы одна локация в нужной области
      // Проверяем через связь tlocations
      tlocations: {
        some: {
          tarea_id: bidData.tarea_id,
        },
      },
      
      // Условие 5: Категория сервиса должна совпадать с categoryId или быть дочерней
      // Используем OR для двух вариантов:
      OR: [
        // Вариант 5.1: Точное совпадение категории
        {
          tcategories_id: bidData.tcategories_id,
        },
        // Вариант 5.2: Категория сервиса является дочерней (parent_id = categoryId)
        {
          tcategories: {
            parent_id: bidData.tcategories_id,
          },
        },
      ],
    },
    select: {
      id: true,
      provider_id: true,
    },
  });
}

/**
 * Create alert records in talerts table
 */
async function createAlertRecords(bidId: number, services: ServiceData[]): Promise<number[]> {
  if (services.length === 0) {
    return [];
  }

  const alertData = services.map(service => ({
    tbids_id: bidId,
    tproviders_id: service.provider_id,
    tservices_id: service.id,
    is_read: false,
    is_seen: false,
    variables: null,
  }));

  // Create alerts and get their IDs
  const createdAlerts = await Promise.all(
    alertData.map(alert => 
      prisma.talerts.create({
        data: alert,
        select: { id: true }
      })
    )
  );

  const alertIds = createdAlerts.map(alert => alert.id);
  console.log(`Created ${alertIds.length} alerts with IDs: ${alertIds}`);

  return alertIds;
}

/**
 * Main function to create alerts for a bid
 * Finds suitable services by category and location, then creates alert records
 */
export async function createAlert(bidId: number): Promise<void> {
  try {
    // Get bid data (category and area)
    const bidData = await getBidData(bidId);

    console.log(`Создается алерт для заявки: ${bidId}`);

    // If no category specified, no alerts to create
    if (!bidData.tcategories_id) {
      return;
    }

    // Get active services matching category, area, and active providers
    // Объединенный запрос: находит активные сервисы с активными провайдерами
    // в нужной области и подходящей категории
    // Исключает сервисы от самого клиента, создавшего заявку
    const services = await activeServicesForBid(bidData);

    console.log(`Получены услуги: ${JSON.stringify(services)}`);

    // If no services found, no alerts to create
    if (services.length === 0) {
      return;
    }

    // Create alert records and get their IDs
    const alertIds = await createAlertRecords(bidId, services);

    // Create notifications for providers (non-blocking)
    if (alertIds.length > 0) {
      Promise.resolve().then(() => {
        createNewAlertNotificationForProviders(alertIds).catch(error => {
          console.error('Error in async notification creation:', error);
        });
      });
    }
  } catch (error) {
    console.error('Error creating alerts for bid:', bidId, error);
    throw error;
  }
}
