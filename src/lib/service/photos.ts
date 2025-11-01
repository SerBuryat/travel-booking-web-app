import {prisma} from "@/lib/db/prisma";

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
    throw new Error("[saveServicePhoto]: 'bucketEndpoint' environment variable is not set!");
  }

  if(!serviceId) {
    throw new Error("[saveServicePhoto]: 'serviceId' is required!");
  }

  // пример: `https://dev-travel-app-service.s3.cloud.ru/services/123321/photo-name-123.jpg`
  const photoUrl = `${bucketEndpoint}/services/${serviceId}/${photo.fileName}`;

  return prisma.tphotos.create({
    data: {
      tservices_id: serviceId,
      url: photoUrl,
      is_primary: photo.isPrimary
    },
    select: {id: true, url: true}
  });
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
    console.log(`[getPrimaryServicePhoto]: Primary photo not found for service ${serviceId}, returning first photo`);
    return prisma.tphotos.findFirst({
      where: {tservices_id: serviceId},
      select: {id: true, url: true}
    })
  }

  return primaryPhoto;
}
