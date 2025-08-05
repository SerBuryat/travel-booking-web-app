# User Story: Аутентификация через Telegram Mini Apps

## 📋 Описание
**Как** пользователь Telegram  
**Я хочу** войти в приложение через Telegram Mini Apps  
**Чтобы** получить доступ к сервисам без дополнительной регистрации

## 🎯 Критерии приемки
- [x] Пользователь может перейти из Telegram Mini Apps в приложение
- [x] Данные пользователя автоматически валидируются
- [x] Создается/обновляется профиль пользователя в системе
- [x] Пользователь получает доступ к защищенным разделам
- [x] Процесс занимает не более 30 секунд

## 🔄 Бизнес-процесс

### Шаг 1: Переход из Telegram Mini Apps
**Триггер:** Пользователь нажимает кнопку в Telegram Mini Apps  
**Компоненты:** 
- `src/app/telegram-auth/page.tsx` - страница авторизации
- `getInitData()` - извлечение данных из URL hash

**Действия:**
1. Пользователь переходит по ссылке из Telegram
2. Система извлекает `tgWebAppData` из `window.location.hash`
3. Отображается индикатор загрузки

### Шаг 2: Валидация данных Telegram
**Компоненты:**
- `src/app/api/auth/telegram/route.ts` - валидация данных
- `@telegram-apps/init-data-node` - библиотека валидации

**Действия:**
1. Фронтенд отправляет `initData` на `/api/auth/telegram`
2. Система валидирует подпись с помощью `BOT_TOKEN`
3. Возвращается объект `TelegramUser` или ошибка

### Шаг 3: Аутентификация в системе
**Триггер:** Пользователь нажимает "Перейти в приложение"  
**Компоненты:**
- `src/app/api/auth/login-telegram/route.ts` - аутентификация
- `src/service/ClientService.ts` - бизнес-логика
- `src/repository/ClientRepository.ts` - работа с БД
- `src/lib/jwt.ts` - генерация токенов

**Действия:**
1. Генерируется `authId = "telegram_${user.id}"`
2. Создается JWT токен (1 час) и refresh токен (7 дней)
3. В транзакции:
   - Создается/обновляется запись в `tclients`
   - Создается/обновляется запись в `tclients_auth`
   - Сохраняется refresh token
4. Токены устанавливаются в httpOnly cookies
5. Пользователь перенаправляется на `/home`

## 🏗️ Архитектура

### Frontend компоненты
```typescript
// Страница авторизации
src/app/telegram-auth/page.tsx
├── getInitData() - извлечение данных из URL
├── validateInitData() - валидация через API
└── handleLogin() - аутентификация в системе
```

### Backend API
```typescript
// Валидация Telegram данных
POST /api/auth/telegram
├── Валидация initData
├── Парсинг user данных
└── Возврат TelegramUser

// Аутентификация в системе
POST /api/auth/login-telegram
├── Генерация JWT токенов
├── Создание/обновление пользователя
├── Сохранение refresh token
└── Установка cookies
```

### База данных
```sql
-- Пользователи
tclients
├── id (PK)
├── name
├── email
├── additional_info (JSON с Telegram данными)
└── created_at

-- Аутентификация
tclients_auth
├── id (PK)
├── tclients_id (FK)
├── auth_type = 'telegram'
├── auth_id = 'telegram_${user.id}'
├── refresh_token
├── token_expires_at
├── role = 'user'
└── is_active = true
```

## 🔧 Технические детали

### Транзакционность
```typescript
// Атомарная операция создания/обновления пользователя
await prisma.$transaction(async (tx) => {
  // Поиск существующего пользователя
  const client = await findByAuthIdTx(tx, authId);
  
  if (client) {
    // Обновление существующего
    await updateTx(tx, client.id, updateData);
    await updateAuthTx(tx, auth.id, authData);
  } else {
    // Создание нового
    const newClient = await createTx(tx, createData);
    await createAuthTx(tx, authData);
  }
});
```

### Безопасность
- **HttpOnly cookies** - защита от XSS
- **Валидация Telegram** - проверка подписи
- **Транзакции БД** - атомарность операций
- **Логирование** - отслеживание попыток входа

### Обработка ошибок
```typescript
// Типы ошибок
enum AuthError {
  INVALID_TELEGRAM_DATA = 'Invalid Telegram data',
  USER_CREATION_FAILED = 'Failed to create user',
  TOKEN_GENERATION_FAILED = 'Failed to generate tokens',
  DATABASE_ERROR = 'Database operation failed'
}
```

## 📊 Метрики успеха
- **Время аутентификации:** < 30 секунд
- **Успешность входа:** > 95%
- **Ошибки валидации:** < 1%
- **Время отклика API:** < 500ms

## 🔄 Связанные процессы
- **Обновление токенов** - `/api/auth/refresh`
- **Выход из системы** - `/api/auth/logout`
- **Проверка аутентификации** - `/api/auth/me`
- **Валидация токенов** - `/api/auth/validate`

## 📝 Примечания
- Процесс работает только с валидными данными Telegram
- Новые пользователи автоматически получают роль 'user'
- Refresh токены имеют срок действия 7 дней
- Все операции логируются для аудита

---
**Версия:** 1.0  
**Дата создания:** 2024-12-19  
**Статус:** ✅ Реализовано 