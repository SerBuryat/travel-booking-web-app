#!/bin/bash

# Скрипт подготовки VPS для деплоя
# Устанавливает Docker, Docker Compose, настраивает авторизацию в Cloud.ru Registry

set -e  # Остановка при любой ошибке

echo "🚀 Начинаем подготовку VPS..."

# Проверяем, что мы в папке deploy
if [ ! -f ".env" ]; then
    echo "❌ Ошибка: файл .env не найден в текущей директории"
    echo "Убедитесь, что запускаете скрипт из папки /deploy"
    exit 1
fi

# Загружаем переменные окружения из .env, устойчиво к CRLF (Windows)
if [ -f ".env" ]; then
    tmp_env="$(mktemp)"
    # Удаляем символы \r, сохраняем файл во временное место
    tr -d '\r' < .env > "$tmp_env"
    # Экспортируем все переменные из .env
    set -a
    . "$tmp_env"
    set +a
    rm -f "$tmp_env"
else
    echo "❌ Ошибка: .env не найден"
    exit 1
fi

# Проверяем наличие обязательных переменных
if [ -z "$CLOUD_RU_KEY_ID" ] || [ -z "$CLOUD_RU_KEY_SECRET" ]; then
    echo "❌ Ошибка: переменные CLOUD_RU_KEY_ID и CLOUD_RU_KEY_SECRET должны быть заданы в .env"
    exit 1
fi

# Опционально: адрес реестра Cloud.ru
if [ -z "ARTIFACT_REGISTRY_URI" ]; then
    echo "⚠️  Предупреждение: ARTIFACT_REGISTRY_URI не задан. По умолчанию будет использован docker.io (это может быть неверно)"
    ARTIFACT_REGISTRY_URI="https://registry-1.docker.io/v2/"
fi

# Режим отладки: покажем, что именно подставляем (без утечек секрета)
if [ "${DEBUG:-0}" = "1" ]; then
    secret_len=$(printf %s "$CLOUD_RU_KEY_SECRET" | wc -c | tr -d ' ')
    secret_masked="$(printf %s "$CLOUD_RU_KEY_SECRET" | awk '{ if (length($0) > 8) printf substr($0,1,4)"***"substr($0,length($0)-3); else print "***" }')"
    echo "🔎 DEBUG: CLOUD_RU_KEY_ID=[$CLOUD_RU_KEY_ID]"
    echo "🔎 DEBUG: CLOUD_RU_KEY_SECRET_LEN=[$secret_len]"
    echo "🔎 DEBUG: CLOUD_RU_KEY_SECRET_MASKED=[$secret_masked]"
    echo "🔎 DEBUG: ARTIFACT_REGISTRY_URI=[$ARTIFACT_REGISTRY_URI]"
fi

echo "📦 Устанавливаем Docker..."

# Устанавливаем Docker, если не установлен
if ! command -v docker &> /dev/null; then
    echo "Docker не найден, устанавливаем..."
    
    # Обновляем пакеты
    sudo apt-get update
    
    # Устанавливаем зависимости
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Добавляем официальный GPG ключ Docker
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Настраиваем репозиторий
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Устанавливаем Docker
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Добавляем текущего пользователя в группу docker
    sudo usermod -aG docker $USER
    
    echo "✅ Docker установлен успешно"
    echo "⚠️  ВНИМАНИЕ: Для применения изменений группы перелогиньтесь или выполните 'newgrp docker'"
else
    echo "✅ Docker уже установлен"
fi

echo "📦 Устанавливаем Docker Compose..."

# Устанавливаем Docker Compose, если не установлен
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose не найден, устанавливаем..."
    
    # Скачиваем последнюю версию Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Делаем исполняемым
    sudo chmod +x /usr/local/bin/docker-compose
    
    echo "✅ Docker Compose установлен успешно"
else
    echo "✅ Docker Compose уже установлен"
fi

echo "🔐 Настраиваем авторизацию в Cloud.ru Registry..."

# Логинимся в Cloud.ru Artifact Registry
echo "Авторизуемся в Cloud.ru Registry..."
echo "$CLOUD_RU_KEY_SECRET" | docker login "$ARTIFACT_REGISTRY_URI" -u "$CLOUD_RU_KEY_ID" --password-stdin

if [ $? -eq 0 ]; then
    echo "✅ Успешная авторизация в Cloud.ru Registry"
else
    echo "❌ Ошибка авторизации в Cloud.ru Registry"
    exit 1
fi

echo "🎉 Подготовка VPS завершена успешно!"
echo ""
echo "Следующие шаги:"
echo "1. Убедитесь, что создан файл docker-compose-prod.yml в папке /deploy"
echo "2. Запустите ./run.sh для деплоя приложения"
