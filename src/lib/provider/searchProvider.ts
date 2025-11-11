import {prisma} from "@/lib/db/prisma";

/**
 * Получаем id "активного" провайдера по `tclients.id`
 * */
export async function getActiveProviderIdBYClientId(clientId: number): Promise<{id: number}> {
  return prisma.tproviders.findFirst({
    where: {
      tclients_id: clientId,
      status: 'active'
    },
    select: { id: true }
  });
}

/**
 * Получаем информацию о провайдере по `tclients.id` с любым статусом
 * @returns Информацию о провайдере или null, если провайдера нет
 */
export async function getProviderInfoByClientId(clientId: number): Promise<{id: number; status: string} | null> {
  const provider = await prisma.tproviders.findFirst({
    where: {
      tclients_id: clientId
    },
    select: {
      id: true,
      status: true
    },
    orderBy: {
      created_at: 'desc' // Берем последний созданный, если их несколько
    }
  });

  return provider;
}