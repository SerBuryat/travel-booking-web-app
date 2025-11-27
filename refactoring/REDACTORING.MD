# План глобального рефакторинга проекта

## Цель рефакторинга

Переход от service-layered архитектуры к feature-layered, улучшение переиспользования кода, повышение типизации, систематизация логирования и документации.

---

## 1. Структура артефактов рефакторинга

- **Главный артефакт:** этот файл `refactoring/REDACTORING.MD` — описывает общую цель, зоны рефакторинга и общий план.
- **Фронтенд:** `refactoring/frontend/FRONTEND_REFACTORING.MD` — детализация работ по фронту (компоненты, хуки, Server Actions, дублирование).
- **Бэкенд:** `refactoring/backend/BACKEND_REFACTORING.MD` — детализация работ по бэку (типы, Prisma, feature-layered, логирование).
- **Cursor/AI:** `refactoring/cursor-ai/CURSOR_AI_REFACTORING.MD` — правила и структура контекста для работы с проектом через ИИ.
- **Документация:** `refactoring/docs/DOCS_REFACTORING.MD` — README, JSDoc/TSDoc, комментарии в коде.

Для работы в конкретной сфере:
- сначала читать этот файл (`REDACTORING.MD`),
- затем соответствующий артефакт по сфере (фронт/бэк/AI/доки).

---

## 2. Frontend рефакторинг

### 2.1. Организация компонентов

**Текущее состояние:**
- Компоненты разбросаны между `src/components/` и `src/app/*/_components/`
- Нет четкого разделения между переиспользуемыми и локальными компонентами

**Целевое состояние:**
```
src/
  components/
    common/          # Переиспользуемые компоненты
      ui/            # Базовые UI компоненты (кнопки, модалки, формы)
      layout/        # Layout компоненты (Header, Footer)
      service/       # Компоненты для работы с сервисами
      category/      # Компоненты для работы с категориями
      request/       # Компоненты для работы с заявками
    Toast/           # Системные компоненты (уже есть)
  app/
    [page]/
      _components/   # Компоненты, используемые только на этой странице
```

**Действия:**
1. Проанализировать все компоненты в `src/components/`
2. Определить, какие используются в 2+ местах → переместить в `common/`
3. Компоненты, используемые только на одной странице → переместить в `_components/` этой страницы
4. Создать подпапки по функциональности (`ui/`, `layout/`, `service/`, и т.д.)

**Примеры:**
- `Header.tsx`, `Footer.tsx` → `components/common/layout/`
- `SearchBar.tsx`, `SearchBarWrapper.tsx` → `components/common/ui/`
- `VerticalServicesViewComponent.tsx`, `HorizontalViewServiceComponent.tsx` → `components/common/service/`
- `CategoryItem.tsx`, `CategoryHeaderComponent.tsx` → `components/common/category/`

### 2.2. Вынесение логики из компонентов в хуки

**Текущее состояние:**
- Многие React компоненты содержат бизнес-логику и состояние внутри себя
- Логика смешана с UI, что усложняет тестирование и переиспользование
- Примеры компонентов с логикой:
  - `SearchBar.tsx` - управление состоянием поиска, валидация, навигация
  - `ResultView.tsx` - управление выбранными категориями, фильтрация
  - `ImageCarousel.tsx` - управление слайдами, автопрокрутка
  - `ServiceRegistrationBanner.tsx` - проверка провайдера, модальные окна
  - `SelectCurrentLocationComponent.tsx` - загрузка локаций, поиск, обновление

**Целевое состояние:**
- Компоненты содержат только UI логику (рендеринг, стили)
- Вся бизнес-логика вынесена в хуки
- Хуки легко тестируются и переиспользуются

**Действия:**

#### Этап 1: Анализ компонентов
1. Найти все компоненты с `useState`, `useEffect`, `useCallback`, `useMemo`
2. Определить, какая логика относится к бизнес-логике, а какая к UI
3. Составить список компонентов для рефакторинга

#### Этап 2: Вынесение логики в хуки
Для каждого компонента с логикой:

**Пример 1: SearchBar**
```typescript
// Было: логика в компоненте
export const SearchBar = ({ searchValue, showCancelButton }) => {
  const [value, setValue] = useState(searchValue);
  const [error, setError] = useState();
  // ... логика валидации, навигации
};

// Стало: логика в хуке
// hooks/common/useSearchBar.ts
export function useSearchBar(initialValue?: string, onSearch?: (value: string) => void) {
  const [value, setValue] = useState(initialValue || '');
  const [error, setError] = useState<string | undefined>();
  // ... вся логика
  return { value, error, handleKeyDown, handleClear, ... };
}

// components/common/ui/SearchBar.tsx
export const SearchBar = ({ searchValue, showCancelButton }) => {
  const searchBar = useSearchBar(searchValue);
  // только UI рендеринг
};
```

**Пример 2: ResultView**
```typescript
// hooks/common/useCategoryFilter.ts
export function useCategoryFilter(initialCategories: number[], onFilterChange?: (ids: number[]) => void) {
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  // ... логика фильтрации
  return { selectedCategories, handleCategoryClick, ... };
}
```

**Пример 3: ImageCarousel**
```typescript
// hooks/common/useImageCarousel.ts
export function useImageCarousel(images: string[], autoPlay?: boolean) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // ... логика слайдера
  return { currentIndex, next, prev, goTo, ... };
}
```

**Пример 4: ServiceRegistrationBanner**
```typescript
// hooks/common/useProviderCheck.ts
export function useProviderCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [providerProfile, setProviderProfile] = useState(null);
  // ... логика проверки провайдера
  return { isChecking, providerProfile, checkProvider, ... };
}
```

**Пример 5: SelectCurrentLocationComponent**
```typescript
// hooks/common/useLocationSelector.ts
export function useLocationSelector() {
  const [areas, setAreas] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // ... логика загрузки и выбора локации
  return { areas, isLoading, loadAreas, selectLocation, ... };
}
```

#### Этап 3: Рефакторинг компонентов
1. Заменить логику в компонентах на использование хуков
2. Оставить только UI рендеринг
3. Протестировать функциональность

#### Этап 4: Реорганизация хуков (после вынесения логики)

**Целевое состояние:**
```
src/
  hooks/
    common/                    # Переиспользуемые хуки
      ui/                       # UI хуки
        useSearchBar.ts
        useImageCarousel.ts
        useModal.ts
      business/                 # Бизнес-логика
        useCategoryFilter.ts
        useLocationSelector.ts
        useProviderCheck.ts
      forms/                    # Хуки для форм
        useFormSubmission.ts
      useToast.ts               # (уже есть в компонентах, перенести)
      useAuth.ts                # Хук для работы с авторизацией
  app/
    [page]/
      _hooks/                   # Хуки, используемые только на этой странице
```

**Действия:**
1. Проанализировать все созданные хуки
2. Определить переиспользуемые (используются в 2+ местах) → `hooks/common/`
3. Определить локальные (только для одной страницы) → `_hooks/` страницы
4. Организовать по категориям (`ui/`, `business/`, `forms/`)

### 2.3. Замена API routes на Server Actions

**Текущее состояние:**
- API routes в `src/app/api/` используют Service классы
- Нет типизации запросов/ответов на уровне TypeScript

**Целевое состояние:**
- Все API routes заменены на Server Actions в `src/lib/`
- Server Actions экспортируются из соответствующих feature-модулей
- Полная типизация через TypeScript

**Действия:**
1. Для каждого API route создать Server Action в соответствующем модуле `src/lib/`
2. Примеры миграции:
   - `src/app/api/categories/parent-with-children/route.ts` → `src/lib/category/getParentCategories.ts` (server action)
   - `src/app/api/areas/route.ts` → `src/lib/location/getAreas.ts` (server action)
   - `src/app/api/services/[serviceId]/click/route.ts` → `src/lib/service/registerClick.ts` (server action)
3. Обновить все компоненты, использующие fetch → использовать server actions напрямую
4. Удалить папку `src/app/api/` (кроме внешних webhooks, если есть)

**Формат Server Action:**
```typescript
'use server';

import { prisma } from '@/lib/db/prisma';

/**
 * [getParentCategories] Получение родительских категорий с дочерними
 * @returns {Promise<CategoryWithChildren[]>} Список категорий
 */
export async function getParentCategories(): Promise<CategoryWithChildren[]> {
  // логика
}
```

### 2.4. Поиск и устранение дублирования

**Области для проверки:**
1. Компоненты отображения сервисов (вертикальный/горизонтальный вид)
2. Компоненты отображения заявок (дублирование `renderRequestComponent`)
3. Формы создания/редактирования
4. Логика валидации
5. Утилиты форматирования данных

**Действия:**
1. Найти дублирующиеся компоненты через поиск по кодовой базе
2. Вынести общую логику в переиспользуемые компоненты/хуки
3. Использовать композицию вместо дублирования

---

## 3. Backend рефакторинг

### 3.1. Рефакторинг типов

**Текущее состояние:**
- Типы в `src/model/` (ServiceType, CategoryType, ClientType, ContactsType)
- Entity в `src/entity/` (CategoryEntity, ServiceEntity, и т.д.)
- Типы разбросаны и не всегда рядом с использованием

**Целевое состояние:**
- Типы рядом с использованием в `src/lib/[feature]/`
- Экспорт типов для React компонентов из `src/lib/[feature]/types.ts` или прямо из файлов
- Удаление папок `src/model/` и `src/entity/`

**Действия:**
1. Для каждого feature-модуля в `src/lib/`:
   - Определить типы, используемые только внутри модуля → оставить локально
   - Определить типы, используемые в React компонентах → экспортировать из `types.ts`
2. Примеры миграции:
   - `ServiceType`, `ServiceTypeFull` → `src/lib/service/types.ts`
   - `CategoryType` → `src/lib/category/types.ts` (или использовать `CategoryEntity` напрямую)
   - `ClientType` → `src/lib/auth/types.ts` или `src/lib/client/types.ts`
3. Обновить все импорты в проекте
4. Удалить `src/model/` и `src/entity/` после миграции

**Структура типов:**
```typescript
// src/lib/service/types.ts
export interface ServiceType {
  // ...
}

export interface ServiceTypeFull extends ServiceType {
  // ...
}

// Экспорт для использования в React компонентах
```

### 3.2. Переход от service-layered к feature-layered

**Текущее состояние:**
- `src/repository/` - слой репозиториев
- `src/service/` - слой сервисов
- `src/lib/` - частично feature-layered (service, category, provider, request)

**Целевое состояние:**
- Удалить `src/repository/` и `src/service/`
- Вся логика в `src/lib/[feature]/`
- Каждый feature-модуль содержит все необходимые функции для работы с доменом

**Действия:**
1. Для каждого файла в `src/repository/` и `src/service/`:
   - Определить, к какому feature относится
   - Переместить логику в соответствующий модуль `src/lib/[feature]/`
   - Объединить Repository + Service логику в функции
2. Примеры миграции:
   - `CategoryRepository` + `CategoryService` → функции в `src/lib/category/`
   - `ClientRepository` + `ClientService` → функции в `src/lib/client/` или `src/lib/auth/`
   - `ProviderRepository` + `ProviderService` → функции в `src/lib/provider/`
3. Обновить все импорты
4. Удалить `src/repository/` и `src/service/`

**Структура feature-модуля:**
```
src/lib/category/
  searchCategories.ts      # Поиск категорий
  getCategoryById.ts       # Получение категории
  getParentCategories.ts   # Получение родительских категорий
  types.ts                 # Типы для экспорта
```

### 3.3. Вынесение повторяющихся запросов к БД

**Критерий:** Если один и тот же запрос к БД используется в 3+ местах → вынести в отдельную функцию

**Действия:**
1. Проанализировать все запросы к БД через Prisma
2. Найти дублирующиеся запросы
3. Вынести в функции в соответствующие feature-модули
4. Примеры (уже есть):
   - `src/lib/service/searchServices.ts` - поиск сервисов
   - `src/lib/category/searchCategories.ts` - работа с категориями

**Формат функций:**
```typescript
'use server';

import { prisma } from '@/lib/db/prisma';

/**
 * [getCategoryById] Получение категории по ID
 * @param {number} categoryId - ID категории
 * @returns {Promise<Category | null>} Категория или null
 */
export async function getCategoryById(categoryId: number): Promise<Category | null> {
  // логика
}
```

### 3.4. Систематизация логирования

**Текущее состояние:**
- Разные форматы логирования: `console.log`, `console.error`
- Нет единого формата для отслеживания места ошибки

**Целевое состояние:**
- Единый формат: `[<название функции>] <описание>`
- Все логи через единую функцию логирования (если есть в `src/lib/logsSender/`)

**Действия:**
1. Создать утилиту логирования в `src/lib/utils/logger.ts`:
   ```typescript
   export function log(functionName: string, message: string, level: 'info' | 'error' | 'warn' = 'info') {
     const prefix = `[${functionName}]`;
     const logMessage = `${prefix} ${message}`;
     
     if (level === 'error') {
       console.error(logMessage);
     } else if (level === 'warn') {
       console.warn(logMessage);
     } else {
       console.log(logMessage);
     }
   }
   ```
2. Заменить все `console.log/error` на использование этой утилиты
3. Формат: `log('functionName', 'описание', 'error')` → `[functionName] описание`

**Примеры:**
```typescript
// Было:
console.error('Ошибка получения категорий:', error);

// Стало:
log('getCategoryById', `Ошибка получения категории ${categoryId}: ${error}`, 'error');
```

---

## 4. Cursor AI и LLM агенты

### 4.1. Создание `.cursorrules`

**Цель:** Контекст для работы с проектом через ИИ

**Содержание:**
1. Архитектура проекта (feature-layered)
2. Соглашения по именованию
3. Структура папок
4. Паттерны использования (Server Actions, типы, логирование)
5. Примеры кода

**Действия:**
1. Создать файл `.cursorrules` в корне проекта
2. Описать текущую и целевую архитектуру
3. Добавить примеры правильного кода
4. Указать соглашения по стилю

---

## 5. Документация и код

### 5.1. README.md

**Содержание:**
1. Описание проекта
2. Архитектура (feature-layered)
3. Структура папок
4. Как запустить проект
5. Основные принципы разработки

### 5.2. Документация функций

**Требования:**
- JSDoc комментарии для всех экспортируемых функций
- Описание параметров и возвращаемых значений
- Примеры использования (где уместно)

**Формат:**
```typescript
/**
 * [functionName] Краткое описание функции
 * 
 * Подробное описание, если нужно
 * 
 * @param {Type} paramName - Описание параметра
 * @returns {Promise<ReturnType>} Описание возвращаемого значения
 * @throws {Error} Когда выбрасывается ошибка
 */
export async function functionName(paramName: Type): Promise<ReturnType> {
  // ...
}
```

### 5.3. Инкапсуляция длинных функций

**Принцип:** Функции должны быть короткими и понятными (желательно < 50 строк)

**Действия:**
1. Найти функции длиннее 50-100 строк
2. Разбить на маленькие функции с понятными названиями
3. Каждая функция должна делать одну вещь

**Пример:**
```typescript
// Было: одна большая функция
export async function updateService(...) {
  // 200 строк кода
}

// Стало: разбито на маленькие функции
export async function updateService(...) {
  await validateServiceAccess(...);
  await updateServiceData(...);
  await updateServiceLocation(...);
  await updateServiceContacts(...);
  await updateServicePhotos(...);
}

async function validateServiceAccess(...) { /* ... */ }
async function updateServiceData(...) { /* ... */ }
// и т.д.
```

### 5.4. Без оверинжиниринга

**Принципы:**
- Не создавать абстракции "на будущее"
- Не добавлять слои без необходимости
- Простота > сложность
- YAGNI (You Aren't Gonna Need It)

---

## 6. План выполнения

### Этап 1: Подготовка
1. ✅ Создать `REDACTORING.MD` (этот документ)
2. Создать `.cursorrules`
3. Создать `README.md` с описанием целевой архитектуры

### Этап 2: Backend рефакторинг
1. Систематизация логирования (создать утилиту, заменить console.log)
2. Рефакторинг типов (переместить из model/entity в lib/)
3. Миграция repository/service → feature-layered
4. Вынесение повторяющихся запросов к БД

### Этап 3: Frontend рефакторинг
1. **Вынесение логики из компонентов в хуки:**
   - Анализ компонентов с логикой
   - Создание хуков для бизнес-логики
   - Рефакторинг компонентов (оставить только UI)
2. **Организация компонентов** (common vs _components)
3. **Организация хуков** (common vs _hooks) - после вынесения логики
4. **Замена API routes на Server Actions**
5. **Устранение дублирования**

### Этап 4: Документация и финализация
1. Добавление JSDoc комментариев
2. Инкапсуляция длинных функций
3. Обновление README.md
4. Финальная проверка и тестирование

---

## 7. Принципы работы

### Приоритеты
1. **Безопасность:** Не ломать работающий функционал
2. **Постепенность:** Рефакторинг по одному модулю/feature
3. **Тестирование:** Проверять после каждого этапа
4. **Коммиты:** Мелкие коммиты с понятными сообщениями

### Метрики успеха
- ✅ Удалены папки: `src/model/`, `src/entity/`, `src/repository/`, `src/service/`, `src/app/api/`
- ✅ Все типы рядом с использованием
- ✅ Вся бизнес-логика вынесена из компонентов в хуки
- ✅ Компоненты содержат только UI логику
- ✅ Все компоненты правильно организованы (common vs _components)
- ✅ Все хуки правильно организованы (common vs _hooks)
- ✅ Все логи в едином формате `[functionName] message`
- ✅ Все функции документированы
- ✅ Нет дублирования кода

---

## 8. Примеры миграции

### Пример 1: Миграция API route → Server Action

**Было:**
```typescript
// src/app/api/categories/parent-with-children/route.ts
import {CategoryService} from '@/service/CategoryService';

export async function GET(request: NextRequest) {
  const categoryService = new CategoryService();
  const categories = await categoryService.getAllParentWithChildren();
  return NextResponse.json({ success: true, categories });
}
```

**Стало:**
```typescript
// src/lib/category/getParentCategories.ts
'use server';

import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/utils/logger';

/**
 * [getParentCategories] Получение родительских категорий с дочерними
 * @returns {Promise<CategoryWithChildren[]>} Список категорий
 */
export async function getParentCategories(): Promise<CategoryWithChildren[]> {
  try {
    const categories = await prisma.tcategories.findMany({
      where: { parent_id: null },
      include: { children: true },
      orderBy: { priority: 'asc' }
    });
    
    return categories;
  } catch (error) {
    log('getParentCategories', `Ошибка получения категорий: ${error}`, 'error');
    throw error;
  }
}
```

### Пример 2: Миграция типов

**Было:**
```typescript
// src/model/ServiceType.ts
export interface ServiceType { ... }

// src/entity/CategoryEntity.ts
export interface CategoryEntity { ... }
```

**Стало:**
```typescript
// src/lib/service/types.ts
export interface ServiceType { ... }
export interface ServiceTypeFull extends ServiceType { ... }

// src/lib/category/types.ts
export interface CategoryEntity { ... }
export interface CategoryWithChildren extends CategoryEntity { ... }
```

### Пример 3: Вынесение логики из компонентов в хуки

**Было:**
```typescript
// src/components/SearchBar.tsx
export const SearchBar = ({ searchValue, showCancelButton }) => {
  const [value, setValue] = useState(searchValue);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (value.length < 3) {
        setError('Enter at least 3 characters to search');
        return;
      }
      // навигация
    }
  };
  // ... остальная логика
};
```

**Стало:**
```typescript
// src/hooks/common/ui/useSearchBar.ts
export function useSearchBar(initialValue?: string) {
  const [value, setValue] = useState(initialValue || '');
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (value.length < 3) {
        setError('Enter at least 3 characters to search');
        return;
      }
      // навигация
    }
  };

  return { value, error, handleKeyDown, handleClear, ... };
}

// src/components/common/ui/SearchBar.tsx
export const SearchBar = ({ searchValue, showCancelButton }) => {
  const { value, error, handleKeyDown, handleClear } = useSearchBar(searchValue);
  // только UI рендеринг
};
```

### Пример 4: Организация компонентов

**Было:**
```
src/components/
  VerticalServicesViewComponent.tsx
  HorizontalViewServiceComponent.tsx
  CategoryItem.tsx
```

**Стало:**
```
src/components/common/
  service/
    VerticalServicesViewComponent.tsx
    HorizontalViewServiceComponent.tsx
  category/
    CategoryItem.tsx
```

---

## 9. Чеклист для рефакторинга

### Чеклист для компонентов:
- [ ] Вся бизнес-логика вынесена в хуки
- [ ] Компонент содержит только UI логику (рендеринг)
- [ ] Хуки созданы и протестированы
- [ ] Компонент правильно размещен (common vs _components)

### Чеклист для хуков:
- [ ] Хук правильно размещен (common vs _hooks)
- [ ] Хук документирован (JSDoc)
- [ ] Хук переиспользуемый или локальный (определено)

### Чеклист для feature-модуля (Backend):
- [ ] Все типы перемещены в `types.ts` или рядом с использованием
- [ ] Все функции документированы (JSDoc)
- [ ] Все логи в формате `[functionName] message`
- [ ] Нет дублирования кода
- [ ] Длинные функции разбиты на маленькие
- [ ] Server Actions вместо API routes (если применимо)
- [ ] Импорты обновлены во всем проекте
- [ ] Старые файлы удалены

---

## Примечания

- Этот документ - живой артефакт, его можно обновлять по мере выполнения рефакторинга
- При возникновении вопросов - обращаться к этому документу
- Можно работать с 0 контекста, используя этот документ как руководство

