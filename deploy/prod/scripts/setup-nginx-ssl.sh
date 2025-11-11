#!/bin/bash

# Скрипт для настройки nginx и SSL сертификатов на VPS

set -e

echo "🔧 Настраиваем nginx и SSL сертификаты..."

# Переходим в папку deploy
cd "$(dirname "$0")/.."

# Устанавливаем nginx и certbot
echo "📦 Устанавливаем nginx и certbot..."
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y

# Запускаем nginx
echo "🚀 Запускаем nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Создаем конфигурацию nginx
echo "⚙️  Создаем конфигурацию nginx..."
sudo tee /etc/nginx/sites-available/travel-app-service.ru > /dev/null << 'EOF'
server {
    listen 80;
    server_name travel-app-service.ru;

    client_max_body_size 10M;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

# Активируем конфигурацию
echo "🔗 Активируем конфигурацию nginx..."
sudo ln -sf /etc/nginx/sites-available/travel-app-service.ru /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
echo "🔍 Проверяем конфигурацию nginx..."
sudo nginx -t

# Перезагружаем nginx
echo "🔄 Перезагружаем nginx..."
sudo systemctl reload nginx

# Получаем SSL сертификаты
echo "🔐 Получаем SSL сертификаты..."
sudo certbot --nginx -d travel-app-service.ru --non-interactive --agree-tos --email tema.anosov@yandex.ru

# Настраиваем автоматическое обновление сертификатов
echo "⏰ Настраиваем автоматическое обновление сертификатов..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ nginx и SSL сертификаты настроены успешно!"
echo "🌐 Ваш сайт доступен по адресу: https://travel-app-service.ru"
echo ""
echo "Полезные команды:"
echo "  Статус nginx: sudo systemctl status nginx"
echo "  Логи nginx: sudo journalctl -u nginx -f"
echo "  Перезапуск nginx: sudo systemctl restart nginx"
echo "  Обновление сертификатов: sudo certbot renew"
