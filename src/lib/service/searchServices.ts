'use server';

import { prisma } from '@/lib/db/prisma';
import { withUserAuth } from '@/lib/auth/withUserAuth';
import {ServiceType, ServiceTypeFull} from "@/model/ServiceType";
import {CategoryEntity} from "@/entity/CategoryEntity";
import { ContactsType } from '@/model/ContactsType';

const DEFAULT_TAKE_SERVICES = 10;

interface SearchServiceOptions {
  categoryIds?: number[];
  take?: number;
}

/**
 * Поиск сервисов по введенному значению.
 * - name LIKE searchValue (case-insensitive contains)
 * - сортировка по популярности (priority desc)
 * - фильтр по категории (если передан categoryIds)
 * - фильтр по локации пользователя (если авторизован)
 *
 * @param {string} searchValue Строка поиска по полю name (подстрочное совпадение, регистронезависимое)
 * @param {SearchServiceOptions} [options] Дополнительные опции фильтрации и ограничения
 * @param {number[]} [options.categoryIds] Если задано непустым массивом — фильтрация по множеству `tcategories_id`
 * @param {number} [options.take=10] Ограничение на количество записей
 * @returns {Promise<ServiceType[]>} Массив сервисов с полем category
 */
export async function searchServices(
  searchValue: string,
  options: SearchServiceOptions = {}
): Promise<ServiceType[]> {
  // Готовим значение поиска (обрезаем пробелы, защищаемся от пустой строки)
  const normalizedSearch = normalizeSearchValue(searchValue);
  if (!normalizedSearch) {
    return [];
  }

  // Определяем areaId текущего пользователя (если авторизован и локация выбрана)
  const resolvedAreaId = await resolveAreaIdFromUser();

  // Конструируем where с поиском по имени
  const where = buildWhereWithSearch(normalizedSearch, options.categoryIds, resolvedAreaId);
  const take = Number.isFinite(options.take as number) ? (options.take as number) : DEFAULT_TAKE_SERVICES;

  return await fetchServices(where, take);
}

/**
 * Получение популярных сервисов без поиска по имени.
 * - сортировка по популярности (priority desc)
 * - фильтр по категории (если передан categoryIds)
 * - фильтр по локации пользователя (если авторизован)
 *
 * @param {SearchServiceOptions} [options] Дополнительные опции фильтрации и ограничения
 * @param {number[]} [options.categoryIds] Если задано непустым массивом — фильтрация по множеству `tcategories_id`
 * @param {number} [options.take=10] Ограничение на количество записей
 * @returns {Promise<ServiceType[]>} Массив сервисов с полем category
 */
export async function popularServices(
  options: SearchServiceOptions = {}
): Promise<ServiceType[]> {
  // Определяем areaId текущего пользователя (если авторизован и локация выбрана)
  const resolvedAreaId = await resolveAreaIdFromUser();

  // Конструируем where без поиска по имени
  const where = buildWhereWithoutSearch(options.categoryIds, resolvedAreaId);
  const take = Number.isFinite(options.take as number) ? (options.take as number) : DEFAULT_TAKE_SERVICES;

  return await fetchServices(where, take);
}

/**
 * Получение сервисов по списку категорий.
 * - сортировка по популярности (priority desc)
 * - фильтр по переданным categoryIds (обязательно)
 * - фильтр по локации пользователя (если авторизован)
 *
 * @param {number[]} categoryIds Список идентификаторов категорий для поиска
 * @param {SearchServiceOptions} [options] Дополнительные опции фильтрации и ограничения
 * @param {number} [options.take=10] Ограничение на количество записей
 * @returns {Promise<ServiceType[]>} Массив сервисов с полем category
 */
export async function servicesForCategories(
  categoryIds: number[],
  options: SearchServiceOptions = {}
): Promise<ServiceType[]> {
  // Проверяем, что передан непустой массив категорий
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    return [];
  }

  // Определяем areaId текущего пользователя (если авторизован и локация выбрана)
  const resolvedAreaId = await resolveAreaIdFromUser();

  // Конструируем where с обязательной фильтрацией по категориям
  const where = buildWhereForCategories(categoryIds, resolvedAreaId);
  const take = Number.isFinite(options.take as number) ? (options.take as number) : DEFAULT_TAKE_SERVICES;

  return await fetchServices(where, take);
}

/**
 * Нормализует входное значение поиска.
 * Удаляет пробелы по краям и предотвращает выполнение запроса при пустой строке.
 *
 * @param {string} value Ввод пользователя
 * @returns {string} Очищенная строка поиска (может быть пустой)
 */
function normalizeSearchValue(value: string): string {
  return (value ?? '').trim();
}

/**
 * Определяет текущую локацию пользователя (areaId) через контекст аутентификации.
 * Логика:
 * - Если пользователь не авторизован → возвращаем null (фильтр по локации не применяется)
 * - Если авторизован → читаем `tclients.tarea_id` по `userId`
 * - Если `tarea_id` отсутствует → возвращаем null
 *
 * @returns {Promise<number|null>} Идентификатор локации пользователя или null
 */
async function resolveAreaIdFromUser(): Promise<number | null> {
  const result = await withUserAuth(async ({ userAuth }) => {
    const client = await prisma.tclients.findUnique({
      where: { id: userAuth.userId },
      select: { tarea_id: true },
    });
    return client?.tarea_id ?? null;
  });

  // withUserAuth возвращает null, если пользователь не аутентифицирован
  return result ?? null;
}

/**
 * Общая функция для получения сервисов из БД с маппингом.
 * Выполняет запрос к БД и преобразует результат в ServiceType[].
 *
 * @param {any} where Условия фильтрации для Prisma
 * @param {number} take Лимит записей
 * @returns {Promise<ServiceType[]>} Массив сервисов с полем category
 */
async function fetchServices(where: any, take: number): Promise<ServiceType[]> {
  const services = await prisma.tservices.findMany({
    where,              // Фильтры по имени, категории и локации
    orderBy: { priority: 'desc' },            // Сортировка по «популярности»
    take,               // Лимит записей
    include: { tcategories: true, tlocations: true }, // Присоединяем категорию и адрес
  });

  if (services.length === 0) {
    return [];
  }

  // Преобразуем структуру: tcategories -> category
  return services.map(mapToSearchableService);
}

/**
 * Собирает объект where для поиска сервисов с фильтром по имени.
 *
 * @param {string} searchValue Нормализованное значение поиска
 * @param {number[]|undefined} categoryIds Список идентификаторов категорий; если не задан или пуст — фильтр не применяется
 * @param {number|null|undefined} areaId Идентификатор локации (area) или null/undefined, чтобы исключить фильтр
 * @returns {any} Where-условие для Prisma
 */
function buildWhereWithSearch(
  searchValue: string,
  categoryIds?: number[] | undefined,
  areaId?: number | null
): any {
  const where: any = {
    name: { contains: searchValue, mode: 'insensitive' },
    active: true
  };

  if (Array.isArray(categoryIds) && categoryIds.length > 0) {
    // Фильтрация по множеству категорий, если список непустой
    Object.assign(where, { tcategories_id: { in: categoryIds } });
  }

  if (areaId != null) {
    // Фильтрация по наличию локации с заданным tarea_id
    Object.assign(where, {
      tlocations: { some: { tarea_id: areaId } },
    });
  }

  return where;
}

/**
 * Собирает объект where для получения популярных сервисов без поиска по имени.
 *
 * @param {number[]|undefined} categoryIds Список идентификаторов категорий; если не задан или пуст — фильтр не применяется
 * @param {number|null|undefined} areaId Идентификатор локации (area) или null/undefined, чтобы исключить фильтр
 * @returns {any} Where-условие для Prisma
 */
function buildWhereWithoutSearch(
  categoryIds?: number[] | undefined,
  areaId?: number | null
): any {
  const where: any = {
    active: true
  };

  if (Array.isArray(categoryIds) && categoryIds.length > 0) {
    // Фильтрация по множеству категорий, если список непустой
    Object.assign(where, { tcategories_id: { in: categoryIds } });
  }

  if (areaId != null) {
    // Фильтрация по наличию локации с заданным tarea_id
    Object.assign(where, {
      tlocations: { some: { tarea_id: areaId } },
    });
  }

  return where;
}

/**
 * Собирает объект where для поиска сервисов по категориям.
 * Обязательно фильтрует по переданным categoryIds.
 *
 * @param {number[]} categoryIds Список идентификаторов категорий (обязательно непустой)
 * @param {number|null|undefined} areaId Идентификатор локации (area) или null/undefined, чтобы исключить фильтр
 * @returns {any} Where-условие для Prisma
 */
function buildWhereForCategories(
  categoryIds: number[],
  areaId?: number | null
): any {
  const where: any = {
    active: true,
    tcategories_id: { in: categoryIds } // Обязательная фильтрация по категориям
  };

  if (areaId != null) {
    // Фильтрация по наличию локации с заданным tarea_id
    Object.assign(where, {
      tlocations: { some: { tarea_id: areaId } },
    });
  }

  return where;
}

/**
 * Получение сервиса по ID.
 *
 * @param {number} serviceId Идентификатор сервиса
 * @returns {Promise<ServiceType | null>} Сервис с полем category
 */
export async function getServiceById(serviceId: number): Promise<ServiceTypeFull | null> {
  const service = await prisma.tservices.findUnique({
    where: { id: serviceId },
    include: { tcategories: true, tlocations: true, tcontacts: true },
  });
  
  const result = mapToSearchableService(service);

  return { ...result, contacts: service?.tcontacts ?? [] };
}


/**
 * Получение сервисов по массиву ID.
 * Используется для отображения выбранных сервисов провайдера.
 *
 * @param {number[]} serviceIds Массив идентификаторов сервисов
 * @returns {Promise<ServiceType[]>} Массив сервисов с полем category
 */
export async function getServicesByIds(serviceIds: number[]): Promise<ServiceType[]> {
  if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
    return [];
  }

  const services = await prisma.tservices.findMany({
    where: {
      id: { in: serviceIds },
      active: true
    },
    include: { tcategories: true },
    orderBy: { priority: 'desc' }
  });

  if (services.length === 0) {
    return [];
  }

  return services.map(mapToSearchableService);
}

/**
 * Преобразует результат Prisma (с полем tcategories) в ожидаемую форму
 * с полем category и без поля tcategories.
 *
 * @param {any} service Сервис из БД с присоединённой категорией
 * @returns {ServiceType} Сервис с полем category
 */
function mapToSearchableService(service: any): ServiceType {
  const { tcategories: category, tlocations: location, ...rest } = service;

  const mappedCategory: CategoryEntity = {
    id: category.id,
    code: category.code,
    sysname: category.sysname,
    name: category.name,
    photo: category.photo,
    parent_id: category.parent_id,
  };

  return {
    id: rest.id,
    name: rest.name,
    description: rest.description,
    price: String(rest.price),
    tcategories_id: rest.tcategories_id,
    provider_id: rest.provider_id,
    status: rest.status,
    created_at: rest.created_at,
    priority: rest.priority,
    category: mappedCategory,
    rating: rest.rating.toString(),
    view_count: rest.view_count,
    options: rest.service_options,
    address: location[0].address,
  };
}


