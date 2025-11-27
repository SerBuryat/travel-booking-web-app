# FRONTEND_REFACTORING.MD

## Связь артефактов

- **Главный артефакт:** `refactoring/REDACTORING.MD`
- **Этот документ:** детальный план фронтенд-рефакторинга (UI, компоненты, хуки, Server Actions, дублирование).

---

## 1. Цели фронтенд-рефакторинга

- Разделить ответственность компонентов: **UI** (рендер) vs **логика** (состояние, сайд-эффекты, бизнес-правила).
- Выделить и стабилизировать **переиспользуемые** компоненты и хуки.
- Перевести работу с данными на **Server Actions** из `src/lib/**` с хорошей типизацией.
- Уменьшить дублирование в отображении **сервисов**, **заявок** и форм.

---

## 2. Структура фронтенда

- **Компоненты**
  - `src/components/` — глобальные и переиспользуемые элементы.
  - `src/app/**/_components/` — локальные элементы конкретной страницы/фичи.
- **Хуки**
  - `src/hooks/common/**` — общие (переиспользуемые) хуки.
  - `src/app/**/_hooks/` — локальные хуки для конкретной страницы/фичи.
- **Работа с данными**
  - `src/lib/**` — server actions и функции работы с данными, которые используют и фронтенд, и другие части проекта.

---

## 3. Компоненты

### 3.1. Классификация компонентов (common vs локальные)

**Проблема**

- Компоненты в `src/components/` и `src/app/**/_components/` смешаны по ответственности.
- Повторно используемые элементы не помечены как `common`.

**Цель**

- Явно разделить:
  - **Переиспользуемые** компоненты → `src/components/common/**`.
  - **Локальные** компоненты → `src/app/<route>/_components/**`.

**Шаги**

1. Собрать список всех компонентов:
   - `src/components/*`
   - `src/app/**/_components/*`
2. Для каждого компонента определить количество мест использования (поиск по импорту).
3. Критерии:
   - Используется в 2+ независимых местах → `components/common/<domain>/...`.
   - Используется только в рамках одной страницы/фичи → `app/<route>/_components/`.
4. Обновить структуру:
   - `layout` (Header, Footer),
   - `ui` (SearchBar, SearchBarWrapper, модалки),
   - `service` (Vertical/Horizontal service view),
   - `category` (CategoryItem, CategoryHeaderComponent),
   - `request` (элементы отображения заявок).
5. Обновить все импорты.

**Пример целевой структуры**

```text
src/
  components/
    common/
      layout/
        Header.tsx
        Footer.tsx
      ui/
        SearchBar.tsx
        SearchBarWrapper.tsx
      service/
        VerticalServicesViewComponent.tsx
        HorizontalViewServiceComponent.tsx
      category/
        CategoryItem.tsx
        CategoryHeaderComponent.tsx
  app/
    catalog/
      _components/
        CatalogHeader.tsx
        CatalogEmptyState.tsx
    requests/
      _components/
        MyRequestsList.tsx
        ...
```

### 3.2. Повторяющиеся UI-паттерны

**Области риска**

- Карточки сервисов (вертикальные/горизонтальные).
- Карточки и списки заявок.
- Повторяющиеся заголовки секций, контейнеры страниц, баннеры.

**Действия**

1. Найти повторяющиеся куски JSX (через поиск по проекту).
2. Выделить базовые компоненты:
   - `ServiceCardBase`, `RequestCardBase`.
   - `PageContainer`, `SectionHeader`, `EmptyState`.
3. Параметризовать их через пропсы и унифицировать стили (tailwind + дизайн-системные решения).

---

## 4. Логика и хуки

### 4.1. Вынесение логики из компонентов в хуки

**См. раздел 1.2 в `REDACTORING.MD`** — там общий подход. Здесь — фокус на фронте.

**Основные зоны**

- **Поиск и фильтрация**
  - `SearchBar.tsx` → `useSearchBar`.
  - `ResultView.tsx` → `useCategoryFilter`.
- **Локация**
  - `SelectCurrentLocationComponent.tsx` → `useLocationSelector`.
- **Карусели**
  - `ImageCarousel.tsx` → `useImageCarousel`.
- **Бизнес-профиль провайдера**
  - `ServiceRegistrationBanner.tsx` → `useProviderCheck`.

**Принцип**

- Компонент:
  - получает данные и обработчики из хуков,
  - отвечает только за разметку и стили.
- Хук:
  - инкапсулирует состояние, валидацию, навигацию, вызовы server actions.

### 4.2. Организация хуков

**Цель**

- После вынесения логики привести все хуки к единой структуре:

```text
src/hooks/
  common/
    ui/
      useSearchBar.ts
      useImageCarousel.ts
      useModal.ts
    business/
      useCategoryFilter.ts
      useLocationSelector.ts
      useProviderCheck.ts
    forms/
      useFormSubmission.ts
    useToast.ts
    useAuth.ts
app/
  <route>/
    _hooks/
      useCreateRequestPage.ts
      useServiceDetailsPage.ts
```

**Шаги**

1. Составить список всех хуков после выноса логики.
2. Определить:
   - хуки, используемые в 2+ местах → `hooks/common/**`,
   - хуки, использующиеся только в одной странице → `app/<route>/_hooks/`.
3. Для общих хуков:
   - добавить JSDoc,
   - не тянуть в них UI-детали (только бизнес/поведение).

---

## 5. Server Actions и работа с данными

**Проблема**

- Сейчас часть фронта обращается к `src/app/api/**`, что добавляет лишний слой и ухудшает типизацию.

**Цель**

- Использовать функции из `src/lib/**` (Server Actions / server-only функции) напрямую.

**Действия**

1. Собрать список всех API routes, используемых фронтом:
   - `src/app/api/services/[serviceId]/click/route.ts`,
   - `src/app/api/categories/parent-with-children/route.ts`,
   - `src/app/api/areas/route.ts`,
   - и т.д.
2. Для каждого:
   - создать server action в соответствующем модуле `src/lib/<feature>/...`,
   - перенести туда логику.
3. Обновить фронтенд:
   - серверные компоненты → вызывают server actions напрямую,
   - клиентские компоненты → используют хуки, которые внутри вызывают server actions (через обёртки или специальный client→server контракт).
4. После миграции удалить неиспользуемые API routes (кроме внешних webhook’ов).

---

## 6. Устранение дублирования

**Ключевые зоны**

- Отображение сервисов (`VerticalServicesViewComponent`, `HorizontalViewServiceComponent` и их вариации).
- Отображение заявок (`renderRequestComponent` и похожие свитчи).
- Формы создания/редактирования (заявки, сервисы).

**Подход**

1. Найти повторяющиеся куски логики и разметки.
2. Вынести общую логику в:
   - хуки (например, общая логика сабмита форм, стейт загрузки/ошибок),
   - базовые UI-компоненты.
3. На уровне пропсов оперировать **доменными сущностями** (`service`, `request`, `user`), а не россыпью примитивов.

---

## 7. Связь с другими артефактами

- **Общий план:** `refactoring/REDACTORING.MD`
- **Бэкенд:** `refactoring/backend/BACKEND_REFACTORING.MD`
- **Cursor/AI:** `refactoring/cursor-ai/CURSOR_AI_REFACTORING.MD`
- **Документация:** `refactoring/docs/DOCS_REFACTORING.MD`

Работая во фронтенд-контексте, достаточно держать в контексте:

1. Этот файл (`FRONTEND_REFACTORING.MD`) — конкретные шаги.
2. `REDACTORING.MD` — общую картину и приоритеты.

{
  "cells": [],
  "metadata": {
    "language_info": {
      "name": "python"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 2
}