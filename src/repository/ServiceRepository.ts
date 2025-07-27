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
    price: typeof s.price === 'object' && s.price !== null && 'toString' in s.price ? s.price.toString() : String(s.price),
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
    price: typeof service.price === 'object' && service.price !== null && 'toString' in service.price ? service.price.toString() : String(service.price),
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
    price: typeof s.price === 'object' && s.price !== null && 'toString' in s.price ? s.price.toString() : String(s.price),
    priority: typeof s.priority === 'object' && s.priority !== null && 'toString' in s.priority ? s.priority.toString() : String(s.priority),
  }));
}

export async function getPopularServiceByLikeName(search: string, popularCount: number = 10) {
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
    price: typeof s.price === 'object' && s.price !== null && 'toString' in s.price ? s.price.toString() : String(s.price),
    priority: typeof s.priority === 'object' && s.priority !== null && 'toString' in s.priority ? s.priority.toString() : String(s.priority),
  }));
} 