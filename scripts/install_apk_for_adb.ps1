#!/bin/bash
# install_apk_for_adb.ps1
param(
    [string]$apkPath
)

# Debug
Write-Host "Received Path: $apkPath"

# Start powershell with administrative privileges
Start-Process powershell -ArgumentList "Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force" -Verb RunAs -Wait

# Check if APK path is empty
if ([string]::IsNullOrEmpty($apkPath)) {
    Write-Host "Error: APK file path not specified."
    exit 1
}

Write-Host "ADB server is running..."
adb start-server

Write-Host "install APK...: $apkPath"
adb install "$apkPath"

Write-Host "Installation complete!"
