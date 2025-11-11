"use server";

import {prisma} from '@/lib/db/prisma';
import { createNewAlertNotificationForProviders } from '@/lib/notifications/createNewAlertNotificationForProviders';

/**
 * Interface for bid data needed for alert creation
 */
interface BidData {
  tcategories_id: number | null;
  tarea_id: number;
}

/**
 * Interface for service data needed for alert creation
 */
interface ServiceData {
  id: number;
  provider_id: number;
}

/**
 * Get bid data by ID - category and area information
 */
async function getBidData(bidId: number): Promise<BidData> {
  const bid = await prisma.tbids.findUnique({
    where: { id: bidId },
    select: {
      tcategories_id: true,
      tarea_id: true,
    },
  });

  if (!bid) {
    throw new Error(`Bid with ID ${bidId} not found`);
  }

  return {
    tcategories_id: bid.tcategories_id,
    tarea_id: bid.tarea_id,
  };
}

/**
 * Get providers in the specified area
 */
async function getActiveProvidersInArea(areaId: number): Promise<number[]> {
  const providers = await prisma.tproviders.findMany({
    where: {
      status: 'active',
      tclients: {
        tarea_id: areaId
      },
    },
    select: {
      id: true,
    },
  });

  return providers.map(provider => provider.id);
}

/**
 * Get services by category and provider IDs
 * Searches for services where category matches exactly or is a child of the specified category
 */
async function getServicesByCategoryAndProviders(
  categoryId: number | null,
  providerIds: number[]
): Promise<ServiceData[]> {
  if (!categoryId || providerIds.length === 0) {
    return [];
  }

  return prisma.tservices.findMany({
    where: {
      OR: [
        // Exact category match
        {tcategories_id: categoryId},
        // Child category match
        {
          tcategories: {
            parent_id: categoryId,
          },
        },
      ],
      provider_id: {
        in: providerIds,
      },
      active: true,
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

    // Get providers in the bid's area
    const providerIds = await getActiveProvidersInArea(bidData.tarea_id);

    console.log(`Получены поставщики в области: ${providerIds}`);

    // If no providers in area, no alerts to create
    if (providerIds.length === 0) {
      return;
    }

    // Get services matching category and providers
    const services = await getServicesByCategoryAndProviders(
      bidData.tcategories_id,
      providerIds
    );

    console.log(`Получены услуги: ${JSON.stringify(services)}`);

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
