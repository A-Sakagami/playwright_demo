import { test as base, _android, devices } from '@playwright/test';

import { remote, Browser } from 'webdriverio';
import { spawnSync, spawn, execSync } from "child_process";
import dotenv from "dotenv";

type TestOptions = {
    device: any;
    deviceName: string;
    client: Browser;
};

// Playwright の `test` を拡張
const test = base.extend<TestOptions>({
    device: async ({}, use) => {
        console.log("Setting up Android device...");
        const devices = await _android.devices();
        if (devices.length === 0) {
            throw new Error("No Android devices found");
        }
        await use(devices[0]); // `test` で使えるように渡す
    },
    deviceName: async ({ device }, use) => {
        await use(device.model());
    },
    client: async ({ device }, use) => {
        console.log("Setting up Appium client...");
        const options = {
            host: 'localhost',
            port: 4723,
            capabilities: {
                platformName: 'IOS',
                "appium:deviceName": device.serial(),
                "appium:automationName": 'UiAutomator2',
                "appium:appPackage": 'jp.co.benesse.manabi',
                "appium:appActivity": 'jp.co.benesse.manabi.MainActivity',
                "appium:noReset": true
            }
        };
        const client = await remote(options);
        await use(client); // `test` で使えるように渡す
        await client.deleteSession(); // 終了処理
    }
});

test.describe('チュートリアル', async () => {
    test('Mobile test', async ({ device, deviceName, client }) => {
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
            await client.$("id=jp.co.benesse.manabi:id/tv_close").click();
            await client.pause(1000);

            // 最初のお知らせがある場合、閉じる
            const closeIcon = await client.$("android=new UiSelector().resourceId(\"jp.co.benesse.manabi:id/tv_close\")");
            if (await closeIcon.isExisting()) {
                await closeIcon.click();
            }
        } else {
            console.log("チュートリアルは表示されなかったので、通常のテストを開始");
        }
    });
});
