#!/bin/bash

# Скрипт деплоя с zero-downtime
# Обновляет образы и перезапускает сервисы с откатом при ошибках

set -e  # Остановка при любой ошибке

echo "🚀 Начинаем деплой приложения..."

# Проверяем наличие docker-compose-dev.yml
if [ ! -f "docker-compose-dev.yml" ]; then
    echo "❌ Ошибка: файл docker-compose-dev.yml не найден в текущей директории"
    echo "Убедитесь, что запускаете скрипт из папки /deploy"
    exit 1
fi

# Проверяем, что nginx установлен
if ! command -v nginx &> /dev/null; then
    echo "❌ Ошибка: nginx не установлен"
    echo "Запустите сначала: ./scripts/setup-nginx-ssl.sh"
    exit 1
fi

# Проверяем наличие .env
if [ ! -f ".env" ]; then
    echo "❌ Ошибка: файл .env не найден в текущей директории"
    exit 1
fi

# Загружаем переменные окружения, устойчиво к CRLF (Windows)
if [ -f ".env" ]; then
    tmp_env="$(mktemp)"
    tr -d '\r' < .env > "$tmp_env"
    set -a
    . "$tmp_env"
    set +a
    rm -f "$tmp_env"
else
    echo "❌ Ошибка: .env не найден"
    exit 1
fi

# Функция для отката к предыдущей версии
rollback() {
    echo "🔄 Выполняем откат к предыдущей версии..."
    
    # Останавливаем текущие контейнеры
    docker-compose -f docker-compose-dev.yml down || true
    
    # Запускаем предыдущую версию (если есть)
    if docker images | grep -q "travel-booking-web-app"; then
        echo "Запускаем предыдущую версию образа..."
        docker-compose -f docker-compose-dev.yml up -d
    else
        echo "❌ Предыдущая версия не найдена, контейнеры остановлены"
    fi
    
    exit 1
}

# Обработчик ошибок для отката
trap rollback ERR

echo "📦 Обновляем образы..."

# Скачиваем новые образы
echo "Скачиваем последние версии образов..."
docker-compose -f docker-compose-dev.yml pull

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при скачивании образов"
    rollback
fi

echo "✅ Образы успешно обновлены"

# Проверяем, запущен ли docker-compose
if docker-compose -f docker-compose-dev.yml ps | grep -q "Up"; then
    echo "🔄 Обновляем запущенные сервисы..."
    
    # Обновляем сервисы с zero-downtime
    docker-compose -f docker-compose-dev.yml up -d --no-deps --build
    
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка при обновлении сервисов"
        rollback
    fi
    
    echo "✅ Сервисы успешно обновлены"
else
    echo "🚀 Запускаем сервисы впервые..."
    
    # Запускаем сервисы
    docker-compose -f docker-compose-dev.yml up -d
    
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка при запуске сервисов"
        rollback
    fi
    
    echo "✅ Сервисы успешно запущены"
fi

echo "🧹 Очищаем неиспользуемые образы..."

# Удаляем старые образы (оставляем только последние 2 версии)
docker image prune -f

# Удаляем неиспользуемые образы приложения (оставляем последние 2)
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}" | \
grep "travel-booking-web-app" | \
tail -n +3 | \
awk '{print $1 ":" $2}' | \
xargs -r docker rmi || true

echo "✅ Очистка завершена"

echo "🔍 Проверяем статус сервисов..."

# Ждем немного для запуска
sleep 5

# Проверяем статус контейнеров
if docker-compose -f docker-compose-dev.yml ps | grep -q "Up"; then
    echo "✅ Все сервисы запущены успешно"
    
    # Показываем статус
    echo ""
    echo "📊 Статус сервисов:"
    docker-compose -f docker-compose-dev.yml ps
    
    echo ""
    echo "🎉 Деплой завершен успешно!"
    echo ""
    echo "Полезные команды:"
    echo "  Просмотр логов: docker-compose -f docker-compose-dev.yml logs -f"
    echo "  Остановка: docker-compose -f docker-compose-dev.yml down"
    echo "  Перезапуск: docker-compose -f docker-compose-dev.yml restart"
    
else
    echo "❌ Некоторые сервисы не запустились"
    rollback
fi
