# Миграция API Routes на Server Actions

## Контекст
Большинство внутренних API роутов можно заменить на Server Actions для упрощения кода, улучшения типизации и производительности.

## Текущее состояние
В проекте есть множество API роутов, которые используются только внутри приложения:
- `api/auth/me` - получение текущего пользователя
- `api/auth/provider` - переключение на провайдера
- `api/auth/refresh` - обновление токена
- `api/areas` - получение областей
- `api/categories/parent-with-children` - получение категорий
- `api/provider/profile` - профиль провайдера
- `api/services/[serviceId]/click` - отслеживание кликов
- `api/services/create` - создание сервиса

## Цель
Заменить внутренние API роуты на Server Actions, оставив только внешние вызовы.

## Что сделать

### Этап 1: Создать Server Actions
- [ ] Создать `src/lib/actions/auth-actions.ts` с действиями:
  - `getCurrentUserAction()`
  - `switchToProviderAction()`
  - `refreshTokenAction()`
  - `logoutAction()`
- [ ] Создать `src/lib/actions/profile-actions.ts` с действиями:
  - `getProfileDataAction()`
  - `updateProfileAction()`
- [ ] Создать `src/lib/actions/service-actions.ts` с действиями:
  - `getServicesAction()`
  - `createServiceAction()`
  - `trackServiceClickAction()`
- [ ] Создать `src/lib/actions/provider-actions.ts` с действиями:
  - `getProviderProfileAction()`
  - `updateProviderProfileAction()`

### Этап 2: Обновить компоненты
- [ ] Заменить `fetch('/api/auth/me')` на `getCurrentUserAction()`
- [ ] Заменить `fetch('/api/auth/provider')` на `switchToProviderAction()`
- [ ] Заменить `fetch('/api/services/create')` на `createServiceAction()`
- [ ] Обновить все остальные компоненты аналогично

### Этап 3: Удалить ненужные API роуты
- [ ] Удалить `src/app/api/auth/me/route.ts`
- [ ] Удалить `src/app/api/auth/provider/route.ts`
- [ ] Удалить `src/app/api/auth/refresh/route.ts`
- [ ] Удалить `src/app/api/areas/route.ts`
- [ ] Удалить `src/app/api/categories/parent-with-children/route.ts`
- [ ] Удалить `src/app/api/provider/profile/route.ts`
- [ ] Удалить `src/app/api/services/[serviceId]/click/route.ts`
- [ ] Удалить `src/app/api/services/create/route.ts`

### Этап 4: Оставить только внешние API роуты
- [ ] Сохранить `src/app/api/auth/login/telegram/route.ts` (Telegram Mini App)
- [ ] Сохранить `src/app/api/health/route.ts` (мониторинг)
- [ ] Рассмотреть необходимость `src/app/api/auth/logout/route.ts`

## Преимущества
- **Меньше кода**: Server Actions короче API роутов
- **Лучшая типизация**: TypeScript знает точные типы возвращаемых данных
- **Проще тестирование**: можно тестировать функции напрямую
- **Лучшая производительность**: нет HTTP overhead для внутренних вызовов
- **Упрощение архитектуры**: меньше слоев абстракции

## Критерии приёмки
- [ ] Все внутренние API роуты заменены на Server Actions
- [ ] Компоненты используют Server Actions вместо fetch()
- [ ] Ненужные API роуты удалены
- [ ] Остались только внешние API роуты (Telegram, мониторинг)
- [ ] Все тесты проходят
- [ ] Функциональность не изменилась

## Приоритет
Средний - улучшение архитектуры, но не критично для MVP

## Связанные issues
- [separate-data-fetching-from-components.md](./separate-data-fetching-from-components.md)
- [use-ApiService-instead-of-fetch.md](./use-ApiService-instead-of-fetch.md)
