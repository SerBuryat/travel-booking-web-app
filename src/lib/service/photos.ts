import {prisma} from "@/lib/db/prisma";
import {log} from '@/lib/utils/logger';

const bucketEndpoint = process.env.OBJECT_STORAGE_BUCKET_ENDPOINT;
/**
 * Сохранение фото сервиса в БД.
 * 
 * Пример: `https://dev-travel-app-service.s3.cloud.ru/services/123321/photo-name-123.jpg`
 * 
 * @param {number} serviceId Идентификатор сервиса
 * @param {PhotoItem} photo Фото для сохранения
 * @returns {Promise<{id: number, url: string}>} Идентификатор и URL сохраненного фото
 */
export async function saveServicePhoto(serviceId: number, photo: {fileName: string, isPrimary: boolean})
    : Promise<{id: number, url: string}>
{
  if(!bucketEndpoint) {
    log(
      'saveServicePhoto',
      'Ошибка конфигурации: bucketEndpoint не установлен',
      'error',
      { serviceId, fileName: photo.fileName, isPrimary: photo.isPrimary }
    );
    throw new Error("[saveServicePhoto]: 'bucketEndpoint' environment variable is not set!");
  }

  if(!serviceId) {
    log(
      'saveServicePhoto',
      'Ошибка валидации: serviceId не указан',
      'error',
      { fileName: photo.fileName, isPrimary: photo.isPrimary }
    );
    throw new Error("[saveServicePhoto]: 'serviceId' is required!");
  }

  // пример: `https://dev-travel-app-service.s3.cloud.ru/services/123321/photo-name-123.jpg`
  const photoUrl = `${bucketEndpoint}/services/${serviceId}/${photo.fileName}`;

  log(
    'saveServicePhoto',
    'Сохранение фото в БД',
    'info',
    {
      serviceId,
      fileName: photo.fileName,
      photoUrl,
      isPrimary: photo.isPrimary
    }
  );

  try {
    const result = await prisma.tphotos.create({
      data: {
        tservices_id: serviceId,
        url: photoUrl,
        is_primary: photo.isPrimary
      },
      select: {id: true, url: true}
    });

    log(
      'saveServicePhoto',
      'Фото успешно сохранено в БД',
      'info',
      {
        serviceId,
        photoId: result.id,
        fileName: photo.fileName,
        photoUrl: result.url,
        isPrimary: photo.isPrimary
      }
    );

    return result;
  } catch (error) {
    log(
      'saveServicePhoto',
      'Ошибка сохранения фото в БД (Prisma)',
      'error',
      {
        serviceId,
        fileName: photo.fileName,
        photoUrl,
        isPrimary: photo.isPrimary
      },
      error
    );
    throw error;
  }
}

/**
 * Возвращаем фото-обложку сервиса.
 * Если, по каким-то причинам, обложка не найдена, возвращаем первое фото.
 * 
 * @param {number} serviceId Идентификатор сервиса
 * @returns {Promise<{id: number, url: string}>} Идентификатор и URL обложки
 */
export async function getPrimaryServicePhoto(serviceId: number)
    : Promise<{id: number, url: string}>
{
  const primaryPhoto = await prisma.tphotos.findFirst({
    where: {tservices_id: serviceId, is_primary: true},
    select: {id: true, url: true}
  });

  if(!primaryPhoto) {
    log(
      'getPrimaryServicePhoto',
      'Обложка не найдена, возвращаем первое фото',
      'warn',
      { serviceId }
    );
    const firstPhoto = await prisma.tphotos.findFirst({
      where: {tservices_id: serviceId},
      select: {id: true, url: true}
    });
    
    if (firstPhoto) {
      log(
        'getPrimaryServicePhoto',
        'Возвращено первое фото вместо обложки',
        'info',
        { serviceId, photoId: firstPhoto.id }
      );
    } else {
      log(
        'getPrimaryServicePhoto',
        'Фото для сервиса не найдены',
        'warn',
        { serviceId }
      );
    }
    
    return firstPhoto!;
  }

  return primaryPhoto;
}
