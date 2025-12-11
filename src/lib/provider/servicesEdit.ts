'use server';

import { prisma } from '@/lib/db/prisma';
import { getUserAuthOrThrow } from '@/lib/auth/getUserAuth';
import { CreateServiceData } from '@/schemas/service/createServiceSchema';
import { loadServicePhotoToS3Storage, deleteServicePhotoFromS3Storage } from '@/lib/service/media';
import {log} from '@/lib/utils/logger';

/**
 * Данные сервиса для редактирования
 */
export interface ServiceEditData {
  name: string;
  description: string | null;
  price: string;
  tcategories_id: number;
  address: string;
  tarea_id: number;
  phone: string | null;
  tg_username: string | null;
  website: string | null;
  whatsap: string | null;
  serviceOptions: string[] | null;
  photos: ExistingPhotoData[];
}

/**
 * Данные существующего фото
 */
export interface ExistingPhotoData {
  id: number;
  url: string;
  isPrimary: boolean;
  fileName: string;
}

/**
 * Данные для обновления фотографий
 */
export interface PhotoUpdateData {
  existing: Array<{ id: number; fileName: string; isPrimary: boolean }>;
  new: Array<{ file: File; isPrimary: boolean }>;
}

/**
 * Извлечение имени файла из URL
 */
function extractFileNameFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

/**
 * Удаление сервиса (soft delete).
 * Проверяет, что сервис принадлежит текущему провайдеру.
 * 
 * @param {number} serviceId - ID сервиса для удаления
 * @throws {Error} Если пользователь не авторизован, не является провайдером или сервис не принадлежит ему
 */
export async function deleteService(serviceId: number): Promise<void> {
  // Получаем авторизованного пользователя
  const userAuth = await getUserAuthOrThrow();

  // Проверяем роль и наличие providerId
  if (userAuth.role !== 'provider' || !userAuth.providerId) {
    throw new Error('Access denied: Only providers can delete services');
  }

  // Находим сервис
  const service = await prisma.tservices.findUnique({
    where: { id: serviceId },
    select: { provider_id: true },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  // Проверяем принадлежность сервиса провайдеру
  if (service.provider_id !== userAuth.providerId) {
    throw new Error('Access denied: This service does not belong to you');
  }

  // Выполняем soft delete
  await prisma.tservices.update({
    where: { id: serviceId },
    data: {
      active: false,
      status: 'archived',
    },
  });
}

/**
 * Получение данных сервиса для редактирования.
 * Проверяет, что сервис принадлежит текущему провайдеру.
 * 
 * @param {number} serviceId - ID сервиса для редактирования
 * @returns {Promise<ServiceEditData>} Данные сервиса для формы
 * @throws {Error} Если пользователь не авторизован, не является провайдером, сервис не найден или не принадлежит ему
 */
export async function getServiceForEdit(serviceId: number): Promise<ServiceEditData> {
  log(
    'getServiceForEdit',
    'Получение данных сервиса для редактирования',
    'info',
    { serviceId }
  );

  // Получаем авторизованного пользователя
  let userAuth;
  try {
    userAuth = await getUserAuthOrThrow();
  } catch (error) {
    log(
      'getServiceForEdit',
      'Ошибка авторизации пользователя',
      'error',
      { serviceId },
      error
    );
    throw error;
  }

  // Проверяем роль и наличие providerId
  if (userAuth.role !== 'provider' || !userAuth.providerId) {
    log(
      'getServiceForEdit',
      'Доступ запрещен: пользователь не является провайдером',
      'error',
      { serviceId, userId: userAuth.userId, role: userAuth.role, providerId: userAuth.providerId }
    );
    throw new Error('Access denied: Only providers can edit services');
  }

  log(
    'getServiceForEdit',
    'Поиск сервиса в БД',
    'info',
    { serviceId, providerId: userAuth.providerId }
  );

  // Находим сервис со всеми связанными данными
  let service;
  try {
    service = await prisma.tservices.findUnique({
      where: { id: serviceId },
      include: {
        tcategories: true,
        tlocations: true,
        tcontacts: true,
        tphotos: {
          orderBy: [
            { is_primary: 'desc' },
            { id: 'asc' }
          ]
        }
      },
    });
  } catch (error) {
    log(
      'getServiceForEdit',
      'Ошибка поиска сервиса в БД',
      'error',
      { serviceId, providerId: userAuth.providerId },
      error
    );
    throw error;
  }

  if (!service) {
    log(
      'getServiceForEdit',
      'Сервис не найден',
      'error',
      { serviceId, providerId: userAuth.providerId }
    );
    throw new Error('Service not found');
  }

  // Проверяем принадлежность сервиса провайдеру
  if (service.provider_id !== userAuth.providerId) {
    log(
      'getServiceForEdit',
      'Доступ запрещен: сервис не принадлежит провайдеру',
      'error',
      { serviceId, providerId: userAuth.providerId, serviceProviderId: service.provider_id }
    );
    throw new Error('Access denied: This service does not belong to you');
  }

  // Проверяем, что сервис не архивирован
  if (!service.active || service.status === 'archived') {
    log(
      'getServiceForEdit',
      'Невозможно редактировать архивированный сервис',
      'error',
      { serviceId, providerId: userAuth.providerId, active: service.active, status: service.status }
    );
    throw new Error('Cannot edit archived service');
  }

  // Получаем первую локацию и контакт
  const location = service.tlocations[0];
  const contact = service.tcontacts[0];

  if (!location) {
    log(
      'getServiceForEdit',
      'Локация сервиса не найдена',
      'error',
      { serviceId, providerId: userAuth.providerId }
    );
    throw new Error('Service location not found');
  }

  log(
    'getServiceForEdit',
    'Данные сервиса успешно получены',
    'info',
    {
      serviceId,
      providerId: userAuth.providerId,
      serviceName: service.name,
      photosCount: service.tphotos.length
    }
  );

  // Маппинг данных для формы
  return {
    name: service.name,
    description: service.description,
    price: service.price.toString(),
    tcategories_id: service.tcategories_id,
    address: location.address,
    tarea_id: location.tarea_id,
    phone: contact?.phone || null,
    tg_username: contact?.tg_username || null,
    website: contact?.website || null,
    whatsap: contact?.whatsap || null,
    serviceOptions: service.service_options as string[] | null,
    photos: service.tphotos.map(photo => ({
      id: photo.id,
      url: photo.url,
      isPrimary: photo.is_primary,
      fileName: extractFileNameFromUrl(photo.url)
    }))
  };
}

/**
 * Обновление существующего сервиса.
 * Проверяет, что сервис принадлежит текущему провайдеру.
 * 
 * @param {number} serviceId - ID сервиса для обновления
 * @param {CreateServiceData} data - Новые данные сервиса
 * @param {PhotoUpdateData} photos - Данные фотографий (существующие и новые)
 * @throws {Error} Если пользователь не авторизован, не является провайдером или сервис не принадлежит ему
 */
export async function updateService(
  serviceId: number,
  data: CreateServiceData,
  photos: PhotoUpdateData
): Promise<void> {
  const existingPhotosCount = photos.existing?.length || 0;
  const newPhotosCount = photos.new?.length || 0;
  const totalNewPhotosSizeMB = photos.new
    ?.reduce((sum, p) => sum + (p.file?.size || 0), 0) / 1024 / 1024 || 0;

  log(
    'updateService',
    'Начало обновления сервиса',
    'info',
    {
      serviceId,
      serviceName: data.name,
      categoryId: data.tcategories_id,
      areaId: data.tarea_id,
      existingPhotosCount,
      newPhotosCount,
      totalNewPhotosSizeMB: totalNewPhotosSizeMB.toFixed(2)
    }
  );

  // Получаем авторизованного пользователя
  let userAuth;
  try {
    userAuth = await getUserAuthOrThrow();
  } catch (error) {
    log(
      'updateService',
      'Ошибка авторизации пользователя',
      'error',
      { serviceId },
      error
    );
    throw error;
  }

  // Проверяем роль и наличие providerId
  if (userAuth.role !== 'provider' || !userAuth.providerId) {
    log(
      'updateService',
      'Доступ запрещен: пользователь не является провайдером',
      'error',
      { serviceId, userId: userAuth.userId, role: userAuth.role, providerId: userAuth.providerId }
    );
    throw new Error('Access denied: Only providers can update services');
  }

  log(
    'updateService',
    'Поиск сервиса в БД',
    'info',
    { serviceId, providerId: userAuth.providerId }
  );

  // Находим сервис
  let service;
  try {
    service = await prisma.tservices.findUnique({
      where: { id: serviceId },
      select: { provider_id: true, active: true, status: true },
    });
  } catch (error) {
    log(
      'updateService',
      'Ошибка поиска сервиса в БД',
      'error',
      { serviceId, providerId: userAuth.providerId },
      error
    );
    throw error;
  }

  if (!service) {
    log(
      'updateService',
      'Сервис не найден',
      'error',
      { serviceId, providerId: userAuth.providerId }
    );
    throw new Error('Service not found');
  }

  // Проверяем принадлежность сервиса провайдеру
  if (service.provider_id !== userAuth.providerId) {
    log(
      'updateService',
      'Доступ запрещен: сервис не принадлежит провайдеру',
      'error',
      { serviceId, providerId: userAuth.providerId, serviceProviderId: service.provider_id }
    );
    throw new Error('Access denied: This service does not belong to you');
  }

  // Проверяем, что сервис не архивирован
  if (!service.active || service.status === 'archived') {
    log(
      'updateService',
      'Невозможно обновить архивированный сервис',
      'error',
      { serviceId, providerId: userAuth.providerId, active: service.active, status: service.status }
    );
    throw new Error('Cannot update archived service');
  }

  log(
    'updateService',
    'Начало транзакции обновления',
    'info',
    {
      serviceId,
      providerId: userAuth.providerId,
      serviceName: data.name
    }
  );

  try {
    // Выполняем все операции в транзакции для атомарности
    await prisma.$transaction(async (tx) => {
      // 1. Обновляем основные данные сервиса
      log(
        'updateService',
        'Обновление основных данных сервиса',
        'info',
        {
          serviceId,
          serviceName: data.name,
          categoryId: data.tcategories_id,
          price: data.price
        }
      );

      try {
        await tx.tservices.update({
          where: { id: serviceId },
          data: {
            name: data.name,
            description: data.description,
            price: parseFloat(data.price),
            tcategories_id: data.tcategories_id,
            service_options: data.serviceOptions || null,
          },
        });
        log(
          'updateService',
          'Основные данные сервиса обновлены',
          'info',
          { serviceId }
        );
      } catch (error) {
        log(
          'updateService',
          'Ошибка обновления основных данных сервиса',
          'error',
          { serviceId, serviceName: data.name },
          error
        );
        throw error;
      }

      // 2. Обновляем локацию (обновляем первую запись или создаем новую)
      log(
        'updateService',
        'Обновление локации сервиса',
        'info',
        { serviceId, address: data.address, areaId: data.tarea_id }
      );

      try {
        const existingLocation = await tx.tlocations.findFirst({
          where: { tservices_id: serviceId },
        });

        if (existingLocation) {
          await tx.tlocations.update({
            where: { id: existingLocation.id },
            data: {
              address: data.address,
              tarea_id: data.tarea_id,
            },
          });
          log(
            'updateService',
            'Локация сервиса обновлена',
            'info',
            { serviceId, locationId: existingLocation.id }
          );
        } else {
          const newLocation = await tx.tlocations.create({
            data: {
              tservices_id: serviceId,
              address: data.address,
              tarea_id: data.tarea_id,
            },
          });
          log(
            'updateService',
            'Локация сервиса создана',
            'info',
            { serviceId, locationId: newLocation.id }
          );
        }
      } catch (error) {
        log(
          'updateService',
          'Ошибка обновления локации сервиса',
          'error',
          { serviceId, address: data.address },
          error
        );
        throw error;
      }

      // 3. Обновляем контакты (обновляем первую запись или создаем новую)
      log(
        'updateService',
        'Обновление контактов сервиса',
        'info',
        { serviceId }
      );

      try {
        const existingContact = await tx.tcontacts.findFirst({
          where: { tservices_id: serviceId },
        });

        if (existingContact) {
          await tx.tcontacts.update({
            where: { id: existingContact.id },
            data: {
              phone: data.phone || null,
              tg_username: data.tg_username || null,
              website: data.website || null,
              whatsap: data.whatsap || null,
            },
          });
          log(
            'updateService',
            'Контакты сервиса обновлены',
            'info',
            { serviceId, contactId: existingContact.id }
          );
        } else {
          const newContact = await tx.tcontacts.create({
            data: {
              tservices_id: serviceId,
              email: 'default@example.com', // обязательное поле
              phone: data.phone || null,
              tg_username: data.tg_username || null,
              website: data.website || null,
              whatsap: data.whatsap || null,
            },
          });
          log(
            'updateService',
            'Контакты сервиса созданы',
            'info',
            { serviceId, contactId: newContact.id }
          );
        }
      } catch (error) {
        log(
          'updateService',
          'Ошибка обновления контактов сервиса',
          'error',
          { serviceId },
          error
        );
        throw error;
      }

      // 4. Обрабатываем фотографии (внутри транзакции)
      log(
        'updateService',
        'Обработка фотографий сервиса',
        'info',
        {
          serviceId,
          existingPhotosCount,
          newPhotosCount
        }
      );

      await handlePhotoUpdatesInTransaction(tx, serviceId, photos);
    });

    log(
      'updateService',
      'Сервис успешно обновлен',
      'info',
      {
        serviceId,
        providerId: userAuth.providerId,
        serviceName: data.name
      }
    );

  } catch (error) {
    log(
      'updateService',
      'Ошибка обновления сервиса в транзакции',
      'error',
      {
        serviceId,
        providerId: userAuth.providerId,
        serviceName: data.name,
        existingPhotosCount,
        newPhotosCount
      },
      error
    );
    throw new Error('Failed to update service');
  }
}

/**
 * Обработка обновления фотографий сервиса внутри транзакции.
 * - Удаляет фото, которые больше не присутствуют
 * - Обновляет isPrimary для существующих фото
 * - Загружает новые фото в S3 и сохраняет в БД
 * 
 * @param {any} tx - Prisma transaction client
 * @param {number} serviceId - ID сервиса
 * @param {PhotoUpdateData} photos - Данные фотографий
 */
async function handlePhotoUpdatesInTransaction(tx: any, serviceId: number, photos: PhotoUpdateData): Promise<void> {
  log(
    'handlePhotoUpdatesInTransaction',
    'Начало обработки фотографий',
    'info',
    {
      serviceId,
      existingPhotosCount: photos.existing?.length || 0,
      newPhotosCount: photos.new?.length || 0
    }
  );

  // Получаем текущие фото из БД
  let currentPhotos;
  try {
    currentPhotos = await tx.tphotos.findMany({
      where: { tservices_id: serviceId },
    });
  } catch (error) {
    log(
      'handlePhotoUpdatesInTransaction',
      'Ошибка получения текущих фото из БД',
      'error',
      { serviceId },
      error
    );
    throw error;
  }

  const currentPhotoMap = new Map(
    currentPhotos.map((p: any) => [extractFileNameFromUrl(p.url), p])
  );

  const submittedFileNames = new Set([
    ...photos.existing.map(p => p.fileName),
    ...photos.new.map(p => p.file.name),
  ]);

  // 1. Удаляем фото, которые больше не присутствуют в списке
  const photosToDelete = currentPhotos.filter(
    (p: any) => !submittedFileNames.has(extractFileNameFromUrl(p.url))
  );

  log(
    'handlePhotoUpdatesInTransaction',
    'Удаление фото',
    'info',
    {
      serviceId,
      photosToDeleteCount: photosToDelete.length,
      currentPhotosCount: currentPhotos.length
    }
  );

  for (const photo of photosToDelete) {
    const fileName = extractFileNameFromUrl(photo.url);
    
    log(
      'handlePhotoUpdatesInTransaction',
      'Удаление фото из БД',
      'info',
      { serviceId, photoId: photo.id, fileName, photoUrl: photo.url }
    );

    try {
      // Удаляем запись из БД
      await tx.tphotos.delete({ where: { id: photo.id } });
      
      log(
        'handlePhotoUpdatesInTransaction',
        'Фото удалено из БД, удаление из S3',
        'info',
        { serviceId, photoId: photo.id, fileName, photoUrl: photo.url }
      );

      // Удаляем файл из S3
      try {
        await deleteServicePhotoFromS3Storage(photo.url);
        log(
          'handlePhotoUpdatesInTransaction',
          'Фото успешно удалено из S3',
          'info',
          { serviceId, photoId: photo.id, fileName, photoUrl: photo.url }
        );
      } catch (error) {
        log(
          'handlePhotoUpdatesInTransaction',
          'Ошибка удаления фото из S3 (продолжаем выполнение)',
          'warn',
          { serviceId, photoId: photo.id, fileName, photoUrl: photo.url },
          error
        );
        // Продолжаем выполнение даже если удаление из S3 не удалось
        // Запись из БД уже удалена, файл в S3 останется (можно очистить позже)
      }
    } catch (error) {
      log(
        'handlePhotoUpdatesInTransaction',
        'Ошибка удаления фото из БД',
        'error',
        { serviceId, photoId: photo.id, fileName },
        error
      );
      throw error;
    }
  }

  // 2. Обновляем isPrimary для существующих фото
  log(
    'handlePhotoUpdatesInTransaction',
    'Обновление isPrimary для существующих фото',
    'info',
    { serviceId, existingPhotosCount: photos.existing?.length || 0 }
  );

  for (const existingPhoto of photos.existing) {
    const dbPhoto = currentPhotoMap.get(existingPhoto.fileName) as { id: number; is_primary: boolean } | undefined;
    if (dbPhoto && dbPhoto.is_primary !== existingPhoto.isPrimary) {
      log(
        'handlePhotoUpdatesInTransaction',
        'Изменение isPrimary для фото',
        'info',
        {
          serviceId,
          photoId: dbPhoto.id,
          fileName: existingPhoto.fileName,
          oldIsPrimary: dbPhoto.is_primary,
          newIsPrimary: existingPhoto.isPrimary
        }
      );

      try {
        await tx.tphotos.update({
          where: { id: dbPhoto.id },
          data: { is_primary: existingPhoto.isPrimary },
        });
        log(
          'handlePhotoUpdatesInTransaction',
          'isPrimary успешно обновлен',
          'info',
          { serviceId, photoId: dbPhoto.id, fileName: existingPhoto.fileName }
        );
      } catch (error) {
        log(
          'handlePhotoUpdatesInTransaction',
          'Ошибка обновления isPrimary',
          'error',
          { serviceId, photoId: dbPhoto.id, fileName: existingPhoto.fileName },
          error
        );
        throw error;
      }
    }
  }

  // 3. Загружаем новые фото в S3 (вне транзакции, но перед сохранением в БД)
  // Сначала загружаем все новые фото в S3
  if (photos.new.length > 0) {
    const bucketEndpoint = process.env.OBJECT_STORAGE_BUCKET_ENDPOINT;
    if (!bucketEndpoint) {
      log(
        'handlePhotoUpdatesInTransaction',
        'Ошибка конфигурации: OBJECT_STORAGE_BUCKET_ENDPOINT не установлен',
        'error',
        { serviceId }
      );
      throw new Error('OBJECT_STORAGE_BUCKET_ENDPOINT is not set');
    }

    log(
      'handlePhotoUpdatesInTransaction',
      'Загрузка новых фото в S3',
      'info',
      {
        serviceId,
        newPhotosCount: photos.new.length,
        totalSizeMB: (photos.new.reduce((sum, p) => sum + (p.file?.size || 0), 0) / 1024 / 1024).toFixed(2)
      }
    );

    // Загружаем все фото в S3 параллельно и сохраняем результаты
    const uploadResults = await Promise.all(
      photos.new.map(async (photo) => {
        const fileName = photo.file.name;
        const fileSizeMB = (photo.file.size / 1024 / 1024).toFixed(2);

        log(
          'handlePhotoUpdatesInTransaction',
          'Загрузка фото в S3',
          'info',
          {
            serviceId,
            fileName,
            fileSizeMB,
            isPrimary: photo.isPrimary
          }
        );

        try {
          const uploadResult = await loadServicePhotoToS3Storage(serviceId, photo.file);
          log(
            'handlePhotoUpdatesInTransaction',
            'Фото успешно загружено в S3',
            'info',
            {
              serviceId,
              originalFileName: fileName,
              s3FileName: uploadResult.fileName,
              fileSizeMB,
              isPrimary: photo.isPrimary
            }
          );
          return {
            fileName: uploadResult.fileName,
            isPrimary: photo.isPrimary,
            originalName: photo.file.name
          };
        } catch (error) {
          log(
            'handlePhotoUpdatesInTransaction',
            'Ошибка загрузки фото в S3',
            'error',
            {
              serviceId,
              fileName,
              fileSizeMB,
              isPrimary: photo.isPrimary
            },
            error
          );
          throw error; // Прерываем транзакцию при ошибке загрузки
        }
      })
    );

    log(
      'handlePhotoUpdatesInTransaction',
      'Сохранение новых фото в БД',
      'info',
      {
        serviceId,
        uploadResultsCount: uploadResults.length
      }
    );

    // После успешной загрузки в S3 сохраняем записи в БД (внутри транзакции)
    for (const uploadResult of uploadResults) {
      const photoUrl = `${bucketEndpoint}/services/${serviceId}/${uploadResult.fileName}`;
      
      log(
        'handlePhotoUpdatesInTransaction',
        'Создание записи фото в БД',
        'info',
        {
          serviceId,
          originalFileName: uploadResult.originalName,
          s3FileName: uploadResult.fileName,
          photoUrl,
          isPrimary: uploadResult.isPrimary
        }
      );

      try {
        const savedPhoto = await tx.tphotos.create({
          data: {
            tservices_id: serviceId,
            url: photoUrl,
            is_primary: uploadResult.isPrimary,
          },
        });
        
        log(
          'handlePhotoUpdatesInTransaction',
          'Фото успешно сохранено в БД',
          'info',
          {
            serviceId,
            photoId: savedPhoto.id,
            originalFileName: uploadResult.originalName,
            s3FileName: uploadResult.fileName,
            photoUrl: savedPhoto.url,
            isPrimary: uploadResult.isPrimary
          }
        );
      } catch (error) {
        log(
          'handlePhotoUpdatesInTransaction',
          'Ошибка сохранения фото в БД',
          'error',
          {
            serviceId,
            originalFileName: uploadResult.originalName,
            s3FileName: uploadResult.fileName,
            photoUrl
          },
          error
        );
        throw error;
      }
    }
  }

  log(
    'handlePhotoUpdatesInTransaction',
    'Обработка фотографий завершена',
    'info',
    { serviceId }
  );
}

