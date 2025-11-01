import {prisma} from "@/lib/db/prisma";

export async function saveServicePhoto(serviceId: number, photo: {url: string, isPrimary: boolean})
    : Promise<{id: number, url: string}>
{
  return prisma.tphotos.create({
    data: {
      tservices_id: serviceId,
      url: photo.url,
      is_primary: photo.isPrimary
    },
    select: {id: true, url: true}
  });
}

