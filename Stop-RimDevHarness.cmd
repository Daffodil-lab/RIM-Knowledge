@echo off
setlocal
title Stop RIM Dev Harness

set "RIM_HARNESS_LAUNCHER=%~dp0Tools\RimDevHarness\Start-RimDevHarness.ps1"

if not exist "%RIM_HARNESS_LAUNCHER%" (
  echo RIM Dev Harness launcher was not found.
  pause
  exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%RIM_HARNESS_LAUNCHER%" -Stop
if errorlevel 1 (
  echo.
  echo RIM Dev Harness could not be stopped safely.
  pause
  exit /b 1
)

timeout /t 2 /nobreak >nul
exit /b 0
