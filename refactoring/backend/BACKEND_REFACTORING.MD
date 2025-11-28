# BACKEND_REFACTORING.MD

## Связь артефактов

- **Главный артефакт:** `refactoring/REDACTORING.MD`
- **Этот документ:** детальный план бэкенд-рефакторинга (типы, feature-layered, Prisma, логирование).

---

## 1. Цели бэкенд-рефакторинга

- Перейти от **service-layered** (repository/service) к **feature-layered** архитектуре.
- Сконцентрировать бизнес-логику вокруг **feature-модулей** в `src/lib/**`.
- Сделать типы прозрачными и доступными для фронта из одного места.
- Систематизировать использование Prisma и логирование.

---

## 2. Архитектурная целевая модель

### 2.1. Текущая архитектура

- `src/model/**` — DTO/типы для фронта и бэка.
- `src/entity/**` — доменные сущности.
- `src/repository/**` — слой доступа к данным (обёртки над Prisma).
- `src/service/**` — бизнес-логика поверх репозиториев.
- `src/lib/**` — частично feature-layered (service, category, provider, request и т.д.).

### 2.2. Целевая архитектура

- Отказ от явных слоёв `repository/` и `service/`.
- Вся логика живёт в `src/lib/<feature>/`:
  - `types.ts` — типы и интерфейсы для данного feature.
  - `*.ts` — отдельные файлы, описывающие операции/сценарии.
- Frontend и Server Actions используют функции из `src/lib/**`.

**Пример структуры**

```text
src/lib/
  service/
    searchServices.ts
    createService.ts
    editService.ts
    deleteService.ts
    clicks.ts
    types.ts
  category/
    searchCategories.ts
    getCategoryById.ts
    getParentCategories.ts
    types.ts
  provider/
    searchProvider.ts
    profile.ts
    servicesEdit.ts
    types.ts
  request/
    client/**    # операции с заявками от клиента
    provider/**  # операции с заявками для провайдера
    types.ts
```

---

## 3. Типы и модели

### 3.1. Проблемы

- Типы разбросаны между `src/model/**` и `src/entity/**`.
- Непрозрачно, какие типы используются только на бэке, а какие уходят на фронт.

### 3.2. Цели

- **Внутренние типы** (только для бэка) — рядом с логикой в `src/lib/<feature>/types.ts` или в тех же файлах.
- **Экспортируемые типы** (для фронта) — централизованно экспортируются из `src/lib/<feature>/types.ts`.
- Удалить `src/model/**` и `src/entity/**` после миграции.

### 3.3. План действий

1. Для каждого feature-модуля в `src/lib/**`:
   - Собрать существующие типы из `model`, `entity`, текущих файлов `lib`.
   - Разделить их на:
     - внутренние (используются только на бэке),
     - экспортируемые (используются фронтом).
2. Создать `src/lib/<feature>/types.ts`:
   - Перенести туда интерфейсы/типы.
   - Экспортировать минимально необходимый публичный API типов.
3. Обновить импорты по всему проекту:
   - заменить `@/model/...` и `@/entity/...` на `@/lib/<feature>/types`.
4. После того как все импорты будут указывать на `src/lib/**`, удалить директории `model/` и `entity/`.

---

## 4. Переход от repository/service к feature-модулям

### 4.1. Проблемы

- Избыточные слои: Repository → Service → Lib.
- Тонкие обёртки вокруг Prisma без добавленной ценности.

### 4.2. Цели

- Объединить ответственность слоёв в feature-модулях:
  - одна операция/сценарий = одна хорошо названная функция.
- Снизить количество \"прокладок\" между Prisma и бизнес-логикой.

### 4.3. План миграции

1. Для каждого файла в `src/repository/**`:
   - Найти всех его потребителей.
   - Отнести его к конкретному feature (category, service, provider, request, area и т.п.).
   - Перенести реализацию в `src/lib/<feature>/...` (новый или существующий файл).
2. Для каждого файла в `src/service/**`:
   - Аналогично найти потребителей.
   - Слить его логику в функции внутри `src/lib/<feature>/...`.
3. После миграции убедиться:
   - что фронт и server actions используют только `src/lib/**`,
   - что нет прямых импортов из `repository/` и `service/`.
4. Удалить папки `src/repository/**` и `src/service/**`.

---

## 5. Запросы к БД (Prisma)

### 5.1. Проблемы

- Повторяющиеся Prisma-запросы в разных частях кода.
- Нет единого \"канонического\" места для получения данных по сущности.

### 5.2. Цели

- Для всех ключевых сценариев чтения/записи данных есть именованные функции в `src/lib/<feature>/**`.
- Один и тот же запрос к БД не копируется 3+ раз по коду.

### 5.3. План действий

1. Поиск повторяющихся запросов:
   - использовать поиск по `prisma.<table>.findMany`, `findUnique`, `update`, `create` и т.д.
   - сгруппировать запросы по совпадающим `where/orderBy/include`.
2. Для каждого повторяющегося запроса:
   - создать функцию в соответствующем feature-модуле, например:
     - `getActiveServicesByProvider(providerId: number)`,
     - `getParentCategoriesWithChildren()`,
     - `getClientRequests(userId: number)`.
3. Заменить все прямые вызовы Prisma на вызовы этих функций.
4. Для сложных сценариев (транзакции, несколько таблиц) выделять функции уровня сценариев:
   - `createServiceWithContactsAndPhotos(...)`,
   - `updateServiceWithMedia(...)`,
   - и т.п.

---

## 6. Логирование

### 6.1. Проблемы

- Несогласованное использование `console.log` / `console.error`.
- Логи не всегда содержат контекст (какая функция, какие входные данные).

### 6.2. Цели

- Единый формат логов: `[functionName] message`.
- Возможность в будущем заменить console на внешний логгер без массового рефакторинга.

### 6.3. План действий

1. Создать утилиту `src/lib/utils/logger.ts`:

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

2. Найти все `console.log`, `console.error`, `console.warn` в `src/lib/**`:
   - Заменить на `log('functionName', 'описание', 'level')`.
   - При логировании ошибок добавлять `error.message` и/или стек при необходимости.
3. Для ключевых процессов (создание заявок и сервисов, авторизация, Telegram-интеграция):
   - добавить явные логирующие точки до и после операций.

---

## 7. Связь с другими артефактами

- **Общий план:** `refactoring/REDACTORING.MD`
- **Фронтенд:** `refactoring/frontend/FRONTEND_REFACTORING.MD`
- **Cursor/AI:** `refactoring/cursor-ai/CURSOR_AI_REFACTORING.MD`
- **Документация:** `refactoring/docs/DOCS_REFACTORING.MD`

Для работы в бэкенд-контексте достаточно:

1. Этот файл (`BACKEND_REFACTORING.MD`) — конкретные шаги.
2. `REDACTORING.MD` — общие цели и приоритеты.

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