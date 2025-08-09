# User Story: История кликов по сервисам (Client Services Click History Flow)

## 📋 Описание
**Как** авторизованный клиент  
**Я хочу** нажать кнопку "Связаться" на странице сервиса и увидеть контакты  
**Чтобы** связаться с поставщиком услуги, а также чтобы этот факт сохранился в истории моих заказов

## 🎯 Критерии приемки
- [x] На странице сервиса видна кнопка "Связаться" (фиксированная внизу, выше `Navbar`)
- [x] По клику открывается модальное окно с контактами из `tcontacts`
- [x] В БД создается запись в `tservices_clicks` (уникальная на пару `(tclients_id, tservices_id)`)
- [x] Повторный клик не создает дубликат записи
- [x] Неавторизованному пользователю возвращается 401 и предлагается авторизация (редирект на `/telegram-auth`)
- [x] В разделе профиля "Мои заказы" отображается список сервисов, по которым были клики, с датой клика
- [x] Список заказов загружается на сервере без отдельного API вызова клиентом

## 🔄 Бизнес-процесс

### Шаг 1: Просмотр страницы сервиса
**Триггер:** Пользователь открывает страницу сервиса `/services/[serviceId]`  
**Компоненты:**
- `src/app/services/[serviceId]/page.tsx`
- `src/service/ServiceService.ts`
- `src/repository/ServiceRepository.ts`

**Действия:**
1. Сервер загружает расширенную информацию о сервисе (`ServiceTypeFull`) вместе с контактами (`tcontacts`)
2. На клиенте отображается информация о сервисе + кнопка "Связаться"

### Шаг 2: Нажатие кнопки "Связаться"
**Триггер:** Клиент нажимает кнопку "Связаться" на странице сервиса  
**Компоненты:**
- UI: `src/app/services/[serviceId]/SingleServiceView.tsx`
- API: `src/app/api/services/[serviceId]/click/route.ts`
- Бизнес-логика: `src/service/ServicesClicksService.ts`
- Репозиторий: `src/repository/ServicesClicksRepository.ts`

**Действия:**
1. Отправляется `POST /api/services/[serviceId]/click`
2. Сервер определяет текущего пользователя (`getServerUser`)
3. В сервисе создается уникальная запись в `tservices_clicks` (или возвращается существующая)
4. На клиенте открывается модальное окно с контактами (`service.contacts`), без дополнительной загрузки

### Шаг 3: Просмотр истории заказов (профиль)
**Триггер:** Клиент открывает страницу профиля с заказами `/profile/orders`  
**Компоненты:**
- Страница: `src/app/profile/orders/page.tsx`
- Сервис: `src/service/ServicesClicksService.ts`
- Репозиторий: `src/repository/ServicesClicksRepository.ts`
- UI: `src/app/profile/orders/_components/OrdersList.tsx`

**Действия:**
1. На сервере загружается список кликов пользователя (`getByClientsId(user.id)`) с обогащением именами сервисов
2. На клиент отправляется готовый список для отрисовки (`OrdersList`)
3. Пользователь видит список и может перейти к выбранному сервису

## 🏗️ Архитектура

### Frontend компоненты
```typescript
// Страница сервиса + кнопка "Связаться" и модальное окно
src/app/services/[serviceId]/page.tsx
src/app/services/[serviceId]/SingleServiceView.tsx

// Профиль / Мои заказы: серверная загрузка списка и отрисовка
src/app/profile/orders/page.tsx
src/app/profile/orders/_components/OrdersList.tsx
```

### Backend API
```typescript
// Фиксация клика по сервису
POST /api/services/[serviceId]/click
└── Создает уникальную запись (или возвращает существующую) в tservices_clicks
```

### Сервисы и репозитории
```typescript
// Сервисы
src/service/ServiceService.ts                // getServiceById -> ServiceTypeFull с contacts
src/service/ServicesClicksService.ts         // createUniqueClick, getByClientsId

// Репозитории
src/repository/ServiceRepository.ts          // findFullById (с include tcontacts)
src/repository/ServicesClicksRepository.ts   // createUnique, findByClientId
```

### База данных
```sql
-- Контакты сервиса
`tcontacts`
id (PK), tservices_id (FK), email, phone, tg_username, website, whatsap

-- История кликов клиентов по сервисам
`tservices_clicks`
id (PK), tclients_id (FK), tservices_id (FK), timestamp (default now())
UNIQUE (tclients_id, tservices_id)
INDEX (tclients_id)
```

## 🔧 Технические детали
- Кнопка "Связаться" располагается фиксированно над `Navbar` (z-index выше `z-50` — используется `zIndex: 60`)
- Модальное окно показывает контакты, уже загруженные вместе с сервисом (`ServiceTypeFull.contacts`)
- Запись клика идемпотентная: уникальный индекс на `(tclients_id, tservices_id)`
- Неавторизованный пользователь получает 401; UI предлагает авторизацию через `/telegram-auth`
- Раздел профиля грузит историю заказов на сервере без отдельного клиентского API-запроса

## 📊 Метрики успеха
- Время создания записи клика: < 200ms
- Время открытия модального окна: < 100ms
- Дубликаты записей: 0 (за счет уникального индекса)
- Ошибки 401 при клике: только для неавторизованных пользователей

## 🔄 Связанные процессы
- Аутентификация через Telegram — см. `docs/user-stories/telegram-auth-flow.md`

## 📝 Примечания
- MVP: без пагинации/фильтров в списке заказов
- В UI допускается простая реализация модального окна без сложного управления фокусом
- Контакты берутся из `tcontacts` и отображаются как есть, без дополнительной валидации

---
**Версия:** 1.0  
**Дата создания:** 2025-08-09  
**Статус:** ✅ Реализовано 


