#!/bin/bash

set -e

echo "🚀 Starting deployment process..."

# Проверяем наличие .env.production
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production based on .env.example"
    exit 1
fi

# Проверяем Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Удаляем старые образы
echo "🧹 Cleaning up old images..."
docker image prune -f

# Собираем новый образ
echo "🔨 Building new Docker image..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запускаем приложение
echo "🚀 Starting application..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска
echo "⏳ Waiting for application to start..."
sleep 10

# Проверяем health
echo "🏥 Checking application health..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy and running!"
    echo "🌐 Access your app at: http://localhost:3000"
else
    echo "❌ Health check failed!"
    echo "📋 Checking logs..."
    docker-compose -f docker-compose.prod.yml logs app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
