## Продовый деплой: чек-лист и краткая инструкция

Стек: Next.js (fullstack) в Docker Compose, Nginx как edge (TLS), Cloud.ru VPS (SSH), Cloud.ru Artifact Registry, PostgreSQL на VPS (без Docker), CI/CD — GitHub Actions.

### 1) Предварительная подготовка
- Домен подключён к VPS (A/AAAA записи на IP VPS).
- Доступ по SSH к VPS (ключи настроены).
- Cloud.ru Artifact Registry (создан репозиторий для образов, есть логин/пароль/токен или docker login через cloud CLI).
- PostgreSQL уже установлен на VPS. Есть БД, пользователь и пароль.

### 2) Secrets/конфиги (где и что хранить)
- GitHub Actions Secrets:
  - REGISTRY_URL (Cloud.ru registry, например: cr.cloud.ru/your-project)
  - REGISTRY_USERNAME / REGISTRY_PASSWORD (или токен)
  - VPS_HOST, VPS_USER, VPS_SSH_KEY (приватный ключ в Base64 или как секретный файл)
  - ENV_PROD (содержимое prod.env целиком либо хранить prod.env на VPS)
- На VPS:
  - файл `prod.env` (переменные окружения для приложения).
  - docker-compose.prod.yml
  - nginx конфиг + директория для сертификатов.

### 3) prod.env (примерные переменные)
- NODE_ENV=production
- PORT=3000
- DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db_name>?schema=public
- BOT_TOKEN=...
- NEXTAUTH_URL=https://your-domain
- JWT_SECRET=...
- (добавить свои: TELEGRAM_APP_ID, TELEGRAM_APP_HASH и т.п.)

Храним prod.env на VPS или прокидываем из CI при деплое; не коммитим в репозиторий.

### 4) Dockerfile (основа)
- Multi-stage (build + runtime). Примерно:
  - Билд приложения (`npm ci`, `npm run build`).
  - Запуск в production (`npm ci --omit=dev`), запуск Next.js (standalone или `next start`).
- Экспонировать порт 3000.

### 5) docker-compose.prod.yml (минимальная структура)
```yaml
services:
  app:
    image: <REGISTRY_URL>/travel-app:<tag>
    env_file: ./prod.env
    expose:
      - "3000"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    restart: unless-stopped
```

### 6) Nginx (reverse proxy + HTTPS)
- Основные задачи:
  - 80 → редирект на 443
  - TLS 1.2/1.3, сертификаты из `/etc/nginx/certs`
  - проксирование на `app:3000`
  - заголовки: `Host`, `X-Forwarded-Proto`, `X-Forwarded-For`
- Минимальный конфиг: см. пример в http-client.md ответе про Nginx (либо создадим отдельный файл `docs/help/deployment/nginx-example.md`).

### 7) Сертификаты (Let’s Encrypt)
Варианты:
1) Certbot на хосте (простой путь):
   - Остановить/прокинуть webroot для валидации (`/.well-known/acme-challenge`).
   - Команда: `certbot certonly --webroot -w /var/www/html -d your-domain`.
   - Симлинки/копии в `./certs` для Nginx: `fullchain.pem`, `privkey.pem`.
   - Крон на автообновление + `nginx -s reload` после обновления.
2) Dockerized (nginx-proxy + letsencrypt companion) — автоматизация, но сложнее стек.

Для старта рекомендую (1) — certbot на хосте, копируем certs в volume `./certs`.

### 8) CI/CD (GitHub Actions) — общий сценарий
Pipeline шаги:
1. Checkout → Install deps → Lint/Test → Build.
2. Docker login в Cloud.ru Artifact Registry.
3. Docker build + tag + push (`<REGISTRY_URL>/travel-app:<git-sha>` и `:latest`).
4. SSH на VPS и деплой:
   - Обновить `docker-compose.prod.yml` если нужно (обычно уже лежит на VPS).
   - `docker compose pull app` → `docker compose up -d` → `docker image prune -f`.
   - Не трогаем БД.

Дополнительно: можно передавать prod.env на VPS из Secrets, если не хранить его там.

### 9) Миграции БД (если Prisma)
- Выполнять перед запуском нового образа: `npx prisma migrate deploy` (из контейнера или отдельным шагом SSH на VPS).
- Либо bake в entrypoint контейнера.

### 10) Безопасность и настройки
- Куки: `Secure`, `HttpOnly`, `SameSite=Lax` (или `None; Secure` при необходимости кросс-сайта).
- HSTS в Nginx: включить `Strict-Transport-Security`.
- Заголовки безопасности: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- Логи: прокидывать real IP (`X-Forwarded-For`), хранить логи Nginx и приложения.

### 11) Процесс выката (сводка)
1. Мерж в main → GitHub Actions стартует.
2. CI собирает, тестит, билдит Docker image, пушит в Cloud.ru registry.
3. CI по SSH на VPS:
   - `docker login` (если требуется)
   - `docker compose pull app && docker compose up -d`
   - проверка `curl -I https://your-domain/health` (или `/api/health`).
4. Мониторинг и откат:
   - При проблемах — `docker compose rollback` (тег предыдущего образа) или `docker compose up -d` с прошлой версией.

### 12) Роллбек
- Хранить теги образов (например, последние 5 SHA).
- На VPS достаточно `docker compose pull app:<prev-tag>` и `up -d`.

### 13) Что НЕ забыть
- DNS → VPS.
- Файрволл: открыть 80/443.
- Certbot auto-renew.
- prod.env (секреты), `DATABASE_URL` указывает на локальный Postgres на VPS.
- Nginx перезапуск при обновлении конфигов/сертов.
- Healthcheck эндпоинт.

---

## Открытые вопросы / Решения на выбор
- Сертификаты: certbot на хосте vs dockerized companion? (рекомендую начать с certbot на хосте)
- prod.env: хранить на VPS (проще) или передавать из CI (централизация)?
- Prisma миграции: в entrypoint контейнера или отдельным CI шагом до `up -d`?
- Логи: где хранить (локально/внешний сервис)? Ротация логов.
- Мониторинг: нужен ли отдельный healthcheck/alerting? (например, UptimeRobot)
- Rollback: политика хранения прошлых тегов, автоматизация отката в CI.

Эта памятка — базовый ориентир. Дальше по ней создадим Dockerfile, docker-compose.prod.yml, Nginx конфиг, GitHub Actions, prod.env и проверим полный цикл.


