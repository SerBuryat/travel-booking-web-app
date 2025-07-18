#!/bin/bash

# SSH Tunnel Script for PostgreSQL Database
# Maps localhost:5432 to remote server's localhost:5432
# Usage: ./scripts/tunnel.sh

echo "🚀 Starting SSH tunnel to remote PostgreSQL database..."

# Load environment variables from .env if it exists
if [ -f ".env" ]; then
    source .env
fi

# Set defaults based on env.example structure
SSH_HOST=${SSH_HOST:-"192.168.0.1"}
SSH_USER=${SSH_USER:-"ssh_user"}
SSH_PORT=${SSH_PORT:-"22"}
SSH_PASSWORD=${SSH_PASSWORD:-"ssh_password"}
SSH_DB_HOST=${SSH_DB_HOST:-"localhost"}
SSH_DB_PORT=${SSH_DB_PORT:-"5432"}
DB_USER=${DB_USER:-"db_user"}
DB_PASSWORD=${DB_PASSWORD:-"db_password"}
DB_NAME=${DB_NAME:-"db_name"}
LOCAL_PORT="5432"  # Standard PostgreSQL port

echo "📋 Tunnel Configuration:"
echo "   Local Port: $LOCAL_PORT"
echo "   Remote Host: $SSH_DB_HOST:$SSH_DB_PORT"
echo "   SSH Connection: $SSH_USER@$SSH_HOST:$SSH_PORT"
echo "   Authentication: Password (sshpass)"
echo ""
echo "🔗 SSH Command:"
echo "   sshpass -p '***' ssh -L $LOCAL_PORT:$SSH_DB_HOST:$SSH_DB_PORT -p $SSH_PORT $SSH_USER@$SSH_HOST -N"
echo ""
echo "⏳ Starting tunnel... (Press Ctrl+C to stop)"
echo "💡 You can now connect to localhost:$LOCAL_PORT to access your remote database"
echo "📊 DATABASE_URL will be: postgresql://$DB_USER:$DB_PASSWORD@localhost:$LOCAL_PORT/$DB_NAME"
echo ""

# Check if sshpass is available
if ! command -v sshpass &> /dev/null; then
    echo "❌ sshpass is not installed. Please install it first:"
    echo "   Ubuntu/Debian: sudo apt install sshpass"
    echo "   macOS: brew install sshpass"
    echo "   Windows: Use WSL and run: sudo apt install sshpass"
    exit 1
fi

# Start SSH tunnel with password authentication
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -L $LOCAL_PORT:$SSH_DB_HOST:$SSH_DB_PORT -p $SSH_PORT $SSH_USER@$SSH_HOST -N

echo "✅ SSH tunnel stopped" 