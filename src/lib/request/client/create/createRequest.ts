"use server";

import { prisma } from '@/lib/db/prisma';
import { getUserAuthOrThrow } from '@/lib/auth/userAuth';
import { currentLocation } from '@/lib/location/currentLocation';
import { createAlert } from '@/lib/request/provider/alert/createAlert';
import { 
  CreateRequestResult, 
  AccomodationFormDto, 
  TransportFormDto, 
  EntertainmentFormDto 
} from './types';

export async function createAccommodationRequest(dto: AccomodationFormDto): Promise<CreateRequestResult> {
  return createRequest(dto, 'accommodation', {
    tbids_accomodation_attrs: {
      create: dto.tbids_accomodation_attrs,
    },
  });
}

export async function createTransportRequest(dto: TransportFormDto): Promise<CreateRequestResult> {
  return createRequest(dto, 'transport', {
    tbids_transport_attrs: {
      create: dto.tbids_transport_attrs,
    },
  });
}

export async function createEntertainmentRequest(dto: EntertainmentFormDto): Promise<CreateRequestResult> {
  return createRequest(dto, 'entertainment', {
    tbids_entertainment_attrs: {
      create: dto.tbids_entertainment_attrs,
    },
  });
}

async function createRequest(
    dto: AccomodationFormDto | TransportFormDto | EntertainmentFormDto,
    categorySysname: string,
    specificAttrs: any
): Promise<CreateRequestResult> {
  const user = await getUserAuthOrThrow();

  console.log(`Пользователь ${user.userId} создает заявку ${categorySysname}`);

  const category = await prisma.tcategories.findUnique({
    where: { sysname: categorySysname },
    select: { id: true },
  });

  console.log(`Категория ${categorySysname} найдена: ${category?.id}`);

  const location = await currentLocation();
  if (!location) {
  throw new Error('Не найдена текущая локация пользователя');
}

  console.log(`Локация найдена: ${location.id}`);

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
    // specific attributes for each request type
    ...specificAttrs,
  },
  select: { id: true },
});

console.log(`Заявка создана: ${created.id}`);

// Create alerts for matching providers
try {
  await createAlert(created.id);
} catch (error) {
  console.error('Failed to create alerts for bid:', created.id, error);
  // Don't throw error here - bid creation should succeed even if alerts fail
}

return { id: created.id };
}
