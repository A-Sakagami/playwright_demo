import { test , devices, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import { spawnSync, spawn, execSync } from "child_process";

let client: Browser;

/**
 * 端末設定
 */
test.beforeAll(async () => {
    const options = {
        path: '/',
        port: 4723,
        capabilities: {
            platformName: "iOS",
            "appium:platformVersion": "16.0", // iOS version
            "appium:deviceName": "iPhone 14 Pro Max", // xcrun simctl list devicesでBootedの端末を設定
            "appium:automationName": "XCUITest", // webdriver
            "appium:bundleId": "com.apple.Preferences", // テスト対象アプリのバンドルID
            "appium:noReset": true,
            "appium:wdaLocalPort": 8100, // localhost
            "appium:wdaBaseUrl": "http://192.168.10.134" // WebDriverAgentが接続したURL
        }
    };
    client = await remote(options);
});

/**
 * セッションを閉じる
 */
test.afterAll(async () => {
    //await client.deleteSession();
});

test.describe('IOS エミュレーター接続テスト', async () => {
    test('test', async () => {
        // 設定アプリを起動
        await client.activateApp("com.apple.Preferences");
        // 設定アプリが開かれたことを確認
        const wifiCell = await client.$("~一般");
        await expect(await wifiCell.isDisplayed).toBeTruthy();
        // 一般メニューをタップ
        await wifiCell.click();
        await client.pause(3000);
        // Wi-Fiメニューが開かれたことを確認
        const wifiMenu = await client.$("~情報");
        await expect(await wifiMenu.isDisplayed).toBeTruthy();

    });
})

