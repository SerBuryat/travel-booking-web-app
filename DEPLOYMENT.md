# Деплой Travel Booking Web App

## Подготовка к деплою

### 1. Создание .env.production файла

Создайте файл `.env.production` на основе `.env.example`:

```bash
cp .env.example .env.production
```

Заполните следующие переменные:

```env
# SSH Tunnel Configuration
SSH_HOST=your-ssh-server.com
SSH_USER=your-ssh-username
SSH_PASSWORD=your-ssh-password

# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"

# Next.js Environment
NODE_ENV=production

# Telegram Bot Configuration
BOT_TOKEN=your_bot_token_here
BOT_NAME=your_bot_name_here

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 2. Локальная сборка и тестирование

```bash
# Сборка Docker образа
docker build -t travel-booking-app .

# Тестирование локально
docker-compose -f docker-compose.prod.yml up --build
```

### 3. Деплой на Container-as-a-Service

#### Вариант A: Railway

1. Установите Railway CLI:
```bash
npm install -g @railway/cli
```

2. Логин в Railway:
```bash
railway login
```

3. Создайте новый проект:
```bash
railway init
```

4. Настройте переменные окружения в Railway Dashboard

5. Деплой:
```bash
railway up
```

#### Вариант B: Render

1. Подключите GitHub репозиторий к Render
2. Настройте Web Service
3. Укажите команды:
   - Build: `docker build -t travel-booking-app .`
   - Start: `docker run -p 3000:3000 travel-booking-app`

#### Вариант C: DigitalOcean App Platform

1. Создайте App в DigitalOcean
2. Подключите GitHub репозиторий
3. Настройте переменные окружения
4. Укажите Dockerfile как источник

### 4. Мониторинг и Health Checks

Приложение включает health check endpoint: `/api/health`

Проверка статуса:
```bash
curl https://your-app-url.com/api/health
```

### 5. Логи и отладка

Просмотр логов:
```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml logs -f app

# Docker
docker logs <container_id>
```

### 6. Безопасность

- **SSH пароли**: Используйте переменные окружения, никогда не хардкодите
- **JWT секреты**: Генерируйте уникальные секреты для продакшена
- **Порты**: Приложение работает на порту 3000
- **Firewall**: Настройте firewall для ограничения доступа

### 7. Масштабирование

Для горизонтального масштабирования:

```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  app:
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
```

### 8. Troubleshooting

#### Проблема: SSH tunnel не устанавливается
- Проверьте SSH_HOST, SSH_USER, SSH_PASSWORD
- Убедитесь, что SSH сервер доступен
- Проверьте firewall на SSH сервере

#### Проблема: БД недоступна
- Проверьте DATABASE_URL
- Убедитесь, что SSH tunnel работает
- Проверьте права доступа пользователя БД

#### Проблема: Приложение не запускается
- Проверьте логи: `docker logs <container_id>`
- Убедитесь, что все переменные окружения установлены
- Проверьте health check endpoint

### 9. Backup и восстановление

Рекомендуется настроить автоматическое резервное копирование БД на SSH сервере.

### 10. Обновления

Для обновления приложения:

```bash
# Остановка
docker-compose -f docker-compose.prod.yml down

# Обновление кода
git pull origin main

# Пересборка и запуск
docker-compose -f docker-compose.prod.yml up --build -d
```
