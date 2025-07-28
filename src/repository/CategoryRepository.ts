import { prisma } from '@/lib/prisma';

export async function getAllCategories() {
  return prisma.tcategories.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      photo: true,
    },
    orderBy: { id: 'asc' },
  });
}

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

export async function getCategoriesByIds(ids: number[]) {
  if (!ids || ids.length === 0) return [];
  return prisma.tcategories.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      code: true,
      photo: true,
    },
    orderBy: { id: 'asc' },
  });
}

export async function getCategoryParent(categoryId: number) {
  const category = await prisma.tcategories.findUnique({
    where: { id: categoryId },
    select: { parent_id: true },
  });
  if (!category || category.parent_id == null) return null;
  return prisma.tcategories.findUnique({
    where: { id: category.parent_id },
    select: {
      id: true,
      name: true,
      code: true,
      photo: true,
    },
  });
}

export async function getCategoriesByCodeIn(codes: string[]) {
  if (!codes || codes.length === 0) return [];
  return prisma.tcategories.findMany({
    where: { code: { in: codes } },
    select: {
      id: true,
      name: true,
      code: true,
      photo: true,
    },
    orderBy: { id: 'asc' },
  });
} 