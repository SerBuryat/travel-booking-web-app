"use server";

import { prisma } from '@/lib/db/prisma';
import { getUserAuthOrThrow } from '@/lib/auth/getUserAuth';
import { currentLocation } from '@/lib/location/currentLocation';
import { createAlert } from '@/lib/request/client/create/createAlert';
import { log } from '@/lib/utils/logger';
import { 
  CreateRequestResult, 
  AccomodationFormDto, 
  TransportFormDto, 
  EntertainmentFormDto,
  FoodFormDto,
  HealthFormDto,
  PackageFormDto
} from './types';

export async function createAccommodationRequest(dto: AccomodationFormDto, traceId?: string): Promise<CreateRequestResult> {
  return createRequest(dto, 'accommodation', {
    tbids_accomodation_attrs: {
      create: dto.tbids_accomodation_attrs,
    },
  }, traceId);
}

export async function createTransportRequest(dto: TransportFormDto, traceId?: string): Promise<CreateRequestResult> {
  return createRequest(dto, 'transport', {
    tbids_transport_attrs: {
      create: dto.tbids_transport_attrs,
    },
  }, traceId);
}

export async function createEntertainmentRequest(dto: EntertainmentFormDto, traceId?: string): Promise<CreateRequestResult> {
  return createRequest(dto, 'entertainment', {
    tbids_entertainment_attrs: {
      create: dto.tbids_entertainment_attrs,
    },
  }, traceId);
}

export async function createFoodRequest(dto: FoodFormDto, traceId?: string): Promise<CreateRequestResult> {
  return createRequest(dto, 'food', {
    tbids_food_attrs: {
      create: dto.tbids_food_attrs,
    },
  }, traceId);
}

export async function createHealthRequest(dto: HealthFormDto, traceId?: string): Promise<CreateRequestResult> {
  return createRequest(dto, 'health', {
    tbids_health_attrs: {
      create: dto.tbids_health_attrs,
    },
  }, traceId);
}

export async function createPackageRequest(dto: PackageFormDto, traceId?: string): Promise<CreateRequestResult> {
  return createRequest(dto, 'package', {
    tbids_package_attrs: {
      create: dto.tbids_package_attrs,
    },
  }, traceId);
}

async function createRequest(
    dto: AccomodationFormDto | TransportFormDto | EntertainmentFormDto | FoodFormDto | HealthFormDto | PackageFormDto,
    categorySysname: string,
    specificAttrs: any,
    traceId?: string
): Promise<CreateRequestResult> {
  log(
    'createRequest',
    'Начало создания заявки',
    'info',
    {
      categorySysname,
      budget: dto.budget
    },
    undefined,
    traceId
  );

  try {
    const user = await getUserAuthOrThrow();

    const category = await prisma.tcategories.findUnique({
      where: { sysname: categorySysname },
      select: { id: true },
    });

    if (!category) {
      log(
        'createRequest',
        'Категория не найдена',
        'error',
        {
          categorySysname,
          userId: user.userId
        },
        undefined,
        traceId
      );
      throw new Error(`Категория ${categorySysname} не найдена`);
    }

    const location = await currentLocation();
    if (!location) {
      log(
        'createRequest',
        'Локация пользователя не найдена',
        'error',
        {
          categorySysname,
          userId: user.userId
        },
        undefined,
        traceId
      );
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
        tcategories_id: category.id,
        // specific attributes for each request type
        ...specificAttrs,
      },
      select: { id: true },
    });

    // Create alerts for matching providers
    try {
      await createAlert(created.id);
    } catch (error) {
      log(
        'createRequest',
        'Ошибка создания уведомлений для провайдеров (неблокирующий)',
        'warn',
        {
          requestId: created.id,
          categorySysname
        },
        error,
        traceId
      );
      // Don't throw error here - bid creation should succeed even if alerts fail
    }

    log(
      'createRequest',
      'Заявка успешно создана',
      'info',
      {
        requestId: created.id,
        categorySysname,
        userId: user.userId,
        categoryId: category.id
      },
      undefined,
      traceId
    );

    return { id: created.id };
  } catch (error) {
    log(
      'createRequest',
      'Критическая ошибка при создании заявки',
      'error',
      {
        categorySysname
      },
      error,
      traceId
    );
    throw error;
  }
}
