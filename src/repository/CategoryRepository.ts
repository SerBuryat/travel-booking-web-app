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

export async function getCategoryById(categoryId: number) {
  return prisma.tcategories.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      code: true,
      photo: true,
    },
  });
}

export async function getChildCategories(parentId: number) {
  return prisma.tcategories.findMany({
    where: { parent_id: parentId },
    select: {
      id: true,
      name: true,
      code: true,
      photo: true,
    },
    orderBy: { id: 'asc' },
  });
} 