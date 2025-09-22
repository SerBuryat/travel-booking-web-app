'use server';

import { withUserAuth } from '@/lib/auth/withUserAuth';
import type { UserAuth } from '@/lib/auth/userAuth';
import { prisma } from '@/lib/db/prisma';

export type CurrentLocation = { id: number; name: string } | null;

/**
 * Возвращает текущую локацию пользователя
 * @throws {Error} Если клиент не найден или нет выбранной локации
 * @throws {Error} Если локация не найдена
 */
export async function currentLocation(): Promise<CurrentLocation> {
  return withUserAuth(async ({ userAuth }) => {
    const tareaId = await getClientAreaId(userAuth);
    const area = await getAreaById(tareaId);
    return { id: area.id, name: area.name };
  });
}

async function getClientAreaId(userAuth: UserAuth): Promise<number> {
  const client = await prisma.tclients.findUnique({
    where: { id: userAuth.userId },
    select: { tarea_id: true },
  });
  if (!client || !client.tarea_id) {
    console.error(`Клиент с id = ${userAuth.userId} не найден или нет выбранной локации`);
    throw new Error(`Клиент с id = ${userAuth.userId} не найден или нет выбранной локации`);
  }
  return client.tarea_id;
}

async function getAreaById(areaId: number): Promise<{ id: number; name: string }> {
  const area = await prisma.tarea.findUnique({
    where: { id: areaId },
    select: { id: true, name: true },
  });
  if (!area) {
    console.error(`Локация с id = ${areaId} не найдена`);
    throw new Error(`Локация с id = ${areaId} не найдена`);
  }
  return area;
}


