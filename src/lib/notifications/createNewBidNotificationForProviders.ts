"use server";

import {prisma} from '@/lib/db/prisma';
import { sendNotificationsViaTgBot } from './notificationsSender';

/**
 * Interface for template data
 */
interface TemplateData {
  id: bigint;
  text: string;
}

/**
 * Get template data by action name
 */
async function getTemplateByActionName(actionName: string): Promise<TemplateData | null> {
  return prisma.ttemplate.findFirst({
    where: {action_name: actionName},
    select: {
      id: true,
      text: true,
    },
  });
}

/**
 * Get provider's client ID by provider ID
 */
async function getProviderClientId(providerId: number): Promise<number | null> {
  const provider = await prisma.tproviders.findUnique({
    where: { id: providerId },
    select: { tclients_id: true },
  });

  return provider?.tclients_id || null;
}

/**
 * Create notification records for providers
 */
async function createNotificationRecords(providerIds: number[], template: TemplateData): Promise<number[]> {
  if (providerIds.length === 0) {
    return [];
  }

  // Get all provider client IDs
  const providerClientIds = await Promise.all(
    providerIds.map(providerId => getProviderClientId(providerId))
  );

  // Filter out null values and create notification data
  const notificationData = providerClientIds
    .filter((clientId): clientId is number => clientId !== null)
    .map(clientId => ({
      user_id: clientId,
      user_role: 'provider' as const,
      message: template.text,
      is_read: false,
      created_at: new Date(),
      ttemplate_id: template.id,
      is_sent: false,
    }));

  if (notificationData.length === 0) {
    console.log('No valid provider client IDs found for notifications');
    return [];
  }

  // Create notifications and get their IDs
  const createdNotifications = await Promise.all(
    notificationData.map(data => 
      prisma.tnotifications.create({
        data,
        select: { id: true }
      })
    )
  );

  const notificationIds = createdNotifications.map(notification => notification.id);
  console.log(`Created ${notificationIds.length} notifications for providers with IDs: ${notificationIds}`);

  return notificationIds;
}

/**
 * Main function to create notifications for providers about new bid
 */
export async function createNewBidNotificationForProviders(providerIds: number[]): Promise<void> {
  try {
    console.log(`Creating notifications for providers: ${providerIds}`);

    // Get template for bid notification
    const template = await getTemplateByActionName('send_bid_to_provider');
    
    if (!template) {
      console.log('Template "send_bid_to_provider" not found');
      return;
    }

    // Create notification records and get their IDs
    const notificationIds = await createNotificationRecords(providerIds, template);

    if (notificationIds.length > 0) {
      // Send notifications via Telegram bot (non-blocking)
      Promise.resolve().then(() => {
        sendNotificationsViaTgBot(notificationIds).catch(error => {
          console.error('Error sending notifications via Telegram bot:', error);
        });
      });
    }

    console.log('Successfully created bid notifications for providers');
  } catch (error) {
    console.error('Error creating bid notifications for providers:', error);
    // Don't throw error - this is not critical functionality
  }
}

