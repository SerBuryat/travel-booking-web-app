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