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
}

#inUser [encip]:nth-child(even) {
background-color: pink;
}

#inUser [encip]:nth-child(odd) {
background-color: cadetblue;
}

#outUser [encip] {
background-color: gray;
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
    await new Promise(r => {
        const newMenu = document.createElement("div");
        newMenu.id = "newMenu";
        talks_box.append(newMenu);

        const inUser = document.createElement("div");
        inUser.id = "inUser";
        const outUser = document.createElement("div");
        outUser.id = "outUser";
        newMenu.append(inUser);
        newMenu.append(outUser);
        r();
    });

    const newMenu = document.querySelector("#newMenu");
    const inUser = document.querySelector("#inUser");
    const outUser = document.querySelector("#outUser");

    // DBの定義情報
    const dbName = "20250627";
    const ENCIPT = "ENCIPT";
    const USERT = "USERT";
    const IMGT = "IMGT";

    // その他の固定値
    const maxRangBound = encip => IDBKeyRange.bound(
        [encip, new Date(0)],               // 1970年1月1日
        [encip, new Date(8640000000000000)] // JSで扱える最大日付
    );

    // DB削除
    // indexedDB.deleteDatabase(dbName);

    // DB展開
    const request = indexedDB.open(dbName, 1);

    // DB初期設定
    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        // ENCIPテーブルのストア作成
        // ENCIP | UPDT_DATE | COUNT
        // ENCIP | 更新日時  | ユーザ数
        const ENCIPTS = db.createObjectStore(ENCIPT, { keyPath: "ENCIP" });
        ENCIPTS.createIndex("ENCIPI", "UPDT_DATE", { unique: false });
        ENCIPTS.createIndex("ENCIPI_COUNT", "COUNT", { unique: false });

        // USERテーブルのストア作成
        const USERTS = db.createObjectStore(USERT, {keyPath: "NO", autoIncrement: true});
        USERTS.createIndex("USERI1", ["ENCIP", "UPDT_DATE"], { unique: false });
        USERTS.createIndex("USERI2", ["ENCIP", "NAME"], { unique: true });

        // IMGテーブルのストア作成
        // URL | HASH | BLOB |
        const IMGTS = db.createObjectStore(IMGT, { keyPath: "ID"});
        IMGTS.createIndex("IMGI", "INST_DATE", { unique: false });
    };

    // DB取得
    const db = await new Promise(r => request.onsuccess = e => r(e.target.result));

    // talkの最後のID（画像の処理は連続してする必要がないので）
    let lastTalkId = null;

    // ○○さんが退室しましたの最後のIDを取得
    let lastExitId = null;
    let res = -1;

    const act = async () => {

        // 入退室が無い場合はPOSTしないで使い回す
        for (const talk of document.querySelectorAll(".talk")) {
            if (talk.classList.contains("system") || talk.querySelector("a")) {
                if (lastExitId !== talk.id) {
                    lastExitId = talk.id;
                    res = await(await fetch("/ajax.php", {method: "POST"})).json();
                }
                break;
            }
        }

        // ENCIPとNAMEの組み合わせチェック
        const updatedTargetEncipUser = new Map();

        // 画像テーブル更新フラグ
        let imgtUpdtFlg = true;
        (talk => {
            if (talk.id !== lastTalkId) {
                // taklIdが最後に確認したものと異なる場合
                // lastTalkIdを更新する
                lastTalkId = talk.id;
            } else {
                // それ以外の場合
                // 画像テーブル更新フラグをfalseにする
                imgtUpdtFlg = false;
            }
        })(Object.values(res.talks).slice(-1)[0]);

        const now = new Date();

        // 入室中のencip
        const inEncip = new Set();

        const updtEncipList = new Set();

        // USERT更新
        await new Promise(async r => {

            // ストアを取得
            const transaction = db.transaction(USERT, "readwrite");
            const store = transaction.objectStore(USERT);

            // usersとtalksからユーザ情報を取得する
            const users = [];
            for (const user of Object.values(res.users)) {
                // usersをループして取得
                const encip = user.encip.substring(0, 5);
                users.push({
                    encip: encip,
                    name: user.name
                });
            };

            for (const user of users) {

                const encip = user.encip.substring(0, 5);
                const name = user.name;

                if (!updatedTargetEncipUser.get(encip)) {
                    updatedTargetEncipUser.set(encip, new Set());
                    updatedTargetEncipUser.get(encip).add(name);
                    inEncip.add(encip);
                    updtEncipList.add(encip);
                } else if (!updatedTargetEncipUser.get(encip).has(name)) {
                    updatedTargetEncipUser.get(encip).add(name);
                }

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
                        }).onsuccess = () => r();
                    });
                }
            }

            for (const talk of Object.values(res.talks)) {
                // talksをループ
                if (talk.type === "enter") {
                    const encip = talk.encip.substring(0, 5);
                    const name = talk.name;
                    // 未取得の場合は処理
                    if (!users.some(e => e.encip === encip && e.name === name)) {
                        // USERTに存在するか確認
                        const index = store.index("USERI2");
                        const result = await new Promise(r => index.get([encip, name]).onsuccess = event => r(event.target.result));
                        if (!result) {
                            // 存在しない場合は登録する
                            await new Promise(r => {
                                store.add({
                                    "ENCIP": encip,
                                    "NAME": name,
                                    "UPDT_DATE": now,
                                    "INST_DATE": now,
                                }).onsuccess = () => r();
                            });
                            updtEncipList.add(encip);
                        }
                    };
                };
            };

            transaction.oncomplete = () => r();
        });

        // ENCIPT更新
        await new Promise(async r => {

            const alreadySetEncip = new Set();
            for (const encip of updtEncipList) {

                // encipが重複していたら（同じ人が二人入室していたら）2つ目からは処理をスキップ
                if (alreadySetEncip.has(encip)) continue;
                alreadySetEncip.add(encip);

                // encipに紐づくUSERTのレコード数を確認
                const count = await new Promise(async r => {
                    const transaction = db.transaction(USERT, "readonly");
                    const store = transaction.objectStore(USERT);

                    const index = store.index("USERI1");

                    const range = maxRangBound(encip);

                    const request = index.count(range);

                    request.onsuccess = () => r(request.result);
                });

                const transaction = db.transaction(ENCIPT, "readwrite");
                const store = transaction.objectStore(ENCIPT);
                store.put({
                    ENCIP: encip,
                    UPDT_DATE: now,
                    COUNT: count
                });
            }

            r();
        });

        // IMGT更新
        if (imgtUpdtFlg) {
            await new Promise(async r => {
                for (const talk of Object.values(res.talks)) {
                    // talksをループ

                    // 画像URLを取得
                    const image = talk.image;

                    if (image) {
                        // 画像URLの場合

                        // 画像IDを取得
                        const id = talk.id;

                        // トランザクション開始
                        const transaction = db.transaction(IMGT, "readonly");
                        const store = transaction.objectStore(IMGT);

                        // 画像IDからレコード数を取得
                        const result = await new Promise(r => store.count(id).onsuccess = event => r(event.target.result));

                        if (result === 0) {
                            // 取得したレコード数が0の場合

                            // 画像のblobを取得
                            const blob = await(await fetch("https://drrrkari.com/" + talk.image)).blob();

                            // トランザクションを開始
                            const transaction = db.transaction(IMGT, "readwrite");
                            const store = transaction.objectStore(IMGT);

                            // データを追加
                            await new Promise(r => {
                                store.add({
                                    ID: id,
                                    BLOB: blob,
                                    INST_DATE: new Date()
                                }).onsuccess = () => r();
                            });
                        } else {
                        }
                    }
                }
                r();
            });
        } else {
        };

        // 0: ユーザ, 1: 画像
        let mode = 0;
        // 画面更新テスト
        await new Promise(r => {
            if (mode  === 0) {

                // ENCIPTからENCIP一覧を取得する
                const transaction = db.transaction(ENCIPT, "readonly");
                const store = transaction.objectStore(ENCIPT);
                const index = store.index("ENCIPI");

                const twelveHoursAgo = new Date();
                twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

                // 範囲指定（12時間前から現在まで）
                const range = IDBKeyRange.bound(twelveHoursAgo, new Date());

                // 結果を取得
                const request = index.openCursor(range, "next");

                let encipEIndex = 0;

                let inUserIndex = 0;
                let outUserIndex = 0;

                request.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        // encipを取得
                        const encip = cursor.value.ENCIP;
                        console.log("encip", encip);
                        // encipのHTML要素を取得
                        let encipE;
                        if (inEncip.has(encip)) {
                            encipE = newMenu.querySelector(`[encip="${encip}"]`);
                            if (!encipE) {
                                // 存在しない場合は作成して追加する
                                encipE = document.createElement("div");
                                encipE.setAttribute("encip", encip);
                                inUser.append(encipE);
                            }
                            // 順番が変わった場合は並び替える
                            if (inUser.querySelectorAll("[encip]")[inUserIndex] !== encipE) {
                                if (inUserIndex === 0) {
                                    inUser.prepend(encipE);
                                } else if (inUser.querySelectorAll("[encip]")[inUserIndex] === undefined) {
                                    inUser.append(encipE);
                                } else {
                                    inUser.querySelectorAll("[encip]")[inUserIndex].before(encipE);
                                }
                            }
                            inUserIndex++;
                        } else {
                            encipE = newMenu.querySelector(`[encip="${encip}"]`);
                            if (!encipE) {
                                // 存在しない場合は作成して追加する
                                encipE = document.createElement("div");
                                encipE.setAttribute("encip", encip);
                                outUser.append(encipE);
                            }
                            // 順番が変わった場合は並び替える
                            if (outUser.querySelectorAll("[encip]")[outUserIndex] !== encipE) {
                                if (outUserIndex === 0) {
                                    outUser.prepend(encipE);
                                } else if (outUser.querySelectorAll("[encip]")[outUserIndex] === undefined) {
                                    outUser.append(encipE);
                                } else {
                                    outUser.querySelectorAll("[encip]")[outUserIndex].before(encipE);
                                }
                            }
                            outUserIndex++;
                        }

                        // ユーザーが居るところを指定
                        const transaction = db.transaction(USERT, "readonly");
                        const store = transaction.objectStore(USERT);

                        // Aさんを名指しで呼ぶ方法を指定
                        const index = store.index("USERI1");
                        const range = maxRangBound(encip);

                        // Aさんを呼ぶ
                        const res = index.openCursor(range, 'next');

                        let i = 0;
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
                                userE.querySelector("div").textContent = formatDateWithWeekday(e.UPDT_DATE);
                                (e => {
                                    if (e !== userE) {
                                        if (e === undefined) {
                                            encipE.append(userE);
                                        } else {
                                            e.before(userE);
                                        }
                                    }
                                })(encipE.querySelectorAll("[no]")[i]);
                                i++;
                                console.log(i, e.NAME, e.ENCIP);
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
