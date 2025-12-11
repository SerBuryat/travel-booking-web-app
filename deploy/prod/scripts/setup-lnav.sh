#!/bin/bash
# setup-dlogs.sh - Полная установка dlogs на сервере
set -e

echo "🚀 Установка dlogs на сервере..."
echo "================================"

# 1. Проверяем пользователя
USER_NAME=$(whoami)
echo "👤 Текущий пользователь: $USER_NAME"

# 2. Устанавливаем lnav если нет
if ! command -v lnav &> /dev/null; then
    echo "📦 Устанавливаю lnav..."
    sudo apt update
    sudo apt install -y lnav
    echo "✅ lnav установлен"
else
    echo "✅ lnav уже установлен"
fi

# 3. Создаем директорию ~/bin если нет
BIN_DIR="$HOME/bin"
if [ ! -d "$BIN_DIR" ]; then
    echo "📁 Создаю директорию $BIN_DIR..."
    mkdir -p "$BIN_DIR"
    echo "✅ Директория создана"
else
    echo "✅ Директория $BIN_DIR уже существует"
fi

# 4. Добавляем ~/bin в PATH если еще нет
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo "🔗 Добавляю $BIN_DIR в PATH..."

    # Добавляем в .bashrc
    echo '' >> ~/.bashrc
    echo '# Добавление ~/bin в PATH для dlogs' >> ~/.bashrc
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc

    # Применяем для текущей сессии
    export PATH="$BIN_DIR:$PATH"

    echo "✅ PATH обновлен"
else
    echo "✅ $BIN_DIR уже в PATH"
fi

# 5. Создаем основной скрипт dlogs
echo "📝 Создаю скрипт dlogs..."
cat > "$BIN_DIR/dlogs" << 'EOF'
#!/bin/bash
# dlogs - Production Docker Logs Viewer (исправленная фильтрация)
set -e

echo "🚀 Production Log Viewer"
echo "========================"

# ТВОЙ ПУТЬ на production
PROJECT_DIR="/home/admin/travel-app/deploy"
COMPOSE_FILE="$PROJECT_DIR/docker-compose-prod.yml"

# Проверяем существование файла
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Файл не найден: $COMPOSE_FILE"
    exit 1
fi

echo "✅ Проект: $PROJECT_DIR"
echo "✅ Файл: docker-compose-prod.yml"
echo ""

# Переходим в директорию проекта
cd "$PROJECT_DIR"

# Обработка аргументов
SERVICE=""
MODE="clean"  # clean, attack, raw, stats
LOG_LINES=500

case "$1" in
    attack|-a|--attack)
        MODE="attack"
        ;;
    raw|-r|--raw)
        MODE="raw"
        ;;
    stats|-s|--stats)
        MODE="stats"
        ;;
    help|-h|--help)
        echo "📖 Справка:"
        echo "  dlogs           - Чистые логи"
        echo "  dlogs attack    - Показать атаки"
        echo "  dlogs raw       - Сырые логи"
        echo "  dlogs stats     - Статистика"
        echo "  dlogs app       - Логи приложения"
        exit 0
        ;;
    app|nginx|*)
        SERVICE="$1"
        ;;
esac

# Режим статистики
if [ "$MODE" = "stats" ]; then
    ATTACKS=$(docker-compose -f "$COMPOSE_FILE" logs --tail=1000 | grep -c "Failed to find Server Action")
    echo "📊 Статистика атак:"
    echo "  Последние 1000 строк: $ATTACKS атак"
    exit 0
fi

# Режим показа атак
if [ "$MODE" = "attack" ]; then
    echo "🚨 ПОКАЗАТЬ АТАКИ:"
    docker-compose -f "$COMPOSE_FILE" logs --tail="$LOG_LINES" | \
        grep -B1 -A1 "Failed to find Server Action" | \
        lnav -c ":goto 100%"
    exit 0
fi

# Получаем логи
echo "📥 Получаю логи..."
if [ -n "$SERVICE" ]; then
    LOGS=$(docker-compose -f "$COMPOSE_FILE" logs --tail="$LOG_LINES" --no-color "$SERVICE")
else
    LOGS=$(docker-compose -f "$COMPOSE_FILE" logs --tail="$LOG_LINES" --no-color)
fi

# Считаем общее количество строк
TOTAL_LINES=$(echo "$LOGS" | wc -l)

# Для режима raw просто показываем
if [ "$MODE" = "raw" ]; then
    echo "📋 СЫРЫЕ ЛОГИ ($TOTAL_LINES строк):"
    echo "$LOGS" | lnav -c ":goto 100%"
    exit 0
fi

# ФИКС: Правильная фильтрация - используем временный файл
echo "🛡️  Фильтрую атаки..."
TEMP_RAW="/tmp/dlogs_raw_$$.log"
TEMP_CLEAN="/tmp/dlogs_clean_$$.log"

echo "$LOGS" > "$TEMP_RAW"

# Удаляем строки содержащие ключевые фразы
sed -i \
    -e '/Failed to find Server Action/d' \
    -e '/Read more: https:\/\/nextjs\.org\/docs\/messages\/failed-to-find-server-action/d' \
    -e '/at async.*\.next\/server\/app\/no-auth\/page\.js/d' \
    -e '/python-requests/d' \
    -e '/This request might be from/d' \
    "$TEMP_RAW"

# Переименовываем
mv "$TEMP_RAW" "$TEMP_CLEAN"

# Считаем статистику
CLEAN_LINES=$(wc -l < "$TEMP_CLEAN")
REMOVED=$((TOTAL_LINES - CLEAN_LINES))

echo "📊 Статистика:"
echo "  Всего строк: $TOTAL_LINES"
echo "  После фильтра: $CLEAN_LINES"
echo "  Удалено атак: $REMOVED"
echo ""

if [ "$CLEAN_LINES" -eq 0 ]; then
    echo "📭 Нет логов для отображения"
    rm -f "$TEMP_CLEAN"
    exit 0
fi

echo "🚀 Запускаю lnav..."
echo "=================="

# Открываем в lnav
lnav -c ":goto 100%" "$TEMP_CLEAN"

# Удаляем временный файл
rm -f "$TEMP_CLEAN"

echo ""
echo "✅ Готово"
EOF

# Делаем исполняемым
chmod +x "$BIN_DIR/dlogs"

# 6. Создаем тестовый скрипт проверки
echo "🧪 Создаю тестовый скрипт..."
cat > "$BIN_DIR/test-dlogs" << 'EOF'
#!/bin/bash
echo "🧪 Тестирование установки dlogs..."
echo ""

echo "1. Проверка наличия dlogs:"
if command -v dlogs &> /dev/null; then
    echo "   ✅ dlogs найден: $(which dlogs)"
else
    echo "   ❌ dlogs не найден"
fi

echo ""
echo "2. Проверка прав:"
ls -la $(which dlogs) 2>/dev/null || echo "   ❌ Файл не найден"

echo ""
echo "3. Проверка PATH:"
echo "   PATH: $PATH" | grep -q "$HOME/bin" && echo "   ✅ ~/bin в PATH" || echo "   ❌ ~/bin не в PATH"

echo ""
echo "4. Проверка lnav:"
if command -v lnav &> /dev/null; then
    echo "   ✅ lnav установлен"
else
    echo "   ❌ lnav не установлен"
fi

echo ""
echo "✅ Тест завершен. Используй команду 'dlogs'"
EOF

chmod +x "$BIN_DIR/test-dlogs"

# 7. Создаем алиас в .bashrc
echo "🔗 Настраиваю алиасы..."

# Удаляем старые настройки если есть
sed -i '/# Добавление.*dlogs/,/^$/d' ~/.bashrc
sed -i '/alias dlogs=/d' ~/.bashrc

# Добавляем новые
cat >> ~/.bashrc << 'EOF'

# ==============================================
# dlogs - Docker Logs Viewer
# ==============================================
# Основной алиас
alias dlogs='~/bin/dlogs'
# Быстрые команды
alias logsa='dlogs -a'      # показать атаки
alias logsr='dlogs -r'      # сырые логи
# Проверка установки
alias dlogs-test='test-dlogs'
EOF

# 8. Применяем изменения
echo "🔄 Применяю изменения..."
source ~/.bashrc

# 9. Итог
echo ""
echo "================================================"
echo "✅ УСТАНОВКА ЗАВЕРШЕНА!"
echo ""
echo "📋 Доступные команды:"
echo "   dlogs              - Основная команда"
echo "   dlogs app          - Логи приложения"
echo "   dlogs -a           - Показать атаки"
echo "   dlogs -r           - Сырые логи"
echo "   dlogs /путь        - Указать путь к проекту"
echo "   dlogs-test         - Проверить установку"
echo ""
echo "🔧 Что было сделано:"
echo "   1. Установлен lnav (если не был)"
echo "   2. Создана директория ~/bin"
echo "   3. Добавлен ~/bin в PATH"
echo "   4. Создан скрипт dlogs"
echo "   5. Добавлены алиасы в .bashrc"
echo ""
echo "🔄 Для применения изменений в новых терминалах:"
echo "   source ~/.bashrc"
echo "   или перезайди в терминал"
echo ""
echo "❓ Проверка:"
echo "   dlogs-test"
echo "================================================"