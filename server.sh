#!/bin/bash
# CNCDril Web Server - запуск и остановка

PORT=8000
PID_FILE="/tmp/cncdril_server.pid"

case "$1" in
    start)
        # Убить старый сервер если есть
        if [ -f "$PID_FILE" ]; then
            kill $(cat "$PID_FILE") 2>/dev/null
            rm -f "$PID_FILE"
        fi
        lsof -ti :$PORT | xargs kill -9 2>/dev/null
        sleep 1

        # Запустить новый
        cd "$(dirname "$0")/web"
        python3 -m http.server $PORT --bind 127.0.0.1 &
        echo $! > "$PID_FILE"
        echo ""
        echo "✅ CNCDril Web Server запущен"
        echo "   http://127.0.0.1:$PORT"
        echo ""
        echo "   Остановить:  $0 stop"
        echo "   Если не видите изменений: Ctrl+Shift+R в браузере"
        echo ""
        ;;
    stop)
        if [ -f "$PID_FILE" ]; then
            kill $(cat "$PID_FILE") 2>/dev/null
            rm -f "$PID_FILE"
            echo "✅ Сервер остановлен"
        else
            lsof -ti :$PORT | xargs kill -9 2>/dev/null
            echo "✅ Сервер остановлен (по порту)"
        fi
        ;;
    *)
        echo "CNCDril Web Server"
        echo ""
        echo "  $0 start   - запустить сервер"
        echo "  $0 stop    - остановить сервер"
        echo ""
        echo "После запуска откройте:"
        echo "  http://127.0.0.1:8000"
        echo ""
        echo "Если интерфейс не обновился:"
        echo "  Ctrl+Shift+R (жёсткая перезагрузка)"
        ;;
esac