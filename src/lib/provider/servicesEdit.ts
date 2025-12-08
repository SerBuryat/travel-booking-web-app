'use server';

import { prisma } from '@/lib/db/prisma';
import { getUserAuthOrThrow } from '@/lib/auth/getUserAuth';
import { CreateServiceData } from '@/schemas/service/createServiceSchema';
import { loadServicePhotoToS3Storage, deleteServicePhotoFromS3Storage } from '@/lib/service/media';

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
  // Получаем авторизованного пользователя
  const userAuth = await getUserAuthOrThrow();

  // Проверяем роль и наличие providerId
  if (userAuth.role !== 'provider' || !userAuth.providerId) {
    throw new Error('Access denied: Only providers can edit services');
  }

  // Находим сервис со всеми связанными данными
  const service = await prisma.tservices.findUnique({
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

  if (!service) {
    throw new Error('Service not found');
  }

  // Проверяем принадлежность сервиса провайдеру
  if (service.provider_id !== userAuth.providerId) {
    throw new Error('Access denied: This service does not belong to you');
  }

  // Проверяем, что сервис не архивирован
  if (!service.active || service.status === 'archived') {
    throw new Error('Cannot edit archived service');
  }

  // Получаем первую локацию и контакт
  const location = service.tlocations[0];
  const contact = service.tcontacts[0];

  if (!location) {
    throw new Error('Service location not found');
  }

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
  // Получаем авторизованного пользователя
  const userAuth = await getUserAuthOrThrow();

  // Проверяем роль и наличие providerId
  if (userAuth.role !== 'provider' || !userAuth.providerId) {
    throw new Error('Access denied: Only providers can update services');
  }

  // Находим сервис
  const service = await prisma.tservices.findUnique({
    where: { id: serviceId },
    select: { provider_id: true, active: true, status: true },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  // Проверяем принадлежность сервиса провайдеру
  if (service.provider_id !== userAuth.providerId) {
    throw new Error('Access denied: This service does not belong to you');
  }

  // Проверяем, что сервис не архивирован
  if (!service.active || service.status === 'archived') {
    throw new Error('Cannot update archived service');
  }

  try {
    // Выполняем все операции в транзакции для атомарности
    await prisma.$transaction(async (tx) => {
      // 1. Обновляем основные данные сервиса
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

      // 2. Обновляем локацию (обновляем первую запись или создаем новую)
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
      } else {
        await tx.tlocations.create({
          data: {
            tservices_id: serviceId,
            address: data.address,
            tarea_id: data.tarea_id,
          },
        });
      }

      // 3. Обновляем контакты (обновляем первую запись или создаем новую)
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
      } else {
        await tx.tcontacts.create({
          data: {
            tservices_id: serviceId,
            email: 'default@example.com', // обязательное поле
            phone: data.phone || null,
            tg_username: data.tg_username || null,
            website: data.website || null,
            whatsap: data.whatsap || null,
          },
        });
      }

      // 4. Обрабатываем фотографии (внутри транзакции)
      await handlePhotoUpdatesInTransaction(tx, serviceId, photos);
    });

  } catch (error) {
    console.error('[updateService] Error updating service:', error);
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
  // Получаем текущие фото из БД
  const currentPhotos = await tx.tphotos.findMany({
    where: { tservices_id: serviceId },
  });

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

  for (const photo of photosToDelete) {
    // Удаляем запись из БД
    await tx.tphotos.delete({ where: { id: photo.id } });
    
    // Удаляем файл из S3
    try {
      await deleteServicePhotoFromS3Storage(photo.url);
      console.log('[handlePhotoUpdates] Photo deleted from S3:', photo.url);
    } catch (error) {
      console.error('[handlePhotoUpdates] Error deleting photo from S3:', photo.url, error);
      // Продолжаем выполнение даже если удаление из S3 не удалось
      // Запись из БД уже удалена, файл в S3 останется (можно очистить позже)
    }
  }

  // 2. Обновляем isPrimary для существующих фото
  for (const existingPhoto of photos.existing) {
    const dbPhoto = currentPhotoMap.get(existingPhoto.fileName) as { id: number; is_primary: boolean } | undefined;
    if (dbPhoto && dbPhoto.is_primary !== existingPhoto.isPrimary) {
      await tx.tphotos.update({
        where: { id: dbPhoto.id },
        data: { is_primary: existingPhoto.isPrimary },
      });
    }
  }

  // 3. Загружаем новые фото в S3 (вне транзакции, но перед сохранением в БД)
  // Сначала загружаем все новые фото в S3
  if (photos.new.length > 0) {
    const bucketEndpoint = process.env.OBJECT_STORAGE_BUCKET_ENDPOINT;
    if (!bucketEndpoint) {
      throw new Error('OBJECT_STORAGE_BUCKET_ENDPOINT is not set');
    }

    // Загружаем все фото в S3 параллельно и сохраняем результаты
    const uploadResults = await Promise.all(
      photos.new.map(async (photo) => {
        try {
          const uploadResult = await loadServicePhotoToS3Storage(serviceId, photo.file);
          return {
            fileName: uploadResult.fileName,
            isPrimary: photo.isPrimary,
            originalName: photo.file.name
          };
        } catch (error) {
          console.error('[handlePhotoUpdates] Error uploading to S3:', photo.file.name, error);
          throw error; // Прерываем транзакцию при ошибке загрузки
        }
      })
    );

    // После успешной загрузки в S3 сохраняем записи в БД (внутри транзакции)
    for (const uploadResult of uploadResults) {
      const photoUrl = `${bucketEndpoint}/services/${serviceId}/${uploadResult.fileName}`;
      
      await tx.tphotos.create({
        data: {
          tservices_id: serviceId,
          url: photoUrl,
          is_primary: uploadResult.isPrimary,
        },
      });
      
      console.log('[handlePhotoUpdates] Photo saved:', uploadResult.originalName, '→', uploadResult.fileName, photoUrl);
    }
  }
}

