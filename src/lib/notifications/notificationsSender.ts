"use server";

import { prisma } from '@/lib/db/prisma';
import { sendMessage } from '@/lib/telegram/bot/sendMessage';

/**
 * Interface for notification data with user info
 */
interface NotificationWithUser {
  id: number;
  user_id: number;
  message: string;
  is_sent: boolean | null;
  telegram_auth_id: string | null;
}

/**
 * Get notifications with Telegram auth data
 */
async function getNotificationsWithTelegramAuth(notificationIds: number[]): Promise<NotificationWithUser[]> {
  const notifications = await prisma.tnotifications.findMany({
    where: {
      id: {
        in: notificationIds
      }
    },
    select: {
      id: true,
      user_id: true,
      message: true,
      is_sent: true,
    }
  });

  // Get Telegram auth for each user
  const notificationsWithAuth = await Promise.all(
    notifications.map(async (notification) => {
      const telegramAuth = await prisma.tclients_auth.findFirst({
        where: {
          tclients_id: notification.user_id,
          auth_type: 'telegram'
        },
        select: {
          auth_id: true
        }
      });

      return {
        id: notification.id,
        user_id: notification.user_id,
        message: notification.message,
        is_sent: notification.is_sent,
        telegram_auth_id: telegramAuth?.auth_id || null
      };
    })
  );

  return notificationsWithAuth;
}

/**
 * Extract chatId from Telegram auth_id by removing 'telegram_' prefix
 */
function extractChatId(authId: string): string | null {
  const prefix = 'telegram_';
  if (authId.startsWith(prefix)) {
    return authId.substring(prefix.length);
  }
  return null;
}

/**
 * Update notification is_sent status
 */
async function updateNotificationSentStatus(notificationId: number, isSent: boolean): Promise<void> {
  await prisma.tnotifications.update({
    where: { id: notificationId },
    data: { is_sent: isSent }
  });
}

/**
 * Send notifications via Telegram bot
 * 
 * @param notificationIds - Array of notification IDs to send
 * @returns Promise<void>
 */
export async function sendNotificationsViaTgBot(notificationIds: number[]): Promise<void> {
  if (notificationIds.length === 0) {
    console.log('No notifications to send');
    return;
  }

  console.log(`Starting to send ${notificationIds.length} notifications via Telegram bot`);

  // Get notifications with Telegram auth data
  const notifications = await getNotificationsWithTelegramAuth(notificationIds);
  
  if (notifications.length === 0) {
    console.log('No notifications found in database');
    return;
  }

  console.log(`Found ${notifications.length} notifications in database`);

  let sentCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  // Process each notification
  for (const notification of notifications) {
    try {
      // Skip if already sent
      if (notification.is_sent === true) {
        console.log(`Notification ${notification.id} already sent, skipping`);
        skippedCount++;
        continue;
      }

      // Check if user has Telegram auth
      if (!notification.telegram_auth_id) {
        console.log(`User ${notification.user_id} has no Telegram auth for notification ${notification.id}, skipping`);
        skippedCount++;
        continue;
      }

      // Extract chatId from auth_id
      const chatId = extractChatId(notification.telegram_auth_id);
      if (!chatId) {
        console.log(`Invalid Telegram auth_id format for user ${notification.user_id}, notification ${notification.id}, skipping`);
        skippedCount++;
        continue;
      }

      console.log(`Sending notification ${notification.id} to chat ${chatId}`);

      // Send message via Telegram bot
      const result = await sendMessage(chatId, notification.message);

      if (result.success) {
        // Update notification as sent
        await updateNotificationSentStatus(notification.id, true);
        console.log(`✅ Notification ${notification.id} sent successfully to chat ${chatId}`);
        sentCount++;
      } else {
        // Log error but continue with next notification
        console.error(`❌ Failed to send notification ${notification.id} to chat ${chatId}: ${result.error}`);
        failedCount++;
      }

    } catch (error) {
      console.error(`❌ Error processing notification ${notification.id}:`, error);
      failedCount++;
    }
  }

  // Log summary
  console.log(`📊 Notifications sending completed:`);
  console.log(`   ✅ Sent: ${sentCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   📝 Total processed: ${notifications.length}`);
}
