import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import dotenv from 'dotenv';
import { createRandomName, createRandomPassword } from '../create-name';

dotenv.config();

test('メール登録デモ', async ({ page }) => {
  await page.goto('https://script.google.com/a/genz.jp/macros/s/AKfycbzQPOQbQ7LdAWIGw5PLwZhEjfUDc-9-MbF0dhIt45C8F-lVjFmFV-KrYKs5ohinS1hW4A/exec?page=index')
  , { waitUntil: 'documentloaded'};

  // ログイン要求された場合の処理を追加

  // Google App Scriptのiframe内の要素を選択する
  // sandboxFrame 内の userHtmlFrame を直接指定して要素を操作
  const userHtmlFrame = page
    .frameLocator('#sandboxFrame')
    .frameLocator('#userHtmlFrame');

  // 「新規登録」リンクをクリック
  await userHtmlFrame.getByRole('link', { name: '新規登録' }).click({delay: 500});

  // メールアドレスを入力
  let email:string = 'sakagami@genz.jp';
  let password:string = '';

  for (const char of email) {
    await userHtmlFrame.getByPlaceholder('メールアドレスを入力してください').press(char);
    await page.waitForTimeout(100); // 各文字の入力間に 100ms のディレイ
  }

  const accounts = await readAccounts(path.join(__dirname, '../accounts.csv'));
  // 特定のアカウントを検索
  const account = findAccount(email, accounts);

  if (account) {
    console.log(`メールアドレス: ${account.email}, パスワード: ${account.password}`);
    email = account.email;
    password = account.password;
  } else {
    console.log(`指定されたメールアドレス ${email} は存在しません。`);
    process.exit(1);
  }

  // 「送信」ボタンをクリック
  await userHtmlFrame.getByRole('button', { name: '送信' }).click({delay: 1000});
  await expect(userHtmlFrame.getByRole('heading')).toHaveText('メールを確認してください');

  // GMail画面に遷移する
  await loginGmail(page, email, password);

  // 新着メールを絞り込む
  // 非同期関数を呼び出す際に、awaitを使って結果を待つか、thenを使って処理を続行する必要がある
  const emailUrl = await fetchLatestEmailURL();
  // console.log(url);
  // リンク先の操作
  await page.goto(emailUrl);
  await expect(userHtmlFrame.getByRole('heading')).toHaveText('詳細情報の入力');

  await userHtmlFrame.getByPlaceholder('氏名を入力してください').fill(createRandomName());
  await userHtmlFrame.getByPlaceholder('パスワードを入力してください').fill(createRandomPassword());
  await page.waitForTimeout(1000);
  await userHtmlFrame.getByRole('button', { name: '登録（ダミー）' }).click({delay:500});
  await userHtmlFrame.getByRole('link', { name: 'トップページに戻る' }).click();
});

// CSVファイルからアカウントとパスワードを読み込む関数
async function readAccounts(filePath: string): Promise<{ email: string, password: string }[]> {
  return new Promise((resolve, reject) => {
    const accounts: { email: string, password: string }[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser()) // 関数としてcsv-parserを使用
      .on('data', (data) => {
        const email = data.email;
        const password = data.password;
        accounts.push({ email, password });
      })
      .on('end', () => resolve(accounts))
      .on('error', (err) => reject(err));
  });
}

// 特定のメールアドレスに対応するアカウントを取得する関数
function findAccount(email: string, accounts: { email: string, password: string }[]): { email: string, password: string } | null {
  return accounts.find(account => account.email === email) || null;
}

// Gmail にログインする関数
async function loginGmail(page: Page, email: string, password: string) {
  await page.goto('https://mail.google.com/');
  await page.fill('input[type="email"]', email);
  await page.click('#identifierNext');
  await page.waitForTimeout(2000); // 適切な待機時間を設定
  await page.fill('input[type="password"]', password);
  await page.click('#passwordNext');
  await page.waitForTimeout(5000); // ログインが完了するまで待機
}

// GASを用いて、メール本文のURLを抽出する
async function fetchLatestEmailURL() {
  const webAppUrl = 'https://script.google.com/macros/s/AKfycbyI5D2o_z5bStRcVLyKT-E2B3QUXULgDUMElCqG-crlmafAISZSkoEEGN5AvC-YW9fH/exec'; // Web APIのURL（GASの公開URL）
  let returnURL = '';
  await fetch(webAppUrl)
  .then(response => response.text())
  .then(data => {
    console.log("取得したデータ:", data);
    returnURL = data;
  })
  .catch(error => {
    console.error("エラー:", error);
  });
  // console.log(returnURL);
  return returnURL;
}