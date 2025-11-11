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
 * Interface for proposal with client data
 */
interface ProposalWithClient {
  proposalId: number;
  clientId: number;
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
 * Get proposals with their client IDs
 * Only for open bids
 */
async function getProposalsWithClients(proposalIds: number[]): Promise<ProposalWithClient[]> {
  const proposals = await prisma.tproposals.findMany({
    where: {
      id: {
        in: proposalIds
      }
    },
    select: {
      id: true,
      tbids: {
        select: {
          id: true,
          tclients_id: true,
          status: true
        }
      }
    }
  });

  // Filter only open bids and extract client data
  const proposalsWithClients = proposals
    .filter(proposal => proposal.tbids.status === 'open')
    .map(proposal => ({
      proposalId: proposal.id,
      clientId: proposal.tbids.tclients_id
    }));

  return proposalsWithClients;
}

/**
 * Create notification records for clients
 */
async function createNotificationRecords(proposalsWithClients: ProposalWithClient[], template: TemplateData): Promise<number[]> {
  if (proposalsWithClients.length === 0) {
    return [];
  }

  // Create notification data for each proposal
  const notificationData = proposalsWithClients.map(proposal => ({
    user_id: proposal.clientId,
    user_role: 'client' as const,
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
  console.log(`Created ${notificationIds.length} notifications for clients with IDs: ${notificationIds}`);

  return notificationIds;
}

/**
 * Main function to create notifications for clients about new proposals
 */
export async function createNewProposalNotificationForClient(proposalIds: number[]): Promise<void> {
  try {
    console.log(`Creating notifications for clients about proposals: ${proposalIds}`);

    // Get template for proposal notification
    const template = await getTemplateByActionName('send_proposal_to_client');
    
    if (!template) {
      console.log('Template "send_proposal_to_client" not found');
      return;
    }

    // Get proposals with their client IDs (only for open bids)
    const proposalsWithClients = await getProposalsWithClients(proposalIds);

    if (proposalsWithClients.length === 0) {
      console.log('No open bids found for the given proposals');
      return;
    }

    console.log(`Found ${proposalsWithClients.length} open bids for proposals`);

    // Create notification records and get their IDs
    const notificationIds = await createNotificationRecords(proposalsWithClients, template);

    if (notificationIds.length > 0) {
      // Send notifications via Telegram bot (non-blocking)
      Promise.resolve().then(() => {
        sendNotificationsViaTgBot(notificationIds).catch(error => {
          console.error('Error sending proposal notifications via Telegram bot:', error);
        });
      });
    }

    console.log('Successfully created proposal notifications for clients');
  } catch (error) {
    console.error('Error creating proposal notifications for clients:', error);
    // Don't throw error - this is not critical functionality
  }
}
