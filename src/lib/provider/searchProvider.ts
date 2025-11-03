import {prisma} from "@/lib/db/prisma";

/**
 * Получаем id "активного" провайдера по `tclients.id`
 * */
export async function getActiveProviderId(clientId: number): Promise<{id: number}> {
  return prisma.tproviders.findFirst({
    where: {
      tclients_id: clientId,
      status: 'active'
    },
    select: { id: true }
  });
}