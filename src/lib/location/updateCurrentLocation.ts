'use server';

import { withUserAuth } from '@/lib/auth/withUserAuth';
import { prisma } from '@/lib/db/prisma';
import { SELECTABLE_AREA_TIER } from '@/lib/location/constants';

/**
 * Обновляет текущую локацию пользователя (поле tclients.tarea_id).
 *
 * Возвращает:
 * - true — если локация успешно обновлена
 * - false — если указанная локация не найдена
 * - null — если пользователь не аутентифицирован
 */
export async function updateCurrentLocation(locationId: number): Promise<boolean | null> {
  if (!Number.isFinite(locationId) || locationId <= 0) {
    throw new Error('Invalid locationId');
  }

  return withUserAuth(async ({ userAuth }) => {
    const existsArea = await prisma.tarea.findUnique({
      where: { id: locationId },
      select: { id: true, tier: true },
    });

    if (!existsArea) {
      return false;
    }

    if (existsArea.tier !== SELECTABLE_AREA_TIER) {
      throw new Error('Что-то пошло не так, выбранная локация не является финальной(tier = 3)');
    }

    await prisma.tclients.update({
      where: { id: userAuth.userId },
      data: { tarea_id: locationId },
    });

    return true;
  });
}


