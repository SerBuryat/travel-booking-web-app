# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем SSH клиент и необходимые инструменты
RUN apk add --no-cache openssh-client bash expect netcat-openbsd

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Создаем директорию для SSH ключей
RUN mkdir -p /app/.ssh && chmod 700 /app/.ssh

# Создаем скрипт для установки SSH tunnel
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app

# Открываем порт
EXPOSE 3000

# Используем entrypoint скрипт
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"] 