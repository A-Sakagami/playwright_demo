#!/bin/bash

# AVD名を指定
$AVD_NAME="Pixel_7_API_33"

# エミュレータの実行ファイルのパスを明示的に指定（ユーザー名を正しく設定）
$EMULATOR_PATH = "C:\Users\GENZ-\AppData\Local\Android\Sdk\emulator\emulator.exe"

# パスが正しいか確認
if (-not (Test-Path $EMULATOR_PATH)) {
    Write-Error "エミュレータが見つかりません。パスを確認してください: $EMULATOR_PATH"
    exit 1
}

# AVDの起動
Write-Output "Starting AVD: $AVD_NAME using $EMULATOR_PATH"
# エミュレータのプロセスを非同期で起動
$process = Start-Process -FilePath $EMULATOR_PATH -ArgumentList "-avd $AVD_NAME -no-snapshot-load -gpu swiftshader_indirect -verbose" -PassThru -NoNewWindow

# プロセスが終了するまで待機
Write-Output "Waiting for AVD to be fully started..."
Wait-Process -Id $process.Id

Write-Output "AVD started successfully!"