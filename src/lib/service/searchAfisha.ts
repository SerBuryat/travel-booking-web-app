'use server';

import { prisma } from '@/lib/db/prisma';
import { withUserAuth } from '@/lib/auth/withUserAuth';
import { DEFAULT_SERVICE_IMAGE_3 } from '@/utils/images';
import { formatDateTime } from '@/utils/date';

/**
 * Тип для сервиса афиши (только необходимые поля для отображения)
 */
export interface AfishaServiceType {
  id: number;
  name: string;
  price: string;
  preview_photo_url: string;
  event_date: string | null;
}

const DEFAULT_TAKE_AFISHA = 10;

/**
 * Получение сервисов категории "афиша" (type = 'afisha')
 * - фильтрация по категориям с type = 'afisha' (родительским или дочерним)
 * - фильтрация по локации пользователя (если авторизован)
 * - сортировка по популярности (priority desc)
 * 
 * @param {number} [take=10] Ограничение на количество записей
 * @returns {Promise<AfishaServiceType[]>} Массив сервисов афиши
 */
export async function getAfishaServices(take: number = DEFAULT_TAKE_AFISHA): Promise<AfishaServiceType[]> {
  try {
    // Получаем все категории с type = 'afisha' (родительские и дочерние)
    const afishaCategories = await prisma.tcategories.findMany({
      where: {
        type: 'afisha'
      },
      select: {
        id: true
      }
    });

    if (afishaCategories.length === 0) {
      return [];
    }

    const afishaCategoryIds = afishaCategories.map(cat => cat.id);

    // Определяем areaId текущего пользователя (если авторизован и локация выбрана)
    const resolvedAreaId = await (async () => {
      const result = await withUserAuth(async ({ userAuth }) => {
        const client = await prisma.tclients.findUnique({
          where: { id: userAuth.userId },
          select: { tarea_id: true },
        });
        return client?.tarea_id ?? null;
      });
      return result ?? null;
    })();

    // Строим where условие
    const where: any = {
      active: true,
      status: { not: 'archived' },
      tcategories_id: { in: afishaCategoryIds }
    };

    // Фильтрация по локации пользователя
    if (resolvedAreaId != null) {
      Object.assign(where, {
        tlocations: { some: { tarea_id: resolvedAreaId } },
      });
    }

    // Получаем сервисы
    const services = await prisma.tservices.findMany({
      where,
      orderBy: { priority: 'desc' },
      take: Number.isFinite(take) ? take : DEFAULT_TAKE_AFISHA,
      include: { 
        tcategories: true, 
        tlocations: true, 
        tphotos: true 
      },
    });

    if (services.length === 0) {
      return [];
    }

    // Преобразуем в нужный формат
    return services.map(service => {
      const previewPhoto = service.tphotos.find(photo => photo.is_primary);

      // Форматируем дату события с временем
      let eventDateStr: string | null = null;
      if (service.event_date) {
        eventDateStr = formatDateTime(service.event_date);
      }

      return {
        id: service.id,
        name: service.name,
        price: String(service.price),
        preview_photo_url: previewPhoto?.url || DEFAULT_SERVICE_IMAGE_3,
        event_date: eventDateStr
      };
    });
  } catch (error) {
    console.error('[getAfishaServices] Ошибка при получении сервисов афиши:', error);
    return [];
  }
}

