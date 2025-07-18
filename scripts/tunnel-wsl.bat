@echo off
REM SSH Tunnel Script for PostgreSQL Database (Windows with WSL)
REM Maps localhost:5432 to remote server's localhost:5432
REM Usage: scripts\tunnel-wsl.bat

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
if "%SSH_PASSWORD%"=="" set "SSH_PASSWORD=ssh_password"
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
echo    Authentication: Password (sshpass via WSL)
echo.
echo 🔗 SSH Command:
echo    wsl sshpass -p '***' ssh -L %LOCAL_PORT%:%SSH_DB_HOST%:%SSH_DB_PORT% -p %SSH_PORT% %SSH_USER%@%SSH_HOST% -N
echo.
echo ⏳ Starting tunnel... (Press Ctrl+C to stop)
echo 💡 You can now connect to localhost:%LOCAL_PORT% to access your remote database
echo 📊 DATABASE_URL will be: postgresql://%DB_USER%:%DB_PASSWORD%@localhost:%LOCAL_PORT%/%DB_NAME%
echo.

REM Check if WSL is available
wsl --version >nul 2>&1
if errorlevel 1 (
    echo ❌ WSL is not installed or not available
    echo.
    echo 💡 To install WSL:
    echo    1. Open PowerShell as Administrator
    echo    2. Run: wsl --install
    echo    3. Restart your computer
    echo    4. Install sshpass: wsl sudo apt update && wsl sudo apt install sshpass
    echo.
    pause
    exit /b 1
)

REM Check if sshpass is available in WSL
wsl sshpass -V >nul 2>&1
if errorlevel 1 (
    echo ❌ sshpass is not installed in WSL
    echo.
    echo 💡 Installing sshpass in WSL...
    wsl sudo apt update
    wsl sudo apt install -y sshpass
    echo ✅ sshpass installed successfully
    echo.
)

REM Start SSH tunnel with password authentication via WSL
wsl sshpass -p "%SSH_PASSWORD%" ssh -o StrictHostKeyChecking=no -L %LOCAL_PORT%:%SSH_DB_HOST%:%SSH_DB_PORT% -p %SSH_PORT% %SSH_USER%@%SSH_HOST% -N

echo ✅ SSH tunnel stopped
pause 