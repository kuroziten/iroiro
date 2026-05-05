// ==UserScript==
// @name         新つーる
// @namespace    http://tampermonkey.net/
// @version      2026-05-02
// @description  try to take over the world!
// @author       You
// @match        https://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrrkari.com
// @grant        none
// ==/UserScript==

(function() {

    // 画面を作る
    const editHtml = () => {
        const style = document.createElement("style");
        style.innerHTML = `
body {
    padding: 0;
}
div#body {
    margin-left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    .message_box {
        position: sticky;
        padding: 0;
    }
}
dl p.body {
  max-width: 25vw;
}
#talks_box {
    display: flex;
}
#talks {
    margin-top: 0;
    width: 100%;
}
#view {
    width: 100%;
    height: calc(100vh - 138px);
    background-color: red;
    position: fixed;
    width: 50%;
    overflow: scroll;
    right: 0;
}
[name] {
    display: flex;
    padding: 8px;
    & * {
        flex: 1;
    }
}
        `;
        const view = document.createElement("div");
        view.id = "view";
        document.querySelector("#talks_box").append(view);
        document.body.append(style);
        const activeView = document.createElement("div");
        activeView.id = "activeView";
        const inactiveView = document.createElement("div");
        inactiveView.id = "inactiveView";
        view.append(activeView);
        view.append(inactiveView);

        addView("テストENCIP", "テスト名", new Date(), true);
    };
    editHtml();

    function formatDate(date) {
        const pad = function (n) {
            return n.toString().padStart(2, '0');
        };

        return date.getFullYear() + '-' +
            pad(date.getMonth() + 1) + '-' +
            pad(date.getDate()) + ' ' +
            pad(date.getHours()) + ':' +
            pad(date.getMinutes()) + ':' +
            pad(date.getSeconds());
    }

    function createEncipElement(encip) {
        const encipElement = document.createElement("div");
        encipElement.setAttribute("encip", encip);
        return encipElement;
    }
    function addView(encip, name, updtDate, activeFlg) {
        let encipElement = null;
        const activeView = document.querySelector("#activeView");
        const inactiveView = document.querySelector("#inactiveView");
        if (activeFlg) {
            // activeFlg が true の場合
            if (encipElement = activeView.querySelector("div[encip='" + encip + "']")) {
                // activeViewに存在したらそれを使う
            } else if (encipElement = inactiveView.querySelector("div[encip='" + encip + "']")) {
                // inactiveViewに存在したらそれをactiveViewに移してから使う
                activeView.append(encipElement);
            } else {
                // 上記以外の場合はactiveViewに新規作成する
                encipElement = createEncipElement(encip, name);
                activeView.append(encipElement);
            }
        } else {
            // activeFlg が false の場合
            if (encipElement = inactiveView.querySelector("div[encip='" + encip + "']")) {
                // inactiveViewに存在したらそれを使う
            } else if (encipElement = activeView.querySelector("div[encip='" + encip + "']")) {
                // activeViewに存在したらそれをinactiveViewに移してから使う
                activeView.append(encipElement);
            } else {
                // 上記以外の場合はactiveViewに新規作成する
                encipElement = createEncipElement(encip, name);
                inactiveView.append(encipElement);
            }
        }

        // nameが設定されていなかったら設定する
        let nameElement = null;
        if (!(nameElement = encipElement.querySelector("[name='" + name + "']"))) {
            nameElement = document.createElement("div");
            encipElement.append(nameElement);
            nameElement.setAttribute("name", name);

            const encipCol = document.createElement("div");
            nameElement.append(encipCol);
            encipCol.classList.add("encip");
            encipCol.textContent = encip;

            const nameCol = document.createElement("div");
            nameElement.append(nameCol);
            nameCol.classList.add("name");
            nameCol.textContent = name;

            const updtDateCol = document.createElement("div");
            nameElement.append(updtDateCol);
            updtDateCol.classList.add("updtDate");
        }
        nameElement.querySelector(".updtDate").textContent = formatDate(updtDate);
    }

    const open = XMLHttpRequest.prototype.open;

    /**
 * 直近24時間以内に更新されたレコードを、見つけた順に即座にUIへ反映する
 */
    async function processRecentRecords() {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("updateIndex");

        // 24時間前の時刻
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // 24時間前〜現在までの範囲（新しいもの）
        const range = IDBKeyRange.lowerBound(twentyFourHoursAgo);

        // 新しい順（降順）で回す
        const request = index.openCursor(range, "prev");

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const data = cursor.value;

                // 配列に入れず、この場で INFO 内のユーザーを画面に出す
                for (const name of Object.keys(data.INFO)) {
                    const userDetail = data.INFO[name];
                    // 画面更新用の関数を直接叩く
                    // 第3引数は Date オブジェクトに戻して渡す
                    addView(data.ENCIP, name, new Date(userDetail.UPDT_DATE), true);
                }

                // 次のレコードへ（配列を介さないのでここでループ）
                cursor.continue();
            } else {
                console.log("直近24時間のデータ処理がすべて完了しました");
            }
        };

        request.onerror = (event) => {
            console.error("検索失敗:", event.target.error);
        };
    }

    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', async function() {
            if (url === 'https://drrrkari.com/ajax.php') {
                console.log("main開始");
                await main(JSON.parse(this.responseText));
                console.log("main終了");
                console.log("processRecentRecords開始");
                await processRecentRecords();
                console.log("processRecentRecords終了");
            }
        });
        open.apply(this, arguments);
    };

    const DB_NAME = "MyDatabase";
    const DB_VERSION = 1;
    const STORE_NAME = "myStore";

    // データベースの初期化
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const store = db.createObjectStore(STORE_NAME, { keyPath: "ENCIP" });

                // 検索・ソート用のインデックス作成
                store.createIndex("countIndex", "COUNT", { unique: false });
                store.createIndex("updateIndex", "UPDT_DATE", { unique: false });
            };

            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
 * 1. 登録（既にある場合は更新）
 * details（日付）は内部で自動生成します
 * @param {string} encip
 * @param {string} name (なまえ)
 */
    async function upsertRecord(encip, name) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);

            const getRequest = store.get(encip);

            getRequest.onsuccess = () => {
                let data = getRequest.result;
                const now = new Date().toISOString();

                if (!data) {
                    // --- レコード自体が新規作成の場合 ---
                    data = {
                        ENCIP: encip,
                        INFO: {
                            [name]: { INST_DATE: now, UPDT_DATE: now }
                        },
                        INST_DATE: now,
                        UPDT_DATE: now,
                        COUNT: 1
                    };
                } else {
                    // --- 既存レコードの更新の場合 ---
                    if (!data.INFO[name]) {
                        // 新しい「なまえ」を追加
                        data.INFO[name] = { INST_DATE: now, UPDT_DATE: now };
                    } else {
                        // 既存の「なまえ」の内容を更新
                        data.INFO[name].UPDT_DATE = now;
                    }

                    // レコード全体の管理情報を更新
                    data.COUNT = Object.keys(data.INFO).length;
                    data.UPDT_DATE = now;
                }

                const putRequest = store.put(data);
                putRequest.onsuccess = () => resolve(putRequest.result);
            };

            transaction.onerror = () => reject(transaction.error);
        });
    }

    /**
 * 2. ENCIPで検索（ピンポイント取得）
 */
    async function getByEncip(encip) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(encip);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
 * 3. UPDT_DATE（更新日順）または COUNT（件数順）で検索
 * @param {string} indexName - "updateIndex" または "countIndex"
 * @param {boolean} descending - trueで大きい順（降順）
 */
    async function getSortedRecords(indexName, descending = true) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readonly");
            const index = transaction.objectStore(STORE_NAME).index(indexName);
            const direction = descending ? "prev" : "next";

            const results = [];
            const request = index.openCursor(null, direction);

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    // --- 使い方例 ---
    //     (async () => {
    //         // 登録・更新
    //         await upsertRecord("AAA", "かなえ", { INST_DATE: "2026-05-01", UPDT_DATE: "2026-05-02" });
    //         await upsertRecord("AAA", "かなこ", { INST_DATE: "2026-05-01", UPDT_DATE: "2026-05-02" });
    //         await upsertRecord("BBB", "さとし", { INST_DATE: "2026-05-01", UPDT_DATE: "2026-05-02" });

    //         // ENCIPで検索
    //         const res1 = await getByEncip("AAA");
    //         console.log("ENCIP検索結果:", res1);

    //         // 件数(COUNT)が多い順で取得
    //         const res2 = await getSortedRecords("countIndex", true);
    //         console.log("件数順ランキング:", res2);

    //         // 更新日(UPDT_DATE)が新しい順で取得
    //         const res3 = await getSortedRecords("updateIndex", true);
    //         console.log("最新更新順:", res3);
    //     })();


    async function main(obj) {
        // ユーザーを取得する
        const updtDate = new Date();
        for (const user of Object.values(obj.users)) {
            const encip = user.encip.slice(0, 5);
            const name = user.name;
            console.log("追加開始", encip, name);
            await upsertRecord(encip, name);
            console.log("追加完了", encip, name);
        }
    }
})();
