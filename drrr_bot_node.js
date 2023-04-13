import fetch from 'node-fetch';
import FormData from 'form-data';
import https from 'https';
import querystring from 'querystring';

/* 設定項目 */
// 部屋のID
const roomId = "32e0bce6fbc1298307f6ef0f30f6dfaf";
// 名前
const userName = "node";
// アイコン
const userIcon = "bm";
// トリップのパスワード
const tripPsw = "";

/* 処理で使うオブジェクト達 */
const header = { cookie: "", 'content-type': 'application/x-www-form-urlencoded' };
const room = { login: "login", id: roomId, };
const chat = { message: "", valid: 1 };

// 初期リクエスト
const session = await fetch("https://drrrkari.com/#");

// cookieの設定
const cookie = session.headers.raw()['set-cookie'];
const esc = n => querystring.escape(n);
const encoded_query = `profile=${esc(userName)}:${userIcon}:ja-JP:${tripPsw}`;
cookie[0] += `; ${encoded_query}`;
header.cookie = cookie;
console.log(cookie[0]);

// ログイン処理実行
await fetch("https://drrrkari.com/#", {
    method: 'POST',
    headers: header
});

// 入室処理実行
await fetch("https://drrrkari.com/room/", {
    method: 'POST',
    body: new URLSearchParams(room).toString(),
    headers: header
});

// メッセージの送信
chat.message = "Node.jsで実行しています";
await fetch("https://drrrkari.com/room/?ajax=1#", {
    method: 'POST',
    body: new URLSearchParams(chat).toString(),
    headers: header
});

/**
 * 画像送信関数
 * @param {*} url: 画像URL
 */
const imgPost = async url => {
    https.get(url, async img => {
        const form = new FormData();
        form.append('img_path', img);// ←appendする並び順がこの順番じゃないと上手くいかない
        form.append('upimg', 'アップロード');
        const res = await fetch('https://drrrkari.com/room/', {
            method: 'POST',
            headers: {
                ...form.getHeaders(),
                cookie: header.cookie,
            },
            body: form
        });
        if (await res.text() == "") {
            console.log("リトライ処理実行 :" + url);
            imgPost(url);
        }
    });
};

// 画像送信実行(メッセージの送信から時間をあけないとエラーになるため、setTimeoutを使って一秒後に実行)
const url = "https://drrrkari.com/upimg/2ba384b178e532609342b2496e81af79.jpeg";
setTimeout(() => {
    imgPost(url);
}, 1000);
