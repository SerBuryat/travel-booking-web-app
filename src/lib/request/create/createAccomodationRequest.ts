"use server";

import { prisma } from '@/lib/db/prisma';
import { getUserAuthOrThrow } from '@/lib/auth/userAuth';
import { AccomodationFormDto, CreateRequestResult } from './types';
import { currentLocation } from '@/lib/location/currentLocation';

/**
 * Creates accomodation bid using nested writes.
 * - Inserts into `tbids` with base fields
 * - Creates related `tbids_accomodation_attrs`
 */
export async function createAccomodationRequest(dto: AccomodationFormDto): Promise<CreateRequestResult> {
  const user = await getUserAuthOrThrow();

  const category = await prisma.tcategories.findUnique({
    where: { sysname: 'accommodation' },
    select: { id: true },
  });

  const location = await currentLocation();
  if (!location) {
    throw new Error('Не найдена текущая локация пользователя');
  }

  const created = await prisma.tbids.create({
    data: {
      // server-set fields
      tclients_id: user.userId,
      // from dto (schema is 1:1 to columns)
      tarea_id: location.id,
      type: 'standard',
      budget: dto.budget,
      status: 'open',
      comment: dto.comment ?? null,
      is_flexible: false,
      // number triggers in DB
      tcategories_id: category?.id ?? null,
      tbids_accomodation_attrs: {
        create: dto.tbids_accomodation_attrs,
      },
    },
    select: { id: true },
  });

  return { id: created.id };
}

// no mappers, dto already 1:1 with db columns


