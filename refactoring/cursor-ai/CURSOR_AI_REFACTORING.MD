# CURSOR_AI_REFACTORING.MD

## Связь артефактов

- **Главный артефакт:** `refactoring/REDACTORING.MD`
- **Этот документ:** правила и структура контекста для работы с проектом через Cursor/LLM.

---

## 1. Цели для Cursor / LLM

- Описать проект так, чтобы **агенты ИИ могли работать с минимальным контекстом** (1–2 файла).
- Задать **жёсткую структуру артефактов рефакторинга**, чтобы легко делить задачи по сферам (фронт, бэк, доки).
- Снизить энтропию в диалогах с ИИ: ссылки на нужные артефакты вместо пересказа проекта с нуля.

---

## 2. Структура артефактов

- `refactoring/REDACTORING.MD` — главный документ:
  - общая цель рефакторинга,
  - список сфер (frontend, backend, Cursor/AI, доки),
  - high-level план.
- `refactoring/frontend/FRONTEND_REFACTORING.MD` — фронт.
- `refactoring/backend/BACKEND_REFACTORING.MD` — бэк.
- `refactoring/cursor-ai/CURSOR_AI_REFACTORING.MD` — этот документ.
- `refactoring/docs/DOCS_REFACTORING.MD` — документация и комментарии в коде.

**Принцип:** один артефакт = один контекст / одна сфера ответственности.

---

## 3. .cursorrules (правила для Cursor)

### 3.1. Основные разделы .cursorrules

Рекомендуемая структура `.cursorrules`:

1. **Общее описание проекта**
   - Назначение (travel booking / marketplace услуг).
   - Стек: Next.js (App Router), TypeScript, Prisma, Telegram-интеграция.
2. **Архитектура**
   - Feature-layered подход: `src/lib/<feature>/**`.
   - Frontend: `src/app/**` (страницы), `src/components/**` (компоненты), `src/hooks/**` (хуки).
   - Backend: Prisma (`src/lib/db/prisma.ts`), бизнес-логика в `src/lib/**`.
3. **Артефакты рефакторинга**
   - Описание папки `refactoring/` и роли:
     - `REDACTORING.MD` — общий план.
     - ссылки на фронт/бэк/доки/AI.
4. **Соглашения по коду**
   - Логирование: формат `[functionName] message`.
   - Где располагать типы (в `src/lib/<feature>/types.ts`).
   - Где располагать хуки и компоненты.
5. **Паттерны использования**
   - Примеры Server Actions.
   - Примеры работы с Prisma.
   - Примеры вынесения логики из компонентов в хуки.

---

## 4. Использование артефактов с ИИ

### 4.1. Для каких запросов какой артефакт

- Нужно понять общую картину / план? → `refactoring/REDACTORING.MD`.
- Реорганизовать фронтовые компоненты/хуки? → `refactoring/frontend/FRONTEND_REFACTORING.MD`.
- Поменять архитектуру бэка, репозиториев, сервисов? → `refactoring/backend/BACKEND_REFACTORING.MD`.
- Добавить/улучшить документацию? → `refactoring/docs/DOCS_REFACTORING.MD`.

### 4.2. Рекомендованный prompt-паттерн

Для работы с ИИ/агентом:

> 1. Прочитай `refactoring/REDACTORING.MD` и артефакт по нужной сфере (например, `refactoring/frontend/FRONTEND_REFACTORING.MD`).  
> 2. На основе них предложи изменения в следующих файлах: ...

Это позволяет:

- ограничить контекст до 1–2 файлов,
- гарантировать, что агент учитывает архитектурный план.

---

## 5. Организация задач для нескольких агентов/разработчиков

**Идея:** каждый разработчик/агент работает в своей сфере, не мешая другим.

- Фронтенд-разработчик:
  - читает `FRONTEND_REFACTORING.MD`,
  - создаёт под-артефакты (по конкретным страницам/модулям, если нужно).
- Бэкенд-разработчик:
  - читает `BACKEND_REFACTORING.MD`,
  - ведёт свои под-артефакты (по доменам: service, request, provider).
- Техписатель / ответственный за документацию:
  - читает `DOCS_REFACTORING.MD`.
- Любой агент ориентируется по:
  - `REDACTORING.MD` → куда идти,
  - нужному артефакту сферы → что делать.

---

## 6. Связь с другими артефактами

- **Общий план:** `refactoring/REDACTORING.MD`
- **Фронтенд:** `refactoring/frontend/FRONTEND_REFACTORING.MD`
- **Бэкенд:** `refactoring/backend/BACKEND_REFACTORING.MD`
- **Документация:** `refactoring/docs/DOCS_REFACTORING.MD`

Этот файл задаёт правила и ожидания для работы агентов/ИИ с проектом и артефактами.


