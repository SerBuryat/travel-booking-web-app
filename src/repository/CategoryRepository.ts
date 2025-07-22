import { prisma } from '@/lib/prisma';

export async function getAllParentCategories() {
  return prisma.tcategories.findMany({
    where: { parent_id: null },
    select: {
      id: true,
      name: true,
      code: true,
      photo: true,
    },
    orderBy: { id: 'asc' },
  });
} 