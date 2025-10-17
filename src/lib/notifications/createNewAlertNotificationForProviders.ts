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
 * Get alerts with provider client IDs
 */
async function getAlertsWithProviderClients(alertIds: number[]): Promise<{alertId: number, clientId: number}[]> {
  const alerts = await prisma.talerts.findMany({
    where: {
      id: {
        in: alertIds
      }
    },
    select: {
      id: true,
      tproviders: {
        select: {
          tclients_id: true
        }
      }
    }
  });

  return alerts
    .filter(alert => alert.tproviders.tclients_id !== null)
    .map(alert => ({
      alertId: alert.id,
      clientId: alert.tproviders.tclients_id!
    }));
}

/**
 * Create notification records for providers
 */
async function createNotificationRecords(alertData: {alertId: number, clientId: number}[], template: TemplateData): Promise<number[]> {
  if (alertData.length === 0) {
    return [];
  }

  // Create notification data for each alert
  const notificationData = alertData.map(alert => ({
    user_id: alert.clientId,
    user_role: 'provider' as const,
    message: template.text,
    is_read: false,
    created_at: new Date(),
    ttemplate_id: template.id,
    is_sent: false,
  }));

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
export async function createNewAlertNotificationForProviders(alertIds: number[]): Promise<void> {
  try {
    console.log(`Creating notifications for providers from alerts: ${alertIds}`);

    // Get template for bid notification
    const template = await getTemplateByActionName('send_bid_to_provider');
    
    if (!template) {
      console.log('Template "send_bid_to_provider" not found');
      return;
    }

    // Get alerts with provider client IDs
    const alertData = await getAlertsWithProviderClients(alertIds);

    if (alertData.length === 0) {
      console.log('No valid alerts found for notifications');
      return;
    }

    console.log(`Found ${alertData.length} alerts with provider clients`);

    // Create notification records and get their IDs
    const notificationIds = await createNotificationRecords(alertData, template);

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

