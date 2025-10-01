"use server";

import { prisma } from '@/lib/db/prisma';
import { getUserAuthOrThrow } from '@/lib/auth/userAuth';
import { CreateRequestResult, EntertainmentFormDto } from './types';
import { currentLocation } from '@/lib/location/currentLocation';

export async function createEntertainmentRequest(dto: EntertainmentFormDto): Promise<CreateRequestResult> {
  const user = await getUserAuthOrThrow();

  const category = await prisma.tcategories.findUnique({
    where: { sysname: 'entertainment' },
    select: { id: true },
  });

  const location = await currentLocation();
  if (!location) {
    throw new Error('Не найдена текущая локация пользователя');
  }

  const created = await prisma.tbids.create({
    data: {
      tclients_id: user.userId,
      tarea_id: location.id,
      type: 'standard',
      budget: dto.budget,
      status: 'open',
      comment: dto.comment ?? null,
      is_flexible: false,
      tcategories_id: category?.id ?? null,
      tbids_entertainment_attrs: {
        create: dto.tbids_entertainment_attrs,
      },
    },
    select: { id: true },
  });

  return { id: created.id };
}

// no mappers, dto already 1:1 with db columns


