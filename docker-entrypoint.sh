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
if [ -z "$SSH_HOST" ] || [ -z "$SSH_USER" ] || [ -z "$SSH_PASSWORD" ]; then
    echo "Error: SSH_HOST, SSH_USER, and SSH_PASSWORD must be set"
    exit 1
fi

# Создаем SSH конфигурацию
mkdir -p /app/.ssh
chmod 700 /app/.ssh

# Создаем expect скрипт для автоматического ввода пароля
cat > /app/.ssh/ssh_expect.exp << 'EOF'
#!/usr/bin/expect -f
set timeout 30
spawn ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -L 5432:localhost:5432 $env(SSH_USER)@$env(SSH_HOST)
expect "password:"
send "$env(SSH_PASSWORD)\r"
expect eof
EOF

chmod +x /app/.ssh/ssh_expect.exp

# Устанавливаем SSH tunnel в фоне
echo "Setting up SSH tunnel to $SSH_HOST..."
expect /app/.ssh/ssh_expect.exp &
SSH_PID=$!

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
