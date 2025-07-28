import { prisma } from '@/lib/prisma';

export async function getServicesByCategoryIds(categoryIds: number[]) {
  const services = await prisma.tservices.findMany({
    where: {
      tcategories_id: { in: categoryIds },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tcategories_id: true,
    },
    orderBy: { id: 'asc' },
  });
  // Map description to string (never null) and price to string
  return services.map(s => ({
    ...s,
    description: s.description ?? '',
    price: s.price ? String(s.price) : '0',
  }));
}

export async function getServiceById(serviceId: number) {
  const service = await prisma.tservices.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tcategories_id: true,
      provider_id: true,
      status: true,
      created_at: true,
    },
  });
  if (!service) return null;
  return {
    ...service,
    description: service.description ?? '',
    price: service.price ? String(service.price) : '0',
    created_at: service.created_at instanceof Date ? service.created_at.toISOString() : String(service.created_at),
  };
}

export async function getAllServiceByLikeName(search: string) {
  if (!search || search.length < 3) return [];
  const services = await prisma.tservices.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tcategories_id: true,
      priority: true,
    },
    orderBy: { priority: 'desc' },
  });
  return services.map(s => ({
    ...s,
    description: s.description ?? '',
    price: s.price ? String(s.price) : '0',
    priority: s.priority ? String(s.priority) : '0',
  }));
}

export async function getPopularServiceByLikeName(search: string, popularCount: number = 6) {
  if (!search || search.length < 3) return [];
  const services = await prisma.tservices.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tcategories_id: true,
      priority: true,
    },
    orderBy: { priority: 'desc' },
    take: popularCount,
  });
  return services.map(s => ({
    ...s,
    description: s.description ?? '',
    price: s.price ? String(s.price) : '0',
    priority: s.priority ? String(s.priority) : '0',
  }));
}

export async function getPopularServices(popularCount: number = 10) {
  const services = await prisma.tservices.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tcategories_id: true,
      priority: true,
    },
    orderBy: { priority: 'desc' },
    take: popularCount,
  });
  return services.map(s => ({
    ...s,
    description: s.description ?? '',
    price: s.price ? String(s.price) : '0',
    priority: s.priority ? String(s.priority) : '0',
  }));
} 