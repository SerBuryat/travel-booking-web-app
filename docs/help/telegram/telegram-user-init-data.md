# Получение данных пользователя из Telegram Mini Apps

## 1. Получение данных из window.location.hash

```javascript
const hash = window.location.hash;
```

**Пример:**
```
#tgWebAppData=user%3D%257B%2522id%2522%253A878829263%252C%2522first_name%2522%253A%2522Artem%2522%252C%2522last_name%2522%253A%2522Anosov%2522%252C%2522username%2522%253A%2522ser_buryat%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FXAwhFXQYWEUlnm-50j7j2p4VV1wEqlQmyTWJvqrXcqg.svg%2522%257D%26chat_instance%3D-7264386640970494031%26chat_type%3Dsender%26auth_date%3D1757432809%26signature%3D2qLojHstv1-flLcqa8h9oGsKKAH-fkECe_oZbEc70uJo48zr1gLtEftXaQMs4kh6v7_KthDPctx5DC_F_7kYBQ%26hash%3Df6a3d0608dbb7662cfd2b5e6d155e6fb9f9ba0c5182ddc69a5620ac143ec8802&tgWebAppVersion=9.1&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22accent_text_color%22%3A%22%236ab2f2%22%2C%22bg_color%22%3A%22%2317212b%22%2C%22bottom_bar_bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23ec3942%22%2C%22header_bg_color%22%3A%22%2317212b%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%226ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22section_bg_color%22%3A%22%2317212b%22%2C%22section_header_text_color%22%3A%22%236ab3f3%22%2C%22section_separator_color%22%3A%22%23111921%22%2C%22subtitle_text_color%22%3A%22%23708499%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D
```

## 2. Поля в сырых данных

- `user` - данные пользователя (JSON в URL-кодировке)
- `chat_instance` - ID чата
- `chat_type` - тип чата (sender/group/channel)
- `auth_date` - время авторизации
- `signature` - подпись для валидации
- `hash` - хеш для проверки целостности
- `tgWebAppVersion` - версия Mini App
- `tgWebAppPlatform` - платформа (tdesktop/web/android/ios)
- `tgWebAppThemeParams` - параметры темы

## 3. Получение данных пользователя

```javascript
const initData = hash.replace('#tgWebAppData=', '');
const urlParams = new URLSearchParams(initData);
const userData = urlParams.get('user');
const user = JSON.parse(decodeURIComponent(userData));
```

**Пример данных после params.get('tgWebAppData'):**
```
user=%7B%22id%22%3A878829263%2C%22first_name%22%3A%22Artem%22%2C%22last_name%22%3A%22Anosov%22%2C%22username%22%3A%22ser_buryat%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FXAwhFXQYWEUlnm-50j7j2p4VV1wEqlQmyTWJvqrXcqg.svg%22%7D&chat_instance=-7264386640970494031&chat_type=sender&auth_date=1757437549&signature=4c8zfsuj8EG-CSWCYwIgJIapj9esvQtylcYC600YFk8M71lfF7D0HEq5dUo8utYoXTHQ6t5W8AiRU3a7xbg7AQ&hash=771c7296c8153eb3ddb169489ee3fea0339301dde27a8a46c1ab0631ca13515a
```

## 4. Поля пользователя

- `id` - ID пользователя
- `first_name` - имя
- `last_name` - фамилия
- `username` - username
- `language_code` - код языка
- `allows_write_to_pm` - разрешение писать в ЛС
- `photo_url` - URL аватара

## 5. Валидация данных

```javascript
import { validate } from '@telegram-apps/init-data-node';

const isValid = validate(initData, BOT_TOKEN);
```

Проверяет подлинность `signature` и `hash` с использованием `BOT_TOKEN` бота.
