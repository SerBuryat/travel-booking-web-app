#!/bin/bash
set -e

# Функция для очистки при выходе
cleanup() {
    echo "Cleaning up SSH tunnel..."
    if [ ! -z "$SSH_PID" ]; then
        kill $SSH_PID 2>/dev/null || true
    fi
    exit 0
}

# Устанавливаем обработчик сигналов
trap cleanup SIGTERM SIGINT

# Проверяем наличие необходимых переменных окружения
if [ -z "$SSH_HOST" ] || [ -z "$SSH_USER" ]; then
    echo "Error: SSH_HOST and SSH_USER must be set"
    exit 1
fi

# Создаем SSH конфигурацию
mkdir -p /app/.ssh
chmod 700 /app/.ssh

# Если передан SSH_PRIVATE_KEY, создаем файл ключа
if [ ! -z "$SSH_PRIVATE_KEY" ]; then
    echo "$SSH_PRIVATE_KEY" > /app/.ssh/id_rsa
    chmod 600 /app/.ssh/id_rsa
    echo "SSH private key configured"
fi

# Если передан SSH_PASSWORD, используем expect скрипт
if [ ! -z "$SSH_PASSWORD" ]; then
    cat > /app/.ssh/ssh_expect.exp << 'EOF'
#!/usr/bin/expect -f
set timeout 30
spawn ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -L 5432:localhost:5432 $env(SSH_USER)@$env(SSH_HOST)
expect "password:"
send "$env(SSH_PASSWORD)\r"
expect eof
EOF
    chmod +x /app/.ssh/ssh_expect.exp
    
    echo "Setting up SSH tunnel with password to $SSH_HOST..."
    expect /app/.ssh/ssh_expect.exp &
    SSH_PID=$!
else
    # Используем SSH ключ
    echo "Setting up SSH tunnel with key to $SSH_HOST..."
    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -L 5432:localhost:5432 $SSH_USER@$SSH_HOST &
    SSH_PID=$!
fi

# Ждем установки соединения
echo "Waiting for SSH tunnel to establish..."
sleep 5

# Проверяем, что tunnel работает
if ! nc -z localhost 5432; then
    echo "Error: SSH tunnel failed to establish"
    exit 1
fi

echo "SSH tunnel established successfully on localhost:5432"

# Переключаемся на пользователя nextjs
exec su-exec nextjs:nodejs "$@"
