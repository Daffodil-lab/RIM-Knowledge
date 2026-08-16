@echo off
setlocal
title RIM Dev Harness

set "RIM_HARNESS_LAUNCHER=%~dp0Tools\RimDevHarness\Start-RimDevHarness.ps1"

if not exist "%RIM_HARNESS_LAUNCHER%" (
  echo RIM Dev Harness launcher was not found.
  echo Expected: %RIM_HARNESS_LAUNCHER%
  pause
  exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%RIM_HARNESS_LAUNCHER%" -OpenBrowser
if errorlevel 1 (
  echo.
  echo RIM Dev Harness could not be started.
  pause
  exit /b 1
)

exit /b 0
