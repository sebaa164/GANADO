@echo off
cd /d "%~dp0"
title GanadoVision - Frontend
cls
echo ========================================
echo   GanadoVision - Iniciando Frontend
echo ========================================
echo.
if not exist "node_modules" (
    echo  Instalando dependencias...
    call npm install
)
echo.
echo  Iniciando servidor Next.js...
start "Next.js" cmd /k "npm run dev"
echo.
echo  Esperando a que el servidor esté listo...
:waitloop
timeout /t 2 /nobreak >nul
netstat -an | find "0.0.0.0:3000" >nul 2>&1
if errorlevel 1 goto waitloop
echo.
echo  Servidor listo en http://localhost:3000
start "" http://localhost:3000
echo.
echo  Cerra la ventana "Next.js" para detenerlo.
echo.
pause
