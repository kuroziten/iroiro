const dbName = "db";

const weekConstants = ["日", "月", "火", "水", "木", "金", "土"];

const tblConstants = new class {
    tblName = "tbl";
    key = new class {
        name = "name";
        encip = "encip";
        dt = "dt";
        dtString = "dtString";
    }
    indexName = new class {
        key = "key";
        encip = "encip";
        dt = "dt";
    }
};

/**
 * 直接入社しようとしたら大体高卒以上が条件だから中卒の僕には出来ない方法！
 * SESやって色んな職場で働いてみて良いところを見つけたら会社をやめてこっそり直接入社させてもらうのも良いかもしれない
 */

const imgIdConstants = new class {
    tblName = "imgId";
    key = new class {
        id = "id";
        imgId = "imgId";
    }
    indexName = new class {
        id = "id";
        imgId = "imgId";
    }
};

const imgConstants = new class {
    tblName = "img";
    key = new class {
        id = "id";
        base64 = "base64";
    }
    indexName = new class {
        id = "id";
    }
};

const domInsert = new class {
    createNewArea = () => {
        const newArea = document.createElement("div");
        newArea.id = "newArea";
        return newArea;  
    };

    createNewAreaHeader = () => {
        const newAreaHeader = document.createElement("div");
        newAreaHeader.id = "newAreaHeader";
        return newAreaHeader;
    };

    createHeaderFunction = (fellow, textContent) => {
        const e = document.createElement("div");
        e.id = "newAreaHeader" + fellow;
        e.textContent = textContent;
        e.setAttribute("fellow", fellow);
        e.addEventListener("click", e => {
            menu.current = menu.constants.imgList;
            document.querySelectorAll(".select").forEach(e => e.classList.remove("select"));
            document.querySelectorAll(`[fellow="${fellow}"]`).forEach(e => e.classList.add("select"));
        });
        return e;
    };

    createNewAreaHeaderUserInfo = () => {
        const newAreaHeaderUserInfo = this.createHeaderFunction("UserInfo", "ユーザ情報")
        newAreaHeaderUserInfo.classList.add("select");
        return newAreaHeaderUserInfo;
    };

    createNewAreaHeaderImgList = () => {
        const newAreaHeaderImgList = this.createHeaderFunction("ImgList", "画像")
        return newAreaHeaderImgList;
    };

    createNewAreaHeaderMemo = () => {
        const newAreaHeaderMemo = this.createHeaderFunction("Memo", "メモ")
        return newAreaHeaderMemo;
    };

    createNewAreaHeaderDbClear = () => {
        const newAreaHeaderDbClear = document.createElement("div");
        newAreaHeaderDbClear.id = "newAreaHeaderDbClear";
        newAreaHeaderDbClear.textContent = "DBクリア";
        newAreaHeaderDbClear.addEventListener("click", () => {
            if (confirm("DBを削除しますか？") && confirm("削除を行うと元には戻せません。それでも削除しますか？")) {
                indexedDB.deleteDatabase("db");
                window.location.reload();
            }
        });    
        return newAreaHeaderDbClear;
    };

    createBodyFunction = (fellow) => {
        const e = document.createElement("div");
        e.classList.add("newAreaBody" + fellow);
        e.setAttribute("fellow", fellow);
        return e;
    };

    createNewAreaBodyUserInfo = () => {
        const e = this.createBodyFunction("UserInfo");
        e.classList.add("select");
        return e;
    };

    createNewAreaBodyImgList = () => {
        const e = this.createBodyFunction("ImgList");
        return e;
    };
};

const menu = new class {
    constants = new class {
        userInfo = "userInfo";
        imgList = "imgList";
        memo = "memo";
    };
    current = this.constants.userInfo;
};

// const imgDb = new class {

// };

/**
 * カラムの設定用クラス.
 */
class columnClass {
    constructor(key, uniqueFlg) {
        this.key = key;
        this.uniqueFlg = uniqueFlg;
    }
    key;
    uniqueFlg;
};

/**
 * インデックスの設定用クラス.
 */
class indexClass {
    constructor(indexName, value, uniqueFlg) {
        this.idnexName = indexName;
        this.value = value;
        this.uniqueFlg = uniqueFlg;
    }
    idnexName;
    value;
    uniqueFlg;
};

/**
 * オプションの設定用クラス.
 */
class optionClass {
    constructor(keyPath, autoIncrement) {
        this.keyPath = keyPath;
        this.autoIncrement = autoIncrement;
    }
    keyPath;
    autoIncrement;
};

/**
 * ユーザ情報クラス
 */
const dbUserInfoTbl = new class {
    tblName = "UserInfo";
    columns = {
        name: new columnClass("name", false),
        encip: new columnClass("encip", false),
        dt: new columnClass("dt", false),
        dtString: new columnClass("dtString", false)
    };
    indexs = {
        nameEncip: new indexClass("nameEncip", [this.columns.name.key, this.columns.encip.key], true)
    };
    option = new optionClass([this.columns.name.key, this.columns.encip.key], false);
};
// indexedDB.deleteDatabase("db");

/**
 * DB
 */
const db = await new Promise(r => {
    const request = indexedDB.open(dbName, 1);
    // ストア名リスト（バックアップ用に作成）
    let objectStoreNames;
    request.onupgradeneeded = event => {
        const db = event.target.result;

        let store;

        if (!db.objectStoreNames.contains(tblConstants.tblName)) {
            store = db.createObjectStore(tblConstants.tblName, { keyPath: [tblConstants.key.name, tblConstants.key.encip] });
        } else {
            store = event.target.transaction.objectStore(tblConstants.tblName);
        }

        /**
         * インデックス追加用関数.
         *
         * @param {*} store ストア
         * @param {*} key インデックス名
         * @param {*} val キー名
         * @param {*} uniqueFlg ユニークフラグ（true: ユニーク, false: 非ユニーク）
         */
        const createIndex = (store, key, val, uniqueFlg) => {
            if (!store.indexNames.contains(key)) {
                console.log("新規追加します。", key);
                store.createIndex(key, val, { unique: uniqueFlg });
            } else {
                console.log("既に追加されているためスキップします。らんらんらん♪", key);
            }
        };

        createIndex(store, tblConstants.indexName.key, [tblConstants.key.name, tblConstants.key.encip], true);
        createIndex(store, tblConstants.indexName.encip, tblConstants.key.encip, false);
        createIndex(store, tblConstants.indexName.dt, tblConstants.key.dt, false);

        // 画像IDテーブル作成（画像IDのみ保持。画像も毎回取得すると重くなりそうなので。）
        if (!db.objectStoreNames.contains(imgIdConstants.tblName)) {
            store = db.createObjectStore(imgIdConstants.tblName, { keyPath: imgIdConstants.key.id, autoIncrement: true });
        } else {
            store = event.target.transaction.objectStore(imgIdConstants.tblName);
        }
        createIndex(store, imgIdConstants.indexName.id, imgIdConstants.key.id, true);
        createIndex(store, imgIdConstants.indexName.imgId, imgIdConstants.key.imgId, true);

        // 画像テーブル作成（画像IDと画像を保持）
        if (!db.objectStoreNames.contains(imgConstants.tblName)) {
            store = db.createObjectStore(imgConstants.tblName, { keyPath: imgConstants.key.id });
        } else {
            store = event.target.transaction.objectStore(imgConstants.tblName);
        }
        createIndex(store, imgConstants.indexName.id, imgConstants.key.id, true);

        console.log("index作成完了");

    };
    request.onsuccess = event => r(event.target.result);
    request.onerror = event => {
        console.log("エラーです！！！", event.target.error);
        // console.log(objectStoreNames);
    };
});

/**
 * 
 * @param {*} name 
 * @param {*} encip 
 * @param {*} dt 
 * @param {*} dtString 
 */
const put = async (name, encip, dt, dtString) => {
    return new Promise(r => {
        const transaction = db.transaction(tblConstants.tblName, "readwrite");
        const store = transaction.objectStore(tblConstants.tblName);
        const obj = {
            name: name,
            encip: encip,
            dt: dt,
            dtString: dtString,
        };
        const request = store.put(obj);
        request.onsuccess = () => {
            r();
        };
        request.onerror = event => {
        }
    });
};

const getBound = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(tblConstants.tblName, "readonly");
        const store = transaction.objectStore(tblConstants.tblName);
        const index = store.index(tblConstants.indexName.dt);

        // 範囲を指定
        const range = IDBKeyRange.bound(startDate, new Date(endDate - 1));

        const request = index.openCursor(null, "next");
        const results = [];

        const onlyAndBefore24h = {};
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const item = cursor.value;
                results.push(item);

                if (onlyAndBefore24h[item.encip] === undefined) {
                    onlyAndBefore24h[item.encip] = {
                        count: 1,
                        maxDt: item.dt,
                    }
                } else {
                    onlyAndBefore24h[item.encip].count++;
                    if (onlyAndBefore24h[item.encip].maxDt < item.dt) {
                        onlyAndBefore24h[item.encip].maxDt = item.dt;
                    }
                }

                cursor.continue(); // 次のアイテムへ進む
            } else {

                // 1件または24時間以上前のものは表示しない
                const now = new Date();
                const before24h = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
                const result1 = results
                    .sort((a, b) => a.dt < b.dt || (a.dt === b.dt && a.encip > b.encip))
                    .filter(e => !(onlyAndBefore24h[e.encip].count === 1 || onlyAndBefore24h[e.encip].maxDt < before24h));

                resolve(
                    result1
                ); // すべての結果を返す
            }
        };
    });
};

const getOfDtKey = dt => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(tblConstants.tblName, "readonly");
        const store = transaction.objectStore(tblConstants.tblName);
        const index = store.index(tblConstants.indexName.dt);

        const request = index.openCursor(dt, "next");
        const results = [];

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue(); // 次のアイテムへ進む
            } else {
                resolve(results); // すべての結果を返す
            }
        };
    });
};

const getOfEncipKey = encip => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(tblConstants.tblName, "readonly");
        const store = transaction.objectStore(tblConstants.tblName);
        const index = store.index(tblConstants.indexName.encip);

        const request = index.openCursor(encip, "next");
        const results = [];

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue(); // 次のアイテムへ進む
            } else {
                resolve(results); // すべての結果を返す
            }
        };
    });
};

/**
 * IDと画像のbase64を取得するDB操作用クラス
 */
const imgDbFunctions = new class {
    put = async (id, base64) => {
        return new Promise(r => {
            const transaction = db.transaction(imgConstants.tblName, "readwrite");
            const store = transaction.objectStore(imgConstants.tblName);
            const value = {};
            value[imgConstants.key.id] = id;
            value[imgConstants.key.base64] = base64;
            const request = store.put(value);
            request.onsuccess = (event) => {
                r(event.target.result);
            };
            request.onerror = event => {
            };
        });
    };
    get = async(id) => {
        return new Promise(r => {
            const transaction = db.transaction(imgConstants.tblName, "readonly");
            const store = transaction.objectStore(imgConstants.tblName);
            const index = store.index(imgConstants.indexName.id);
            const request = index.get(id);
            request.onsuccess = e => r(e.target.result);
        });
    };
    del = async (id) => {
        return new Promise(r => {
            const transaction = db.transaction(imgConstants.tblName, "readonly");
            const store = transaction.objectStore(imgConstants.tblName);
            const index = store.index(imgConstants.indexName.id);
            const request = index.get(id);
            request.onsuccess = e => {
                const transaction = db.transaction(imgConstants.tblName, "readwrite");
                const store = transaction.objectStore(imgConstants.tblName);
                store.delete(request.result.id);
                r("");
            };
        });
    };
};

/**
 * IDの採番と画像IDを取得するDB操作用クラス
 */
const imgIdDbFunctions = new class {
    put = async (imgId, base64) => {
        return new Promise(r => {
            const transaction = db.transaction(imgIdConstants.tblName, "readwrite");
            const store = transaction.objectStore(imgIdConstants.tblName);
            const request = store.put({
                imgId: imgId,
            });

            request.onsuccess = async (event) => {

                const imgIdResult = event.target.result;
                const imgResult = await imgDbFunctions.put(imgIdResult, base64);
                r(imgIdResult);
            };
            request.onerror = event => {
            };
        });
    };
    getAll = async () => {
        return new Promise(r => {
            const transaction = db.transaction(imgIdConstants.tblName, "readwrite");
            const store = transaction.objectStore(imgIdConstants.tblName);
            const request = store.getAll(null, null);
            request.onsuccess = async (event) => {
                r(event.target.result);
            };
        });
    };

    getOfImgIdKey = async (imgId) => {
        return new Promise(r => {
            const transaction = db.transaction(imgIdConstants.tblName, "readonly");
            const store = transaction.objectStore(imgIdConstants.tblName);
            const index = store.index(imgIdConstants.indexName.imgId);
            const request = index.get(imgId);

            request.onsuccess = (event) => r(event.target.result);
        });
    };

    /**
     * 一番最後のレコード取得.
     *
     * @returns 
     */
    getLast = async () => {
        return new Promise(r => {
            const transaction = db.transaction(imgIdConstants.tblName, "readonly");
            const store = transaction.objectStore(imgIdConstants.tblName);

            // オブジェクトストアの最後のレコードを取得するために逆順でカーソルを開く
            const request = store.openCursor(null, "prev");  // "prev" で逆順

            request.onsuccess = event => r(event.target.result.value);
        });
    };
    clear = async () => {
        return new Promise(r => {
            const transaction = db.transaction(imgIdConstants.tblName, "readwrite");
            const store = transaction.objectStore(imgIdConstants.tblName);
            const request = store.clear();
            request.onsuccess = (event) => {
                r(event.target.result);
            };
        });
    };
    del = async (id) => {
        return new Promise(r => {
            const transaction = db.transaction(imgIdConstants.tblName, "readwrite");
            const store = transaction.objectStore(imgIdConstants.tblName);

            const index = store.index(imgIdConstants.indexName.id);

            const request = index.get(id);
    
            request.onsuccess = e => {
                const transaction = db.transaction(imgIdConstants.tblName, "readwrite");
                const store = transaction.objectStore(imgIdConstants.tblName);
                store.delete(request.result.id);
                r("");
            };

        });
    };
};
/** CSSの変更 **/
const style = document.createElement("style");
style.textContent = `
    .message_box {
    position: sticky !important;
    width: 100vw !important;
        padding: 5px 0 5px 0 !important;
    }
    #body {
        margin-left: 0 !important;
        width: 100vw !important;
        flex-wrap: wrap;
        display: flex;
    }
    #talks_box {
        flex-flow: row;
        display: inline-block;
        width: 50vw !important;
        box-sizing: border-box;
        padding-left: 9%;
    }
    #talks {
        margin-top: 0;
    }
    body {
        margin: 0;
        padding: 0;
    }
    #newArea {
        background-color: black;
        position: sticky;
        width: 50vw !important;
        box-sizing: border-box;
        height: calc(100vh - 153px);
        display: inline-block;
        vertical-align: top;
        color: black;
        top: 153px;
        overflow: scroll;
    }
    #newAreaHeader {
        min-height: 50px;
        background-color: gray;
        display: flex;
        position: sticky;
        top: 0;
    }
    #newAreaHeaderUserInfo {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #newAreaHeaderImgList {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #newAreaHeaderMemo {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #newAreaHeaderDbClear {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAreaBodyUserInfo,
    .newAreaBodyImgList {
        display: none;
    }

    .newAreaBodyImgList img {
      width: 25%;
    }

    #newAreaHeaderUserInfo.select,
    #newAreaHeaderImgList.select {
        background-color: pink;
    }

    .newAreaBodyUserInfo.select {
        display: unset;
    }

    .newAreaBodyImgList.select {
        display: flex;
    }

    .newAreaBody {
        height: 100%;
        background-color: green;
    }
    dd {
        max-width: 80% !important;
    }
    .userElement {
        display: flex;
        background-color: black;
        color: white;
        div:nth-of-type(1) {
            border-right: 1px solid white;
        }
        div:nth-of-type(2) {
            border-right: 1px solid white;
            width: 65px;
        }
        div:nth-of-type(3) {
            flex-grow: 1;
        }            
        div {
            border-bottom: 1px solid white;
            padding: 5px;
        }
    }
    .userElement[currentFlg="0"] {
        background-color: gray;
    }
    .userElement[currentFlg="1"][colorFlg="0"] {
        background-color: #a0656f;
    }
    .userElement[currentFlg="1"][colorFlg="1"] {
        background-color: #8888da;
    }

    .newAreaBodyImgList {
        display: none;
        flex-flow: wrap;
    }

    .imgParent {
        position: relative;
        width: 20%;
    }

    .imgParent img {
        width: 100%;
    }
    .imgDelButton {
        position: absolute;
        top: 0.78125vw;
        left: 0.78125vw;
        width: 3.125vw;
        height: 3.125vw;
        background-color: red;
    }

    @media screen and (max-width: 959px) {
        #talks_box {
            padding-left: 0%;
        }
    }
`;
document.body.append(style);
const createUserElement = (name, encip, dtString) => {
    const userElement = document.createElement("div");
    userElement.classList.add("userElement");
    userElement.setAttribute("name", name);
    userElement.setAttribute("encip", encip);
    const dtElement = document.createElement("div");
    const encipElement = document.createElement("div");
    const nameElement = document.createElement("div");
    userElement.append(dtElement);
    userElement.append(encipElement);
    userElement.append(nameElement);
    dtElement.textContent = dtString;
    encipElement.textContent = encip;
    nameElement.textContent = name;
    return userElement;
}

const addListPush = (list, name, encip) => list.push({name: name, encip: encip});

const addListSome = (list, name, encip) => list.some(e => e.name === name && e.encip === encip);

const addSubUserSubAction = (addList, name, encip, dtString, currentFlg, getUserInfoFirst, colorFlg, i) => {

    addListPush(addList, name, encip);

    let userElement = document.querySelector(`[name="${name}"][encip="${encip}"]`);
    if (userElement === null) {
        userElement = createUserElement(name, encip, dtString);
    }

    if (currentFlg) {
        userElement.setAttribute("currentFlg", 1);
    } else {
        userElement.setAttribute("currentFlg", 0);
    }

    if (colorFlg) {
        userElement.setAttribute("colorFlg", 0);
    } else {
        userElement.setAttribute("colorFlg", 1);
    }

    const div0 = userElement.querySelector("div");
    if (div0.textContent !== dtString) {
        div0.textContent = dtString;
    }

    if (getUserInfoFirst) {
        document.querySelector(".newAreaBodyUserInfo").append(userElement);
    } else if (document.querySelector(".newAreaBodyUserInfo").querySelectorAll("div.userElement")[i] !== userElement) {
        if (i === 0) {
            document.querySelector(".newAreaBodyUserInfo").prepend(userElement);
        } else {
            document.querySelector(".newAreaBodyUserInfo").querySelectorAll("div.userElement")[i - 1].after(userElement);
        }
    }
};

const getDateString = date => {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const day = weekConstants[date.getDay()];
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return [yyyy, MM, dd].join("-") + `(${day}) ` + [hh, mm, ss].join(":");
};

const getUserInfo = async (getUserInfoFirst) => {

    // console.clear();
    // console.log("getUserInfo", getDateString(new Date()));

    let colorFlg = false;

    const dt = new Date();
    const dtString = getDateString(dt);
    let userInfo;
    try {
        userInfo = await (await fetch("/ajax.php", { method: "post" })).json();
    } catch (error) {
        // エラーの時は再実行します
        console.log("エラーの時は再実行します");
        setTimeout(() => getUserInfo(false), menu.current === menu.constants.userInfo ? 5000 : 10000);
    }
    const users = Object.values(userInfo.users);
    for (const e of users) {
        const encip = e.encip === undefined ? userInfo.hostip : e.encip;
        await put(e.name, encip?.slice(0, 5), dt, dtString);
    }

    /** 画面の更新. **/
    if (menu.current === menu.constants.userInfo) {

        let i = 0;
    
        const addList = [];
        
        /**
         * indexedDBからユーザの情報を取得して画面に反映させるやつ
         *
         * @param {*} exclusionList 除外するリスト.
         * @param {*} encip 対象encip.
         * @param {*} currentFlg 現在入室中か判定.
         */
        const addSubUser = async (exclusionList, encip, currentFlg) => {
            const subUserList = (await getOfEncipKey(encip)).sort((a, b) => a.dt < b.dt);
            for (const subUser of subUserList) {
    
                if (exclusionList.some(e => e.name === subUser.name && e.encip === subUser.encip)) {
                    continue;
                };

                addSubUserSubAction(addList, subUser.name, subUser.encip, subUser.dtString, currentFlg, getUserInfoFirst, colorFlg, i);
    
                i++;
                updtFlg = true;
            }
            colorFlg = !colorFlg;
        };
    
        // 入室中のユーザのencipを取得
        const currentUsersEncipUnique = new Set(users.map(user => (user.encip === undefined ? userInfo.hostip : user.encip).slice(0, 5)));

        // 入室中のユーザのデータ
        for (const encip of currentUsersEncipUnique) {
            await addSubUser(addList, encip, true);
        }

        // 入室中のユーザと入室中のユーザのデータに紐づくデータに紐づかないユーザ
        const userInfoList = (await getBound(new Date("2025-05-01"), new Date("2026-01-01")))
            .sort((a, b) => a.dt < b.dt);

        for (const user of userInfoList) {
            if (addList.some(e => e.encip === user.encip)) {
                continue;
            }
            await addSubUser(addList, user.encip, false);
        }
    }

    // 2回目、空は初回じゃないのでfalse
    // 表示中は5秒ごと、非表示中は10秒ごと
    setTimeout(() => getUserInfo(false), menu.current === menu.constants.userInfo ? 5000 : 10000);
};

/**
 * 画像の更新処理
 */
const updtNewAreaBodyImgList = async () => {

    document.querySelector(".newAreaBodyImgList").addEventListener("click", async e => {
        const target = e.target;
        if (target.className === "imgDelButton") {
            const id = target.parentNode.getAttribute("id");
            if (confirm("削除しますか？")) {
                await imgIdDbFunctions.del(Number(id));
                await imgDbFunctions.del(Number(id));
                target.parentNode.remove();
            }
        }
    });

    const updtNewAreaBodyImgListView = async () => {

        const imgList = Array.from(document.querySelectorAll(".talk")).map(e => e.querySelector("img")).filter(e => e !== null).reverse();

        for (const img of imgList) {
            const imgId = img.parentNode.parentNode.parentNode.parentNode.id || img.parentNode.parentNode.parentNode.parentNode.parentNode.id;
            

            if (await imgIdDbFunctions.getOfImgIdKey(imgId) === undefined) {

                const newImg = new Image();
                await new Promise(async r => {
                    newImg.onload = async e => {
                        const base64 = await ImageToBase64(e.currentTarget, "image/jpeg");
                        await imgIdDbFunctions.put(imgId, base64);
                        r("");
                    };
                    newImg.src = img.src;        
                });
            }
        }

        const imgIdList = await imgIdDbFunctions.getAll();
        
        for (const imgIdObj of imgIdList) {
            const id = imgIdObj.id;
            if (document.querySelector(".newAreaBodyImgList").querySelector(`[id="${id}"]`) === null) {
                // 画像の親要素
                const imgParent = document.createElement("div");
                imgParent.setAttribute("id", id);
                imgParent.classList.add("imgParent");

                // 画像の要素
                const img = document.createElement("img");

                // 画像の要素に画像を設定
                const result = await imgDbFunctions.get(id);
                const base64 = result.base64;
                img.src = base64;

                // 削除ボタンを設定
                const imgDelButton = document.createElement("div");
                imgDelButton.classList.add("imgDelButton");

                imgParent.append(imgDelButton);
                imgParent.append(img);
                document.querySelector(".newAreaBodyImgList").append(imgParent);
            }
            
        }

        setTimeout(updtNewAreaBodyImgListView, 1000);
    };
    updtNewAreaBodyImgListView();
};

async function ImageToBase64(img, mime_type) {
    // New Canvas
    let canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    // Draw Image
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    // To Base64
    return canvas.toDataURL(mime_type);
}

(async () => {

    /** 新エリア作成 **/
    const newArea = domInsert.createNewArea();
    talks_box.after(newArea);

    /** 新エリアのヘッダー作成 **/
    const newAreaHeader = domInsert.createNewAreaHeader();
    newArea.append(newAreaHeader);

    /** 新エリアのヘッダーのユーザ情報作成 **/
    const newAreaHeaderUserInfo = domInsert.createNewAreaHeaderUserInfo();
    newAreaHeader.append(newAreaHeaderUserInfo);

    /** 新エリアのヘッダーの画像リスト作成 **/
    const newAreaHeaderImgList = domInsert.createNewAreaHeaderImgList();
    newAreaHeader.append(newAreaHeaderImgList);

    /** 新エリアのヘッダーのメモ作成 **/
    const newAreaHeaderMemo = domInsert.createNewAreaHeaderMemo();
    newAreaHeader.append(newAreaHeaderMemo);

    /** 新エリアのヘッダーのDBクリア作成 **/
    const newAreaHeaderDbClear = domInsert.createNewAreaHeaderDbClear();
    newAreaHeader.append(newAreaHeaderDbClear);

    /** 新エリアのボディー作成（ユーザ情報） **/
    const newAreaBodyUserInfo = domInsert.createNewAreaBodyUserInfo();
    newArea.append(newAreaBodyUserInfo);

    /** 新エリアのボディー作成（画像リスト） **/
    const newAreaBodyImgList = domInsert.createNewAreaBodyImgList();
    newArea.append(newAreaBodyImgList);

    // /** 新エリアのボディー作成（メモ） **/
    // const newAreaBodyMemo = domInsert.createNewAreaBodyUserInfo();
    // newArea.append(newAreaBodyMemo);

    /** ユーザ情報の作成、更新. **/
    getUserInfo(true);

    updtNewAreaBodyImgList();

})();
