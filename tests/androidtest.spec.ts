import { test, _android } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import dotenv from "dotenv";

// グローバル変数
let device: any; // Androidデバイス
let deviceName: string; // デバイス名
let client: Browser; // Appiumクライアント

// デバイスのストレージを削除する
async function deleteCache(client: Browser) {
    await client.pressKeyCode(3);
    await client.$("~マナビジョン").touchAction([
        { action: 'press'},
        { action: "wait", ms: 2000 },
        { action: 'release'}
    ]);
    await client.$("id=jp.co.sharp.android.launcher3:id/bubble_text").click();
    await client.$("android=new UiSelector().className(\"android.widget.LinearLayout\").instance(9)").click();
    const delete_strage_button = await client.$("com.android.settings:id/button1");
    if (await delete_strage_button.isDisplayed() && await delete_strage_button.isEnabled()) {
        await delete_strage_button.click();
        await client.pause(1000);
        await client.$("id=android:id/button1").click();
    } else {
        console.log("ストレージ削除ボタンが表示されませんでした。");
    }
}

test.beforeAll(async () => {
    dotenv.config();
    // シェルスクリプトでエミュレーターを起動 || 実機を接続してから実施する。
    // powershell -ExecutionPolicy Bypass -File "C:\Users\GENZ-\playwright_demo\scripts\start_avd_new.ps1" 
    // または、バッチ(.bat)を起動する
    console.log("Launching Playwright test...");
    // デバイスに接続する
    [device] = await _android.devices();
    // デバイスのモデル名をログ出力する
    console.log(`Model: ${device.model()}`);
    // デバイスのシリアル番号をログ出力する
    console.log(`Serial: ${device.serial()}`);
    // デバイス全体のスクリーンショットを撮る
    deviceName = device.model();

    // アプリを起動する
    // Appiumでネイティブアプリ操作
    const options = {
        host: 'localhost',
        path: '/',
        port: 4723,
        capabilities: {
            platformName: 'Android',
            // エミュレーターのシリアル番号
            "appium:deviceName": 'emulator-5554', 
            // 実機のデバイス名
            //"appium:deviceName": process.env._ANDROID,
            // 開発しているアプリのパス
            //"appium:app": 'C:\\Users\\GENZ-\\WorkflowToolApp\\flutter_application\\build\\app\\outputs\\flutter-apk\\app-release.apk',
            "appium:automationName": 'UiAutomator2',
        }
    };
    // Appiumでアプリを操作する
    client = await remote(options);
    console.log("Appium session started");
});

test.afterAll(async () => {
    // テスト終了時にデバイスを切断する
    await client.deleteSession();
    console.log("Appium session ended");
});


test.describe.serial('リグレッションテスト', async() => {
    test('チュートリアル', async () => {
        // アプリのストレージを削除する
        // 長タップからアプリ情報を開いて直接ストレージを削除するプロセスならいけるかもしれない
        //deleteCache(client);

        // homeをタップ
        await client.pressKeyCode(3);
        await device.screenshot({ path: `screenshots/device_${deviceName}.png` });
        await client.pause(1000);
        
        // マナビジョン起動
        const appIcon = await client.$("~マナビジョン");
        await appIcon.click();
        await client.pause(1000);
        await device.screenshot({ path: `screenshots/manavision_${deviceName}.png` });
        await client.pause(1000);
        
        if(await client.$("id=jp.co.benesse.manabi:id/text_right").isDisplayed()) {
            // チュートリアル
            await client.$("id=jp.co.benesse.manabi:id/text_right").click();
            await device.screenshot({ path: `screenshots/manavision_tutorial1${deviceName}.png` });
            await client.$("id=android:id/button1").click();
            await client.pause(1000);
            await client.$("id=jp.co.benesse.manabi:id/text_right").click();
            await device.screenshot({ path: `screenshots/manavision_tutorial2${deviceName}.png` });

            // 最初のお知らせがある場合、閉じる
            const closeIcon = await client.$("id=jp.co.benesse.manabi:id/tv_close");
            if (await closeIcon.isExisting()) {
                await closeIcon.click();
            }
        } else {
            console.log("チュートリアルが表示されませんでした。");
        }
    });

    test('ハンバーガメニュー_お知らせ', async () => {
        // homeをタップ
        await client.pressKeyCode(3);
        await client.pause(1000);
        const appIcon = await client.$("~マナビジョン");
        await appIcon.click();

    });

});