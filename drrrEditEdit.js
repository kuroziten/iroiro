// ==UserScript==
// @name         新ツール
// @namespace    http://tampermonkey.net/
// @version      2025-06-27
// @description  try to take over the world!
// @author       You
// @match        https://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrrkari.com
// @grant        none
// ==/UserScript==

(async function() {

    // CSS更新
    const style = document.createElement("style");
    style.textContent = `
div#body {
margin-left: 0;
display: flex;
flex-flow: column;
height: 100vh;
width: unset;
}
div.message_box{
position: initial;
width: 100vw;
}
p.body {
/* 単語の途中でも折り返す */
word-break: break-all;
}
#talks_box{
width: 100vw;
display: flex;
flex-grow: 1;
overflow: hidden;
}
dl {
display: flex;
}
dd {
flex-grow: 1;     /* 残りの幅を全部使う */
flex-shrink: 1;   /* 縮小可能 */
flex-basis: 0;    /* 初期幅を0にして残り幅を優先 */
}
#talks {
width: 50vw;
margin-top: 0;
height: 100%;
overflow: scroll;
}
#newMenu {
flex-grow: 1; /* 残りの高さを全部使う */
background-color: red;
overflow: scroll;
}

[encip] [no] {
display: flex;
background-color: pink;
}

[encip] [no] {
border-top: 1px solid black;
}


[encip] [no] *:nth-of-type(1) {
padding-left: 5px;
padding-right: 5px;
border-right: 1px solid black;
box-sizing: border-box;
}
[encip] [no] *:nth-of-type(2) {
padding-left: 5px;
width: 80px;
padding-right: 5px;
border-right: 1px solid black;
box-sizing: border-box;
}

[encip] [no] *:nth-of-type(3) {
padding-left: 5px;
}
    `;
    document.body.append(style);

    // 追加要素作成
    const newMenu = await new Promise(r => {
        const menu = document.createElement("div");
        menu.id = "newMenu";
        talks_box.append(menu);
        r(menu);
    });

    // DBの定義情報
    const dbName = "20250627";
    const ENCIPT = "ENCIPT";
    const USERT = "USERT";
    const IMGT = "IMGT";

    // DB削除
    // indexedDB.deleteDatabase(dbName);

    // DB展開
    const request = indexedDB.open(dbName, 1);

    // DB初期設定
    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        // ENCIPテーブルのストア作成
        const ENCIPTS = db.createObjectStore(ENCIPT, { keyPath: "ENCIP" });
        ENCIPTS.createIndex("ENCIPI", "UPDT_DATE", { unique: false });

        // USERテーブルのストア作成
        const USERTS = db.createObjectStore(USERT, {keyPath: "NO", autoIncrement: true});
        USERTS.createIndex("USERI1", ["ENCIP", "UPDT_DATE"], { unique: false });
        USERTS.createIndex("USERI2", ["ENCIP", "NAME"], { unique: true });

        // IMGテーブルのストア作成
        const IMGTS = db.createObjectStore(IMGT, { keyPath: "ID"});
        IMGTS.createIndex("IMGI", "INST_DATE", { unique: false });
    };

    // DB取得
    const db = await new Promise(r => request.onsuccess = e => r(e.target.result));

    const act = async () => {

        // デュラチャ情報取得
        const res = await(await fetch("/ajax.php", {method: "POST"})).json();

        const now = new Date();

        // ENCIPT更新
        await new Promise(async r => {

            const transaction = db.transaction(ENCIPT, "readwrite");
            const store = transaction.objectStore(ENCIPT);

            for (const user of Object.values(res.users)) {
                const encip = user.encip.substring(0, 5);
                store.put({
                    ENCIP: encip,
                    UPDT_DATE: now
                });
            }

            transaction.oncomplete = () => r();
        });

        // USERT更新
        await new Promise(async r => {

            const transaction = db.transaction(USERT, "readwrite");
            const store = transaction.objectStore(USERT);

            const users = [];
            for (const user of Object.values(res.users)) {
                users.push({
                    encip: user.encip.substring(0, 5),
                    name: user.name
                });
            }
            for (const talk of Object.values(res.talks)) {
                if (talk.type === "enter") {
                    const encip = talk.encip.substring(0, 5);
                    const name = talk.name;
                    if (!users.some(e => e.encip === encip && e.name === name)) {
                        users.push({
                            encip: talk.encip.substring(0, 5),
                            name: talk.name
                        });
                    }
                }
            }

            for (const user of users) {

                const encip = user.encip.substring(0, 5);
                const name = user.name;

                const index = store.index("USERI2");

                const result = await new Promise(r => index.get([encip, name]).onsuccess = event => r(event.target.result));

                if (result) {
                    result.UPDT_DATE = now;
                    await new Promise(r => store.put(result).onsuccess = () => r());
                } else {
                    await new Promise(r => {
                        store.add({
                            "ENCIP": encip,
                            "NAME": name,
                            "UPDT_DATE": now,
                            "INST_DATE": now,
                        }).onsuccess = () => r()
                    });
                }
            }

            transaction.oncomplete = () => r();
        });

        // IMGT更新
        await new Promise(async r => {
            for (const talk of Object.values(res.talks)) {
                const image = talk.image;
                if (image) {
                    const transaction = db.transaction(IMGT, "readonly");
                    const store = transaction.objectStore(IMGT);
                    const id = talk.id;
                    const result = await new Promise(r => store.get(id).onsuccess = event => r(event.target.result));
                    if (!result) {
                        const blob = await(await fetch("https://drrrkari.com/" + talk.image)).blob();
                        const transaction = db.transaction(IMGT, "readwrite");
                        const store = transaction.objectStore(IMGT);
                        await new Promise(r => {
                            store.add({
                                ID: id,
                                BLOB: blob,
                                INST_DATE: new Date()
                            }).onsuccess = () => r();
                        });
                    }
                }
            }
            r();
        });

        // 0: ユーザ, 1: 画像
        let mode = 0;
        // 画面更新テスト
        await new Promise(r => {
            if (mode  === 0) {
                const transaction = db.transaction(ENCIPT, "readonly");
                const store = transaction.objectStore(ENCIPT);
                const index = store.index("ENCIPI");

                const twelveHoursAgo = new Date();
                twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

                // 範囲指定
                const range = IDBKeyRange.bound(twelveHoursAgo, new Date());

                // 取得
                const request = index.openCursor(range, "prev");

                request.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        const encip = event.target.result.value.ENCIP;
                        let encipE = newMenu.querySelector(`[encip="${encip}"]`);
                        if (!encipE) {
                            encipE = document.createElement("div");
                            encipE.setAttribute("encip", encip);
                        }
                        newMenu.prepend(encipE);

                        const transaction = db.transaction(USERT, "readonly");
                        const store = transaction.objectStore(USERT);

                        const index = store.index("USERI1");

                        const range = IDBKeyRange.bound(
                            [encip, new Date(0)],                   // 1970年1月1日
                            [encip, new Date(8640000000000000)]     // JSで扱える最大日付
                        );

                        const res = index.openCursor(range, 'prev');
                        res.onsuccess = event => {
                            const cursor = event.target.result;
                            if (cursor) {
                                const e = cursor.value;
                                let userE = encipE.querySelector(`[no="${e.NO}"]`)
                                if (!userE) {
                                    userE = document.createElement("div");
                                    userE.setAttribute("no", e.NO);
                                    const userEC0 = document.createElement("div");
                                    const userEC1 = document.createElement("div");
                                    const userEC2 = document.createElement("div");

                                    userEC1.textContent = e.ENCIP;
                                    userEC2.textContent = e.NAME;

                                    userE.append(userEC0);
                                    userE.append(userEC1);
                                    userE.append(userEC2);
                                }
                                userE.querySelector("*").textContent = formatDateWithWeekday(e.UPDT_DATE);
                                encipE.prepend(userE);
                                cursor.continue();
                            }
                        };
                        cursor.continue();
                    }
                };
                transaction.oncomplete = () => r();
            }
        });
    };
    await act();
    setInterval(async () => await act(), 3000);
})();

function formatDateWithWeekday(date = new Date()) {
    const pad = n => n.toString().padStart(2, '0');
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const w = weekdays[date.getDay()];
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    return `${y}-${m}-${d}(${w}) ${h}:${min}:${s}`;
}
