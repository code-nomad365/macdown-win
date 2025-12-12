@echo off
chcp 65001 >nul
title MacDown for Windows - 啟動中...

echo ========================================
echo   MacDown for Windows
echo   一鍵啟動腳本
echo ========================================
echo.

echo [1/3] 檢查環境...
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 找不到 pnpm，請先安裝 pnpm
    echo 執行: npm install -g pnpm
    pause
    exit /b 1
)
echo [✓] pnpm 已安裝

echo.
echo [2/3] 編譯專案...
call pnpm build
if %errorlevel% neq 0 (
    echo [錯誤] 編譯失敗
    pause
    exit /b 1
)
echo [✓] 編譯完成

echo.
echo [3/3] 啟動應用程式...
call pnpm start

pause
