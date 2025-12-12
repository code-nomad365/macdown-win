@echo off
chcp 65001 >nul
title MacDown for Windows - Starting...

echo ========================================
echo   MacDown for Windows
echo   One-Click Startup Script
echo ========================================
echo.

echo [1/3] Checking environment...
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pnpm not found. Please install pnpm first.
    echo Run: npm install -g pnpm
    pause
    exit /b 1
)
echo [OK] pnpm installed

echo.
echo [2/4] Rebuilding native modules...
call pnpm --filter @macdown/main rebuild
if %errorlevel% neq 0 (
    echo [WARNING] Rebuild failed, but continuing...
)
echo [OK] Rebuild completed

echo.
echo [3/4] Building project...
call pnpm build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [OK] Build completed

echo.
echo [4/4] Starting application...
call pnpm start

pause
