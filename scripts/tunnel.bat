@echo off
REM SSH Tunnel Script for PostgreSQL Database (Windows)
REM Maps localhost:5432 to remote server's localhost:5432
REM Usage: scripts\tunnel.bat

echo 🚀 Starting SSH tunnel to remote PostgreSQL database...

REM Load environment variables from .env if it exists
if exist ".env" (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        if not "%%a"=="" if not "%%a:~0,1%"=="#" (
            set "%%a=%%b"
        )
    )
)

REM Set defaults based on env.example structure
if "%SSH_HOST%"=="" set "SSH_HOST=192.168.0.1"
if "%SSH_USER%"=="" set "SSH_USER=ssh_user"
if "%SSH_PORT%"=="" set "SSH_PORT=22"
if "%SSH_DB_HOST%"=="" set "SSH_DB_HOST=localhost"
if "%SSH_DB_PORT%"=="" set "SSH_DB_PORT=5432"
if "%DB_USER%"=="" set "DB_USER=db_user"
if "%DB_PASSWORD%"=="" set "DB_PASSWORD=db_password"
if "%DB_NAME%"=="" set "DB_NAME=db_name"
set "LOCAL_PORT=5432"

echo 📋 Tunnel Configuration:
echo    Local Port: %LOCAL_PORT%
echo    Remote Host: %SSH_DB_HOST%:%SSH_DB_PORT%
echo    SSH Connection: %SSH_USER%@%SSH_HOST%:%SSH_PORT%
echo.
echo 🔗 SSH Command:
echo    ssh -L %LOCAL_PORT%:%SSH_DB_HOST%:%SSH_DB_PORT% -p %SSH_PORT% %SSH_USER%@%SSH_HOST% -N
echo.
echo ⏳ Starting tunnel... (Press Ctrl+C to stop)
echo 💡 You can now connect to localhost:%LOCAL_PORT% to access your remote database
echo 📊 DATABASE_URL will be: postgresql://%DB_USER%:%DB_PASSWORD%@localhost:%LOCAL_PORT%/%DB_NAME%
echo.

REM Start SSH tunnel
ssh %SSH_USER%@%SSH_HOST% -L %LOCAL_PORT%:%SSH_DB_HOST%:%SSH_DB_PORT%

echo ✅ SSH tunnel stopped
pause 