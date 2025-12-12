"use server";

import {CreateServiceData, CreateServiceWithProviderData} from "@/schemas/service/createServiceSchema";
import {prisma} from "@/lib/db/prisma";
import { PhotoItem } from "./hooks/useServicePhotos";
import { loadServicePhotoToS3Storage } from '@/lib/service/media';
import { saveServicePhoto } from "./photos";
import {createLogger} from '@/lib/utils/logger';

export interface CreatedServiceResponse {
  serviceId: number
}

export interface CreatedServiceWithProviderResponse extends CreatedServiceResponse {
  providerId: number
}

// ============================================================================
// Публичные функции
// ============================================================================

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
  const logger = createLogger('createServiceWithProvider', traceId);
  
  logger.info('Начало создания сервиса с провайдером', {
    clientId,
    serviceName: createServiceData.name
  });

  await checkProviderExists(clientId, createServiceData.name, traceId);
  const createdProvider = await createProviderInDb(clientId, createServiceData, traceId);
  const createdService = await createService(createServiceData, createdProvider.id, photos, traceId);

  logger.info('Сервис с провайдером успешно создан', {
    clientId,
    providerId: createdProvider.id,
    serviceId: createdService.serviceId,
    serviceName: createServiceData.name
  });

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
  const logger = createLogger('createService', traceId);
  
  logger.info('Начало создания сервиса', {
    providerId,
    serviceName: createServiceData.name,
    categoryId: createServiceData.tcategories_id,
    areaId: createServiceData.tarea_id
  });

  try {
    validateServiceInput(providerId);
    const createdService = await createServiceInDb(createServiceData, providerId, traceId);

    if (photos && photos.length > 0) {
      await processServicePhotos(createdService.id, photos, traceId);
    }

    logger.info('Сервис успешно создан', {
      providerId,
      serviceId: createdService.id,
      serviceName: createServiceData.name
    });

    return {serviceId: createdService.id};
  } catch (error) {
    logger.error('Критическая ошибка при создании сервиса', {
      providerId,
      serviceName: createServiceData.name
    }, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`[createService]: Ошибка при создании сервиса! ${errorMessage}`);
  }
}

// ============================================================================
// Приватные функции (в порядке использования)
// ============================================================================

/**
 * Проверяет существование провайдера для клиента
 */
async function checkProviderExists(
  clientId: number, 
  serviceName: string,
  traceId?: string
): Promise<void> {
  const logger = createLogger('checkProviderExists', traceId);
  
  const providerId = await prisma.tproviders.findFirst({
    where: { tclients_id: clientId },
    select: {id: true}
  });

  if(providerId) {
    logger.error('Провайдер уже существует', {
      clientId,
      existingProviderId: providerId.id,
      serviceName
    });
    throw new Error('[createServiceWithProvider]: Provider already exists!');
  }
}

/**
 * Создает провайдера в БД
 */
async function createProviderInDb(
  clientId: number,
  createServiceData: CreateServiceWithProviderData,
  traceId?: string
): Promise<{id: number}> {
  const logger = createLogger('createProviderInDb', traceId);
  
  try {
    const createdProvider = await prisma.tproviders.create({
      data: {
        tclients_id: clientId,
        company_name: createServiceData.providerCompanyName,
        phone: createServiceData.providerPhone,
        contact_info: {contact_person: createServiceData.providerContactPerson},
        status: 'active',
      },
      select: {id: true}
    });

    if(!createdProvider) {
      logger.error('Провайдер не был создан (null результат)', {
        clientId,
        companyName: createServiceData.providerCompanyName
      });
      throw new Error('[createServiceWithProvider]: Cant create provider!');
    }

    return createdProvider;
  } catch (error) {
    logger.error('Ошибка создания провайдера в БД', {
      clientId,
      companyName: createServiceData.providerCompanyName,
      serviceName: createServiceData.name
    }, error);
    throw error;
  }
}

/**
 * Валидирует входные данные для создания сервиса
 */
function validateServiceInput(providerId: number): void {
  if(!providerId) {
    throw new Error(`[createService]: 'providerId' (${providerId}) required!`);
  }
}

/**
 * Создает сервис в БД с контактами и локацией
 */
async function createServiceInDb(
  createServiceData: CreateServiceData,
  providerId: number,
  traceId?: string
): Promise<{id: number}> {
  const logger = createLogger('createServiceInDb', traceId);
  
  try {
    const createdService = await prisma.tservices.create({
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
            email: 'default@example.com',
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

    if(!createdService) {
      logger.error('Сервис не был создан (null результат)', {
        providerId,
        serviceName: createServiceData.name
      });
      throw new Error('[createService]: Cant create service!');
    }

    return createdService;
  } catch (error) {
    logger.error('Ошибка создания сервиса в БД (Prisma)', {
      providerId,
      serviceName: createServiceData.name,
      categoryId: createServiceData.tcategories_id,
      areaId: createServiceData.tarea_id
    }, error);
    throw error;
  }
}

/**
 * Обрабатывает загрузку фотографий для сервиса
 */
async function processServicePhotos(
  serviceId: number,
  photos: PhotoItem[],
  traceId?: string
): Promise<void> {
  const logger = createLogger('processServicePhotos', traceId);
  const newPhotos = photos.filter(p => !p.isExisting && p.file);
  
  await Promise.all(
    newPhotos.map(async (photo) => {
      try {
        const uploadResult = await loadServicePhotoToS3Storage(serviceId, photo.file!);
        await saveServicePhoto(serviceId, {
          fileName: uploadResult.fileName,
          isPrimary: photo.isPrimary
        });
      } catch (photoError) {
        logger.error('Ошибка при обработке фото', {
          serviceId,
          fileName: photo.file!.name,
          isPrimary: photo.isPrimary
        }, photoError);
        // Не прерываем процесс, продолжаем с остальными фото
      }
    })
  );
}
