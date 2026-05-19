@echo off
REM HamroSewa Development Setup & Run Scripts for Windows

setlocal enabledelayedexpansion

REM Colors (using ANSI codes)
set "GREEN=[32m"
set "RED=[31m"
set "YELLOW=[33m"
set "NC=[0m"

REM Header
echo.
echo %GREEN%╔════════════════════════════════════════╗%NC%
echo %GREEN%║     🚀 HamroSewa Marketplace Setup    ║%NC%
echo %GREEN%╚════════════════════════════════════════╝%NC%
echo.

REM Check Node.js
echo %YELLOW%→ Checking prerequisites...%NC%
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%✗ Node.js is not installed%NC%
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set "NODE_VERSION=%%i"
echo %GREEN%✓ Node.js %NODE_VERSION% found%NC%

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%✗ npm is not installed%NC%
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set "NPM_VERSION=%%i"
echo %GREEN%✓ npm %NPM_VERSION% found%NC%

REM Install backend dependencies
echo.
echo %YELLOW%→ Installing backend dependencies...%NC%
cd backend
call npm install
if errorlevel 1 (
    echo %RED%✗ Failed to install backend dependencies%NC%
    exit /b 1
)
echo %GREEN%✓ Backend dependencies installed%NC%
cd ..

REM Install frontend dependencies
echo.
echo %YELLOW%→ Installing frontend dependencies...%NC%
cd frontend
call npm install
if errorlevel 1 (
    echo %RED%✗ Failed to install frontend dependencies%NC%
    exit /b 1
)
echo %GREEN%✓ Frontend dependencies installed%NC%
cd ..

REM Database setup
echo.
echo %YELLOW%→ Setting up database...%NC%
echo %GREEN%✓ PostgreSQL setup instructions will be shown%NC%

REM Prisma migrations
echo.
echo %YELLOW%→ Running database migrations...%NC%
cd backend
call npx prisma migrate dev
if errorlevel 1 (
    echo %RED%✗ Failed to run migrations%NC%
    echo Check your DATABASE_URL in .env file
    exit /b 1
)
echo %GREEN%✓ Database migrations completed%NC%
cd ..

echo.
echo %GREEN%╔════════════════════════════════════════╗%NC%
echo %GREEN%║   Setup completed successfully!       ║%NC%
echo %GREEN%╚════════════════════════════════════════╝%NC%
echo.
echo Next steps:
echo 1. Update .env files with your configuration
echo 2. Command Prompt 1: cd backend ^&^& npm run dev
echo 3. Command Prompt 2: cd frontend ^&^& npm run dev
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.

pause
