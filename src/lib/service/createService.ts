"use server";

import {CreateServiceWithProviderData} from "@/schemas/service/createServiceSchema";
import {prisma} from "@/lib/db/prisma";

export interface CreatedServiceWithProviderResponse {
  serviceId: number,
  providerId: number
}

/*
* Создание сервиса вместе с провайдером.
* (первое создание сервиса пользователем)
* **/
export async function createServiceWithProvider(
    createServiceData: CreateServiceWithProviderData, clientId: number): Promise<CreatedServiceWithProviderResponse>
{
  const providerId = await prisma.tproviders.findFirst({
    where: { tclients_id: clientId },
    select: {id: true}
  });

  if(providerId) {
    throw new Error('[createServiceWithProvider]: Provider already exists!');
  }

  return prisma.$transaction(async (tx) => {

    const createdProvider = await tx.tproviders.create({
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

    const createdService = await tx.tservices.create({
      data: {
        name: createServiceData.name,
        description: createServiceData.description,
        price: parseFloat(createServiceData.price),
        tcategories_id: createServiceData.tcategories_id,
        provider_id: createdProvider.id,
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
      throw new Error('[createServiceWithProvider]: Cant create service!');
    }

    return {serviceId: createdService.id, providerId: createdProvider.id};
  });
}