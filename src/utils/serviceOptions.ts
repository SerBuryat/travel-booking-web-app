/**
 * Service Options - константы для опций категорий сервисов
 * Временное решение для MVP, потом заменить на полноценную БД таблицу
 */

export interface ServiceCategoryOption {
  name: string;
  description: string;
  options: string[];
}

export const ServiceOptions: Record<string, ServiceCategoryOption> = {
  ACCOMMODATION: {
    name: "accommodation",
    description: "Проживание",
    options: [
      "wi-fi",
      "бассейн", 
      "кондиционер",
      "кухня",
      "парковка",
      "спортзал",
      "сауна",
      "детская площадка"
    ]
  },
  TRANSPORT: {
    name: "transport",
    description: "Транспорт",
    options: [
      "встреча в аэропорту",
      "доставка до отеля",
      "групповой трансфер",
      "VIP трансфер",
      "детское кресло",
      "багаж включен"
    ]
  },
  FOOD: {
    name: "food",
    description: "Питание",
    options: [
      "завтрак",
      "полупансион",
      "полный пансион",
      "аллергическое меню",
      "вегетарианское",
      "диетическое",
      "детское меню"
    ]
  }
};

/**
 * Получить все доступные категории опций
 */
export function getServiceCategories(): string[] {
  return Object.keys(ServiceOptions);
}

/**
 * Получить опции для конкретной категории
 */
export function getOptionsForCategory(category: string): string[] {
  return ServiceOptions[category]?.options || [];
}

/**
 * Получить описание категории
 */
export function getCategoryDescription(category: string): string {
  return ServiceOptions[category]?.description || "";
}

/**
 * Проверить, существует ли категория
 */
export function isValidCategory(category: string): boolean {
  return category in ServiceOptions;
}

/**
 * Получить все опции всех категорий (плоский список)
 */
export function getAllOptions(): string[] {
  return Object.values(ServiceOptions).flatMap(category => category.options);
}
