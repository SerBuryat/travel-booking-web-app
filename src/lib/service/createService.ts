"use server";

import {CreateServiceData, CreateServiceWithProviderData} from "@/schemas/service/createServiceSchema";
import {prisma} from "@/lib/db/prisma";
import { PhotoItem } from "./hooks/useServicePhotos";
import { loadServicePhotoToS3Storage } from '@/lib/service/media';
import { saveServicePhoto } from "./photos";

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

  const providerId = await prisma.tproviders.findFirst({
    where: { tclients_id: clientId },
    select: {id: true}
  });

  if(providerId) {
    throw new Error('[createServiceWithProvider]: Provider already exists!');
  }

  // todo - пока без транзакции
  const createdProvider = await prisma.tproviders.create({
    data: {
      tclients_id: clientId,
      company_name: createServiceData.providerCompanyName,
      phone: createServiceData.providerPhone,
      contact_info: {contact_person: createServiceData.providerContactPerson},
      status: 'active', // По умолчанию активный
    },
    select: {id: true}
  });

  if(!createdProvider) {
    throw new Error('[createServiceWithProvider]: Cant create provider!');
  }

  const createdService = await createService(createServiceData, createdProvider.id, photos);

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
      throw new Error(`[createService]: 'providerId' (${providerId}) required!`);
    }

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
        tcontacts: {
          create: {
            email: 'default@example.com', // Обязательное поле в БД, проставляем мок
            phone: createServiceData.phone || null,
            tg_username: createServiceData.tg_username || null,
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
    })

    if(!createdService) {
      throw new Error('[createService]: Cant create service!');
    }

    // Сохраняем фото в storage, потом в БД
    if (photos && photos.length > 0) {
      await Promise.all(

          photos.map(photo =>

              loadServicePhotoToS3Storage(createdService.id, photo.file)
              .then(result =>

                  saveServicePhoto(createdService.id, {fileName: photo.file.name, isPrimary: photo.isPrimary})
                  .then(savedPhoto =>
                      console.log('[createService] Фото сохранено в storage и в db:', savedPhoto.id, savedPhoto.url)
                  )
                  .catch(photoError =>
                      console.error('[createService] Ошибка при сохранении фото в db:', photo.file, photoError)
                  )

              )
              .catch(photoError =>
                  console.error('[createService] Ошибка при сохранении фото в storage:', photo.file, photoError)
              )

          )

      );
    }

    return {serviceId: createdService.id};
  } catch (error) {
    console.error('[createService] Ошибка при создании сервиса', providerId, error);
    throw new Error('[createService]: Ошибка при создании сервиса!', error);
  }
}