import fetch from 'node-fetch';
import cheerio from 'cheerio';
import querystring from 'querystring';

async function login() {
    let session;
    session = await fetch("https://drrrkari.com/#");
    const sessionText = await session.text();

    // ログイン
    const $ = cheerio.load(sessionText);
    const token = $('input[name="token"]').val();
    const cookie = session.headers.raw()['set-cookie'];
    const encoded_user_name = querystring.escape("Node辞典");
    const encoded_user_icon = querystring.escape("bm");
    const encoded_query = `profile=${encoded_user_name}:${encoded_user_icon}:ja-JP:ziten`;
    cookie[0] += `; ${encoded_query}`;
    console.log(cookie[0]);
    const info = {
        "language": "jp-JP",
        "icon": "bm",
        "name": "Node辞典",
        "login": "login",
        "token": token
    }
    const header = {
        'User-Agent': 'w3m',
        'cookie': cookie,
        'content-type': 'application/x-www-form-urlencoded'
    }
    const login = await fetch("https://drrrkari.com/#", {
        method: 'POST',
        body: new URLSearchParams(info).toString(),
        headers: header
    });

    // 入室
    const room = {
        "login": "login",
        "id": "3762bf77fb8249d3d9b69f6bcda036d4",
    }
    const roomResponse = await fetch("https://drrrkari.com/room/", {
        method: 'POST',
        body: new URLSearchParams(room).toString(),
        headers: header
    });

    // const chat = {
    //     message: "あ",
    //     valid: 1
    // }
    // await fetch("https://drrrkari.com/room/?ajax=1#", {
    //     method: 'POST',
    //     body: new URLSearchParams(chat).toString(),
    //     headers: header
    // });
}



login();
