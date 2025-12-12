"use server";

import {CreateServiceData, CreateServiceWithProviderData} from "@/schemas/service/createServiceSchema";
import {prisma} from "@/lib/db/prisma";
import { PhotoItem } from "./hooks/useServicePhotos";
import { loadServicePhotoToS3Storage } from '@/lib/service/media';
import { saveServicePhoto } from "./photos";
import {log} from '@/lib/utils/logger';

export interface CreatedServiceResponse {
  serviceId: number
}

export interface CreatedServiceWithProviderResponse extends CreatedServiceResponse {
  providerId: number
}

/*
* Создание сервиса вместе с провайдером.
* (первое создание сервиса пользователем)
* **/
export async function createServiceWithProvider(
    createServiceData: CreateServiceWithProviderData,
    clientId: number,
    photos?: PhotoItem[],
    traceId?: string
): Promise<CreatedServiceWithProviderResponse> {
  log(
    'createServiceWithProvider',
    'Начало создания сервиса с провайдером',
    'info',
    { clientId, serviceName: createServiceData.name },
    undefined,
    traceId
  );

  const providerId = await prisma.tproviders.findFirst({
    where: { tclients_id: clientId },
    select: {id: true}
  });

  if(providerId) {
    log(
      'createServiceWithProvider',
      'Провайдер уже существует',
      'error',
      { clientId, existingProviderId: providerId.id, serviceName: createServiceData.name },
      undefined,
      traceId
    );
    throw new Error('[createServiceWithProvider]: Provider already exists!');
  }

  // todo - пока без транзакции
  let createdProvider;
  try {
    createdProvider = await prisma.tproviders.create({
      data: {
        tclients_id: clientId,
        company_name: createServiceData.providerCompanyName,
        phone: createServiceData.providerPhone,
        contact_info: {contact_person: createServiceData.providerContactPerson},
        status: 'active', // По умолчанию активный
      },
      select: {id: true}
    });
  } catch (error) {
    log(
      'createServiceWithProvider',
      'Ошибка создания провайдера в БД',
      'error',
      {
        clientId,
        companyName: createServiceData.providerCompanyName,
        serviceName: createServiceData.name
      },
      error,
      traceId
    );
    throw error;
  }

  if(!createdProvider) {
    log(
      'createServiceWithProvider',
      'Провайдер не был создан (null результат)',
      'error',
      { clientId, companyName: createServiceData.providerCompanyName },
      undefined,
      traceId
    );
    throw new Error('[createServiceWithProvider]: Cant create provider!');
  }

  const createdService = await createService(createServiceData, createdProvider.id, photos, traceId);

  log(
    'createServiceWithProvider',
    'Сервис с провайдером успешно создан',
    'info',
    {
      clientId,
      providerId: createdProvider.id,
      serviceId: createdService.serviceId,
      serviceName: createServiceData.name
    },
    undefined,
    traceId
  );

  return {serviceId: createdService.serviceId, providerId: createdProvider.id};
}

/*
* Создание сервиса, существующим провайдером.
*
**/
export async function createService(
    createServiceData: CreateServiceData,
    providerId: number,
    photos?: PhotoItem[],
    traceId?: string
): Promise<CreatedServiceResponse> {
  log(
    'createService',
    'Начало создания сервиса',
    'info',
    {
      providerId,
      serviceName: createServiceData.name,
      categoryId: createServiceData.tcategories_id,
      areaId: createServiceData.tarea_id
    },
    undefined,
    traceId
  );

  try {
    if(!providerId) {
      log(
        'createService',
        'Ошибка валидации: providerId не указан',
        'error',
        { providerId, serviceName: createServiceData.name },
        undefined,
        traceId
      );
      throw new Error(`[createService]: 'providerId' (${providerId}) required!`);
    }

    let createdService;
    try {
      createdService = await prisma.tservices.create({
        data: {
          name: createServiceData.name,
          description: createServiceData.description,
          price: parseFloat(createServiceData.price),
          tcategories_id: createServiceData.tcategories_id,
          provider_id: providerId,
          active: true,
          status: 'published',
          service_options: createServiceData.serviceOptions || null,
          event_date: createServiceData.event_date || null,
          tcontacts: {
            create: {
              email: 'default@example.com', // Обязательное поле в БД, проставляем мок
              phone: createServiceData.phone || null,
              tg_username: createServiceData.tg_username || null,
              website: createServiceData.website || null,
              whatsap: createServiceData.whatsap || null,
            }
          },
          tlocations: {
            create: {
              address: createServiceData.address,
              tarea_id: createServiceData.tarea_id,
            }
          }
        },
        select: {id: true}
      });
    } catch (error) {
      log(
        'createService',
        'Ошибка создания сервиса в БД (Prisma)',
        'error',
        {
          providerId,
          serviceName: createServiceData.name,
          categoryId: createServiceData.tcategories_id,
          areaId: createServiceData.tarea_id
        },
        error,
        traceId
      );
      throw error;
    }

    if(!createdService) {
      log(
        'createService',
        'Сервис не был создан (null результат)',
        'error',
        { providerId, serviceName: createServiceData.name },
        undefined,
        traceId
      );
      throw new Error('[createService]: Cant create service!');
    }

    // Сохраняем фото в storage, потом в БД
    if (photos && photos.length > 0) {
      const newPhotos = photos.filter(p => !p.isExisting && p.file);
      
      await Promise.all(
        newPhotos.map(async (photo) => {
          try {
            const uploadResult = await loadServicePhotoToS3Storage(createdService.id, photo.file!);
            await saveServicePhoto(createdService.id, {
              fileName: uploadResult.fileName,
              isPrimary: photo.isPrimary
            });
          } catch (photoError) {
            log(
              'createService',
              'Ошибка при обработке фото',
              'error',
              {
                serviceId: createdService.id,
                fileName: photo.file!.name,
                isPrimary: photo.isPrimary
              },
              photoError,
              traceId
            );
            // Не прерываем процесс, продолжаем с остальными фото
          }
        })
      );
    }

    log(
      'createService',
      'Сервис успешно создан',
      'info',
      { providerId, serviceId: createdService.id, serviceName: createServiceData.name },
      undefined,
      traceId
    );

    return {serviceId: createdService.id};
  } catch (error) {
    log(
      'createService',
      'Критическая ошибка при создании сервиса',
      'error',
      { providerId, serviceName: createServiceData.name },
      error,
      traceId
    );
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`[createService]: Ошибка при создании сервиса! ${errorMessage}`);
  }
}