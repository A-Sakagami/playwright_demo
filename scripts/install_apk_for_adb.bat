@echo off
REM 上のコマンドが完了するまで待つ
timeout /t 10

REM APKファイルのパスを指定（必要に応じて変更）
set APK_PATH=C:\Users\GENZ-\WorkflowToolApp\flutter_application\build\app\outputs\flutter-apk\app-release.apk

REM PowerShellスクリプトを管理者権限で実行
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install_apk_for_adb.ps1" -apkPath "%APK_PATH%"

endlocal
pause