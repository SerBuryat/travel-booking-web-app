'use server';

import { withUserAuth } from '@/lib/auth/withUserAuth';
import { prisma } from '@/lib/db/prisma';
import { getActiveProviderId } from '@/lib/provider/searchProvider';

export async function markAlertsAsRead(providerId: number, bidId: number) {
  if (!providerId || !bidId) {
    return;
  }

  await withUserAuth(async ({ userAuth }) => {
    if (userAuth.role !== 'provider') {
      return;
    }

    const activeProvider = await getActiveProviderId(userAuth.userId);
    if (!activeProvider || activeProvider.id !== providerId) {
      return;
    }

    await prisma.talerts.updateMany({
      where: {
        tproviders_id: providerId,
        tbids_id: bidId,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });
  });
}


