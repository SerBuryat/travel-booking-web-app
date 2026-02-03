# US-00002 Авторизация и вход в приложение Telegram Bot (mini-apps)

**Confluence:** [US-00002 Telegram Bot](https://badarabazarov.atlassian.net/wiki/spaces/DS/pages/3112961/US-00002+Telegram+Bot)

---

## 1. Бизнес-процесс (пользовательский сценарий)

- **Точка входа:** страница `/login/telegram` (mini-app открывается по ссылке из бота).
- **Описание:**
  1. Пользователь открывает mini-app из Telegram Bot → переход на `/login/telegram` с `initData` в hash URL (`#tgWebAppData=...`).
  2. Приложение читает и парсит `initData` из `window.location.hash`.
  3. Приложение отправляет данные на валидацию (проверка подписи Telegram).
  4. При успешной валидации показывается экран с данными пользователя и кнопкой «Войти».
  5. Пользователь нажимает «Войти» → создаётся/обновляется запись в БД, выставляются JWT-cookies, пользователь считается авторизованным → редирект на главную (`/home`).
  6. Если пользователь уже авторизован (есть сессия), при заходе на `/login/telegram` выполняется редирект на `/home`.
- **Исключения / краевые случаи:**
  - Нет hash в URL или пустой/некорректный hash → состояние NO_DATA, сообщение о необходимости открыть приложение из Telegram.
  - Валидация `initData` не прошла (подпись, бот) → состояние ERROR.
  - Ошибка при создании сессии (БД, токены) после нажатия «Войти» → состояние ERROR, пользователь остаётся на странице входа.

---

## 2. Реализация в коде

- **Область в коде:**
  - **Точка входа:** `src/app/login/telegram/page.tsx`
  - **UI и состояние:** `src/app/login/telegram/_hooks/useTelegramAuthState.ts`, `_components/TelegramAuthContent.tsx`, `_components/TelegramAuthProgress.tsx`, `_components/TelegramAuthHeader.tsx`, папка `_components/states/`
  - **Парсинг initData:** `src/lib/telegram/telegramInitData.ts` — `getInitData(hash)`
  - **Валидация initData:** `src/lib/telegram/validateTelegramInitData.ts` — server action `validateTelegramInitData(telegramUserInitData)`; внутри вызывается `validate(initData, botToken)` из `@telegram-apps/init-data-node`. Вызывается из `useTelegramAuthState` (клиент) и из `authWithTelegram` (сервер).
  - **Вход и сессия:** `src/contexts/AuthContext.tsx` — `loginViaTelegram`; `src/lib/auth/telegram/telegramAuth.ts` — `authWithTelegram` (server action), Prisma (`tclients`, `tclients_auth`, `tarea`), `authUtils` (JWT, cookies)
  - **Типы:** `src/types/telegram.ts` — `TelegramUserInitData`, `TelegramUserData`, `TelegramUserDataValidationResponse`

- **Цепочка вызовов:**
  1. **Страница:** `TelegramAuthPage` → `useTelegramAuthState()`.
  2. **При монтировании (useEffect):** если `!isAuthenticated` → `getInitData(window.location.hash)` → при ошибке парсинга → NO_DATA; иначе → `validateTelegramUserInitData(telegramUserInitData)`.
  3. **Валидация:** `validateTelegramUserInitData` → `validateTelegramInitData(telegramUserInitData)` (server action из `lib/telegram/validateTelegramInitData.ts`) → на сервере `validate(initData, botToken)` из `@telegram-apps/init-data-node`. Результат: SUCCESS (сохраняем `userData`) или ERROR.
  4. **Кнопка «Войти»:** `handleLoginWithTelegramUserInitData` → `loginViaTelegram(userData)` (AuthContext) → `authWithTelegram(telegramUserInitData)` (server action).
  5. **authWithTelegram:** валидация `await validateTelegramInitData(telegramUserInitData)` (тот же server action) → поиск/создание пользователя в БД (`tclients`, `tclients_auth`, при создании — `tarea` для default area) → `generateTokens`, `setJWTCookieInAction`, `setRefreshTokenCookieInAction`, `updateRefreshToken` в БД → возврат `UserAuth`. В контексте: `setUser(authUser)`, `currentLocation()` → `setLocation`, `setIsAuthenticated(true)`. В хуке: `router.push(PAGE_ROUTES.HOME)`.
  6. **Уже авторизован:** в `useEffect` при `isAuthenticated` → `ALREADY_AUTHENTICATED` и `router.push(PAGE_ROUTES.HOME)`.

- **Контекст данных:**
  - **Клиент:** `TelegramUserInitData` (initData, user, authDate, signature, hash), `TelegramUserData` (id, first_name, last_name?, username?, photo_url?), `TelegramUserDataValidationResponse` (success, error?, details?).
  - **Сервер/сессия:** `UserAuth` (userId, authId, role, providerId?), JWT и refresh token в cookies.
  - **БД:** Prisma — `tclients`, `tclients_auth`, `tarea`; при первом входе — создание клиента с default area, при повторном — обновление профиля и auth.

---

## 3. Оставшиеся вопросы / заметки по доработкам

- По желанию: оставить вызов валидации только в `authWithTelegram`, на UI только парсинг + кнопка «Войти».
