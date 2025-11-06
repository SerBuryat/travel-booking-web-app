'use server';

import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { PAGE_ROUTES } from '@/utils/routes';

/**
 * Получение названия категории по ID
 * @param id ID категории
 * @returns Promise<string> Название категории
 */
export async function getCategoryNameById(id: number): Promise<string> {
  try {
    const category = await prisma.tcategories.findUnique({
      where: { id },
      select: { name: true }
    });

    if (!category) {
      console.error(`Категория с ID ${id} не найдена`);
      redirect(PAGE_ROUTES.ERROR);
    }

    return category.name;
  } catch (error) {
    console.error('Ошибка при получении названия категории:', error);
    redirect(PAGE_ROUTES.ERROR);
  }
}

/**
 * Получение списка родительских категорий (parent_id = null)
 * Сортировка по приоритету: сначала с priority (по возрастанию), затем без priority
 */
export async function parentCategories() {
  try {
    const categories = await prisma.tcategories.findMany({
      where: { parent_id: null },
      select: { id: true, code: true, sysname: true, name: true, photo: true, parent_id: true, priority: true }
    });

    // Сортируем: сначала с priority (по возрастанию), затем без priority
    return categories.sort((a, b) => {
      // Если у обоих есть priority - сортируем по возрастанию
      if (a.priority !== null && b.priority !== null) {
        return a.priority - b.priority;
      }
      // Если только у a есть priority - a идет первым
      if (a.priority !== null) {
        return -1;
      }
      // Если только у b есть priority - b идет первым
      if (b.priority !== null) {
        return 1;
      }
      // Если у обоих нет priority - оставляем порядок как есть
      return 0;
    });
  } catch (error) {
    console.error('Ошибка при получении родительских категорий:', error);
    redirect(PAGE_ROUTES.ERROR);
  }
}

/**
 * Тип для категории с дочерними категориями
 */
export type CategoryWithChildren = {
  id: number;
  code: string;
  sysname: string;
  name: string;
  photo: string | null;
  parent_id: number | null;
  priority: number | null;
  children: {
    id: number;
    code: string;
    sysname: string;
    name: string;
    photo: string | null;
    parent_id: number | null;
    priority: number | null;
  }[];
};

/**
 * Получение категории по ID с дочерними категориями
 * @param id ID категории
 */
export async function getCategoryWithChildren(id: number): Promise<CategoryWithChildren> {
  try {
    const category = await prisma.tcategories.findUnique({
      where: { id },
      select: { 
        id: true, 
        code: true, 
        sysname: true, 
        name: true, 
        photo: true, 
        parent_id: true, 
        priority: true 
      }
    });

    if (!category) {
      console.error(`Категория с ID ${id} не найдена`);
      redirect(PAGE_ROUTES.ERROR);
    }

    // Получаем дочерние категории
    const children = await prisma.tcategories.findMany({
      where: { parent_id: id },
      select: { 
        id: true, 
        code: true, 
        sysname: true, 
        name: true, 
        photo: true, 
        parent_id: true, 
        priority: true 
      },
      orderBy: [
        { priority: 'asc' },
        { id: 'asc' }
      ]
    });

    return {
      ...category,
      children
    };
  } catch (error) {
    console.error('Ошибка при получении категории:', error);
    redirect(PAGE_ROUTES.ERROR);
  }
}