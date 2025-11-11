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