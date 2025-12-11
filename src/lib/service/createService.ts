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
    photos?: PhotoItem[]
): Promise<CreatedServiceWithProviderResponse> {
  const photosCount = photos?.length || 0;
  const newPhotosCount = photos?.filter(p => !p.isExisting && p.file).length || 0;

  log(
    'createServiceWithProvider',
    'Проверка существования провайдера',
    'info',
    { clientId, serviceName: createServiceData.name }
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
      { clientId, existingProviderId: providerId.id, serviceName: createServiceData.name }
    );
    throw new Error('[createServiceWithProvider]: Provider already exists!');
  }

  log(
    'createServiceWithProvider',
    'Создание нового провайдера',
    'info',
    {
      clientId,
      companyName: createServiceData.providerCompanyName,
      contactPerson: createServiceData.providerContactPerson,
      phone: createServiceData.providerPhone ? '***' : null // Не логируем полный телефон
    }
  );

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
      error
    );
    throw error;
  }

  if(!createdProvider) {
    log(
      'createServiceWithProvider',
      'Провайдер не был создан (null результат)',
      'error',
      { clientId, companyName: createServiceData.providerCompanyName }
    );
    throw new Error('[createServiceWithProvider]: Cant create provider!');
  }

  log(
    'createServiceWithProvider',
    'Провайдер успешно создан',
    'info',
    { clientId, providerId: createdProvider.id, companyName: createServiceData.providerCompanyName }
  );

  log(
    'createServiceWithProvider',
    'Создание сервиса для провайдера',
    'info',
    {
      providerId: createdProvider.id,
      serviceName: createServiceData.name,
      categoryId: createServiceData.tcategories_id,
      photosCount,
      newPhotosCount
    }
  );

  const createdService = await createService(createServiceData, createdProvider.id, photos);

  log(
    'createServiceWithProvider',
    'Сервис с провайдером успешно создан',
    'info',
    {
      clientId,
      providerId: createdProvider.id,
      serviceId: createdService.serviceId,
      serviceName: createServiceData.name
    }
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
    photos?: PhotoItem[]
): Promise<CreatedServiceResponse> {

  try {
    if(!providerId) {
      log(
        'createService',
        'Ошибка валидации: providerId не указан',
        'error',
        { providerId, serviceName: createServiceData.name }
      );
      throw new Error(`[createService]: 'providerId' (${providerId}) required!`);
    }

    const photosCount = photos?.length || 0;
    const newPhotosCount = photos?.filter(p => !p.isExisting && p.file).length || 0;
    const totalPhotosSizeMB = photos
      ?.filter(p => !p.isExisting && p.file)
      .reduce((sum, p) => sum + (p.file?.size || 0), 0) / 1024 / 1024 || 0;

    log(
      'createService',
      'Создание сервиса в БД',
      'info',
      {
        providerId,
        serviceName: createServiceData.name,
        categoryId: createServiceData.tcategories_id,
        areaId: createServiceData.tarea_id,
        price: createServiceData.price,
        photosCount,
        newPhotosCount,
        totalPhotosSizeMB: totalPhotosSizeMB.toFixed(2)
      }
    );

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
        error
      );
      throw error;
    }

    if(!createdService) {
      log(
        'createService',
        'Сервис не был создан (null результат)',
        'error',
        { providerId, serviceName: createServiceData.name }
      );
      throw new Error('[createService]: Cant create service!');
    }

    log(
      'createService',
      'Сервис успешно создан в БД',
      'info',
      { providerId, serviceId: createdService.id, serviceName: createServiceData.name }
    );

    // Сохраняем фото в storage, потом в БД
    if (photos && photos.length > 0) {
      const newPhotos = photos.filter(p => !p.isExisting && p.file);
      
      log(
        'createService',
        'Начало загрузки фото',
        'info',
        {
          serviceId: createdService.id,
          totalPhotos: photos.length,
          newPhotos: newPhotos.length,
          existingPhotos: photos.length - newPhotos.length
        }
      );

      await Promise.all(
        newPhotos.map(async (photo) => {
          const fileName = photo.file!.name;
          const fileSizeMB = (photo.file!.size / 1024 / 1024).toFixed(2);

          try {
            log(
              'createService',
              'Загрузка фото в S3',
              'info',
              {
                serviceId: createdService.id,
                fileName,
                fileSizeMB,
                isPrimary: photo.isPrimary
              }
            );

            const uploadResult = await loadServicePhotoToS3Storage(createdService.id, photo.file!);

            log(
              'createService',
              'Сохранение фото в БД',
              'info',
              {
                serviceId: createdService.id,
                fileName: uploadResult.fileName,
                isPrimary: photo.isPrimary
              }
            );

            const savedPhoto = await saveServicePhoto(createdService.id, {
              fileName: uploadResult.fileName,
              isPrimary: photo.isPrimary
            });

            log(
              'createService',
              'Фото успешно сохранено',
              'info',
              {
                serviceId: createdService.id,
                originalFileName: fileName,
                s3FileName: uploadResult.fileName,
                photoId: savedPhoto.id,
                photoUrl: savedPhoto.url,
                isPrimary: photo.isPrimary
              }
            );
          } catch (photoError) {
            log(
              'createService',
              'Ошибка при обработке фото',
              'error',
              {
                serviceId: createdService.id,
                fileName,
                fileSizeMB,
                isPrimary: photo.isPrimary,
                errorType: photoError instanceof Error ? photoError.constructor.name : 'Unknown'
              },
              photoError
            );
            // Не прерываем процесс, продолжаем с остальными фото
          }
        })
      );
    }

    return {serviceId: createdService.id};
  } catch (error) {
    log(
      'createService',
      'Критическая ошибка при создании сервиса',
      'error',
      { providerId, serviceName: createServiceData.name },
      error
    );
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`[createService]: Ошибка при создании сервиса! ${errorMessage}`);
  }
}