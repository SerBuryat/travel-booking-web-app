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
