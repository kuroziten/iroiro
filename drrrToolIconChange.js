// ==UserScript==
// @name         デュラチャのアイコン変えるだけのやつ！
// @namespace    http://tampermonkey.net/
// @version      2025-08-08
// @description  try to take over the world!
// @author       You
// @match        https://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrrkari.com
// @grant        none
// @grant GM_xmlhttpRequest
// ==/UserScript==

(async function() {

    const target = {
        id: null,
        name: null,
        data: null,
        url: null
    };

    const style = document.createElement("style");
    style.textContent = `
#popover1,
.urlPopover,
.filePopover,
.clipboardPopover,
.bkChangePopover
{
    display: none;
}

/* メインポップオーバー */
#popover1:popover-open
{
    width: 80%;
    min-width: 1000px;
    height: 50%;

    display: block;

    background-color: black;
    margin: auto auto;
    border-color: white;
    border-style: dotted;
    border-width: 2px;
    border-radius: 5px;
    & * {
        color: white;
        background-color: transparent;
    }
    & div {
        height: 120px;
    }
    & img {
        height: 100%;
        max-height: unset;
    }
    & input {
        background-color: transparent;
    }
}

/* サブポップオーバー */
.urlPopover:popover-open,
.filePopover:popover-open,
.clipboardPopover:popover-open,
.bkChangePopover:popover-open
{
    width: 85%;
    height: 55%;

    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: start;

    margin: auto auto;
    background-color: black;

    border-color: white;
    border-style: dotted;
    border-width: 2px;
    border-radius: 5px;

    & > .popChildDiv {
        color: white;
        cursor: pointer;
        max-height: 240px;
        width: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        margin-top: 30px;
        &:first-child {
            height: 90px;
        }
        &:last-child {
            width: 180px;
            height: 180px;
            & img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
    & input {
        width: 30%;
        height: 90px;
        margin-top: 30px;
    }
}

#popover1 > .item {
    display: flex;
    justify-content: space-around;
    align-items: center;

    border-bottom: white dotted 2px;
    padding-top: 15px;
    padding-bottom: 15px;
    &:hover {
        background-color: #1d3038;
    }
    & > * {
        height: 120px;
    }
    & > input {
        width: 30%;
        &:hover {
            background-color: #16281e;
        }
    }
    & > .view {
        width: 90px;
        height: 90px;
        display: flex;
        justify-content: center;
        & img {
            height: 100%;
            width: 100%;
            object-fit: contain;
        }
        &[ptn="1"] img {
            object-fit: cover;
        }
        &[ptn="2"] img {
            object-fit: cover;
            object-position: top;
        }
        &[ptn="3"] img {
            object-fit: cover;
            object-position: right;
        }
        &[ptn="4"] img {
            object-fit: cover;
            object-position: bottom;
        }
        &[ptn="5"] img {
            object-fit: cover;
            object-position: left;
        }
    }
    & > .operation {
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        align-items: center;
        cursor: pointer;
        & > div {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            & img {
                height: 100%;
            }
        }
        & *:hover {
            background-color: #16281e;
        }
    }
    & > .operationSub {
        display: flex;
        width: 30%;
        justify-content: space-around;
        align-items: center;
        cursor: pointer;
        & div {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            & img {
                height: 100%;
            }
        }
        & > div:nth-of-type(1):hover,
        > div:nth-of-type(3):hover{
            background-color: #16281e;
        }
        & > .operationSubSub2
        ,  > .operationSubSub1{
            display: flex;
            flex-flow: column;
            & > * {
                height: 50%;
                border: 0;
                &:hover {
                    background-color: #16281e;
                }
            }
        }
    }
}

dt[set] {
    display: flex !important;
    flex-flow: column;
    padding: 0 !important;
    align-items: center;
    &  > div {
        width: 58px;
        height: 58px;
        & img {
            object-fit: contain;
            width: 100% !important;
            height: 100% !important;
        }
    }
}
.userprof {
    display: flex;
    flex-flow: column;
    align-items: center;
    & > div {
        width: 58px;
        height: 58px;
        & img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        &[ptn="1"] img {
            object-fit: cover;
        }
        &[ptn="2"] img {
            object-fit: cover;
            object-position: top;
        }
        &[ptn="3"] img {
            object-fit: cover;
            object-position: right;
        }
        &[ptn="4"] img {
            object-fit: cover;
            object-position: bottom;
        }
        &[ptn="5"] img {
            object-fit: cover;
            object-position: left;
        }
    }
}

dt {
    & > div {
        img {
            width: 100%;
            height: 100%;
        }
        &[ptn="1"] img {
            object-fit: cover;
        }
        &[ptn="2"] img {
            object-fit: cover;
            object-position: top;
        }
        &[ptn="3"] img {
            object-fit: cover;
            object-position: right;
        }
        &[ptn="4"] img {
            object-fit: cover;
            object-position: bottom;
        }
        &[ptn="5"] img {
            object-fit: cover;
            object-position: left;
        }
    }
}

`;
    document.body.append(style);

    /* カラーピッカー */
    await new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.5.2/jscolor.min.js";
        document.head.append(script);
        script.onload = () => resolve();
    });

    // DB作成 & 取得
    const iconChange20250806Db = await new Promise(resolve => {
        // indexedDB.deleteDatabase("iconChange20250806");
        const request = indexedDB.open("iconChange20250806", 1);
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            const store = db.createObjectStore("iconChange20250806", {keyPath: "id",autoIncrement: true});
            store.createIndex("sortIndex", "sort", { unique: true });
            store.createIndex("nameIndex", "name", { unique: false });
        };
        request.onsuccess = () => {
            resolve(event.target.result);
        };
    });

    // 最大ソート番号を取得
    const iconChange20250806DbGetMaxSort = () => {
        return new Promise(resolve => {
            const transaction = iconChange20250806Db.transaction(["iconChange20250806"], "readonly");
            const store = transaction.objectStore("iconChange20250806");
            const index = store.index("sortIndex");
            const request = index.openCursor(null, "prev"); // 降順カーソル
            request.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    resolve(cursor.value.sort);
                } else {
                    resolve(0);
                }
            };
        });
    };

    // DBに追加する関数
    const iconChange20250806DbAdd = async (name, data, url, sort, ptn) => await new Promise(async resolve => {

        if (!sort) {
            sort = await iconChange20250806DbGetMaxSort() + 1;
        }

        const transaction = iconChange20250806Db.transaction(["iconChange20250806"], "readwrite");
        const store = transaction.objectStore("iconChange20250806");
        const result = store.add({
            name : name,
            data: data,
            url: url,
            sort: sort,
            ptn: ptn
        });
        result.onsuccess = async () => {
            const id = event.target.result;
            const aaa = await getAll();
            resolve(id);
        }
    });

    const iconChange20250806DbPut = (id, targetName, targetValue) => {
        return new Promise((resolve, reject) => {
            const transaction = iconChange20250806Db.transaction(["iconChange20250806"], "readwrite");
            const store = transaction.objectStore("iconChange20250806");
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const record = getRequest.result;
                record[targetName] = targetValue;
                const putRequest = store.put(record);
                putRequest.onsuccess = event => resolve(event.target.result);
            };
        });
    };
    const getImgData = async url => {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch failed');

        const arrayBuffer = await response.arrayBuffer();

        return new Blob([arrayBuffer]);
    };

    const view = document.createElement("div");
    view.setAttribute("popover", "");
    view.id = "popover1";

    document.body.append(view);

    const li = document.createElement("li");
    document.querySelector(".menu").prepend(li);

    const u = document.createElement("u");
    u.textContent = "アイコン設定";
    li.append(u);

    li.addEventListener("click", () => view.showPopover());

    const addElm = document.createElement("div");
    addElm.classList.add("item");
    addElm.textContent = "追加する";
    view.append(addElm);

    const createPopover = (className, title) => {
        const popover = document.createElement("div");
        popover.classList.add(className);
        popover.setAttribute("popover", "");
        document.body.prepend(popover);
        popover.addEventListener("toggle", () => {
            if (!popover.matches(":popover-open")) {
                view.showPopover();
            }
        });

        const titleElm = document.createElement("div");
        titleElm.textContent = title;
        titleElm.classList.add("popChildDiv");
        popover.append(titleElm);

        return popover;
    };

    const f = (e, c) => c(e);

    // URLから登録用popover
    const urlPopover = createPopover("urlPopover", "URLを入力してください");
    f(urlPopover, e => {
        const input = document.createElement("input");
        input.type = "text";
        e.append(input);

        const previewAreaElm = document.createElement("div");
        previewAreaElm.classList.add("popChildDiv");
        e.append(previewAreaElm);

        const previewElm = document.createElement("img");
        previewAreaElm.append(previewElm);
        previewElm.style.display = "none";

        input.addEventListener("input", async event => {
            if (event.target.value) {
                try {
                    const res = await(await fetch(input.value));
                    const blob = await res.blob();
                    await iconChange20250806DbPut(target.id, "data", blob);
                    await iconChange20250806DbPut(target.id, "url", input.value);
                    previewElm.src = event.target.value;
                    view.querySelector(".item[id='" + target.id + "']").querySelector("img").src = URL.createObjectURL(blob);
                    viewRef(target.name);
                } catch (e) {
                    alert("URLへの接続に失敗しました。ファイルまたはクリップボードから登録してください。");
                    urlPopover.hidePopover();
                }
                previewElm.style.display = "unset";
            } else {
                previewElm.style.display = "none";
            }
        });
    });

    // ファイルから登録用popover
    const filePopover = createPopover("filePopover", "ファイルを選択してください");
    f(filePopover, async e => {
        const input = document.createElement("input");
        input.type = "file";
        e.append(input);

        const previewAreaElm = document.createElement("div");
        previewAreaElm.classList.add("popChildDiv");
        e.append(previewAreaElm);

        const previewElm = document.createElement("img");
        previewAreaElm.append(previewElm);
        previewElm.style.display = "none";

        input.addEventListener("input", async () => {
            const blob = event.target.files[0]; // 選択した最初のファイル
            if (!blob) return;

            if (event.target.value) {
                previewElm.src = URL.createObjectURL(blob);
                previewElm.style.display = "unset";
                await iconChange20250806DbPut(target.id, "data", blob);
                await iconChange20250806DbPut(target.id, "url", "");
                view.querySelector(".item[id='" + target.id + "']").querySelector("img").src = URL.createObjectURL(blob);
                viewRef(target.name);
            } else {
                previewElm.style.display = "none";
            }
        });
    });

    // クリップボードから登録用popover
    const clipboardPopover = createPopover("clipboardPopover", "クリップボードを貼り付けてください");
    f(clipboardPopover, async e => {
        const input = document.createElement("input");
        input.type = "text";
        e.append(input);

        const previewAreaElm = document.createElement("div");
        previewAreaElm.classList.add("popChildDiv");
        e.append(previewAreaElm);

        const previewElm = document.createElement("img");
        previewAreaElm.append(previewElm);
        previewElm.style.display = "none";

        input.addEventListener("paste", async event => {

            input.value = "";
            previewElm.src = "";
            previewElm.style.display = "none";
            event.preventDefault();

            const items = await navigator.clipboard.read();

            for (const item of items) {
                for (const type of item.types) {
                    if (type.startsWith("image/")) {
                        // Blob オブジェクトを取得
                        const blob = await item.getType('image/png');
                        previewElm.src = URL.createObjectURL(blob);
                        previewElm.style.display = "unset";

                        await iconChange20250806DbPut(target.id, "data", blob);
                        await iconChange20250806DbPut(target.id, "url", "");
                        view.querySelector(".item[id='" + target.id + "']").querySelector("img").src = URL.createObjectURL(blob);

                        viewRef(target.name);
                        return;
                    }
                }
            }
        });
    });

    const bkChangePopover = createPopover("bkChangePopover", "背景の設定をして下さい。");
    f(bkChangePopover, async e => {

        /*
            メイン
                色
                画像
            サブ
                色
            背景情報をコピー、背景情報をペースト
        */
        const colorEdit = (title, name) => {
            const titleElm = document.createElement("div");
            titleElm.textContent = title;
            titleElm.classList.add("popChildDiv");
            e.append(titleElm);
            const colorElm = document.createElement("input");
            colorElm.type = "text";
            colorElm.setAttribute("data-jscolor", "");
            colorElm.setAttribute(name, "");
            e.append(colorElm);

            const colorPickerElm = document.createElement("div");
            e.append(colorPickerElm);

            target[name + "Picker"] = new jscolor(colorElm, {
                value: '#00ccff',
                position: 'right',
                palette: 'classic',
                container: colorPickerElm,
                smartPosition: false,
                forcePosition: true
            });
            colorElm.addEventListener("input", async e => {
                await iconChange20250806DbPut(target.id, name, e.target.value);
                target[name] = e.target.value;
                if (!e.target.value) {
                    target[name + "Picker"].fromString("#FFFFFF");
                    e.target.value = "";
                }
                viewRef(target.name);
            });
            colorElm.addEventListener("blur", e => {
                if (!target[name]) {
                    e.target.value = "";
                }
            });
        };

        colorEdit("メインカラー", "mainColor");
        colorEdit("サブカラー", "subColor");
        colorEdit("フォントカラー", "fontColor");

    });

    const addElmBaseAction = (id, name, data, sort, ptn) => {
        const itemElm = document.createElement("div");
        itemElm.classList.add("item");
        itemElm.setAttribute("id", id);
        itemElm.setAttribute("sort", sort);
        addElm.before(itemElm);

        const nameElm = document.createElement("input");
        nameElm.type = "text";
        nameElm.value = name;
        itemElm.append(nameElm);
        nameElm.addEventListener("input", () => {
            iconChange20250806DbPut(id, "name", nameElm.value);
            viewRef(nameElm.value);
        });

        // 画像表示
        const viewAreaElm = document.createElement("div");
        viewAreaElm.classList.add("view");
        viewAreaElm.setAttribute("ptn", ptn);
        itemElm.append(viewAreaElm);

        const viewElm = document.createElement("img");
        if (data) {
            viewElm.src = URL.createObjectURL(data);
        }
        viewAreaElm.append(viewElm);

        const operationElm = document.createElement("div");
        operationElm.classList.add("operation");
        itemElm.append(operationElm);

        // URL
        const inst1Elm = document.createElement("div");
        inst1Elm.textContent = "URL";
        operationElm.append(inst1Elm);
        inst1Elm.addEventListener("click", async () => {
            target.id = id;
            const result = await get(id);
            target.name = result.name;
            target.url = result.url;
            target.data = result.data;
            if (target.data) {
                urlPopover.querySelector("input").value = target.url;
                urlPopover.querySelector("img").src = URL.createObjectURL(target.data);
                urlPopover.querySelector("img").style.display = "unset";
            } else {
                urlPopover.querySelector("input").value = "";
                urlPopover.querySelector("img").src = "";
                urlPopover.querySelector("img").style.display = "none";
            }
            urlPopover.showPopover();
        });

        // ファイル
        const inst2Elm = document.createElement("div");
        inst2Elm.textContent = "ファイル";
        operationElm.append(inst2Elm);
        inst2Elm.addEventListener("click", async () => {
            target.id = id;
            const result = await get(id);
            target.name = result.name;
            target.url = result.url;
            target.data = result.data;
            if (target.data) {
                filePopover.querySelector("input").value = "";
                filePopover.querySelector("img").src = URL.createObjectURL(target.data);
                filePopover.querySelector("img").style.display = "unset";
            } else {
                filePopover.querySelector("input").value = "";
                filePopover.querySelector("img").src = "";
                filePopover.querySelector("img").style.display = "none";
            }
            filePopover.showPopover();
        });
        // クリップボード
        const inst3Elm = document.createElement("div");
        inst3Elm.textContent = "クリップボード";
        operationElm.append(inst3Elm);
        inst3Elm.addEventListener("click", async () => {
            target.id = id;
            const result = await get(id);
            target.name = result.name;
            target.url = result.url;
            target.data = result.data;
            if (target.data) {
                clipboardPopover.querySelector("img").src = URL.createObjectURL(target.data);
                clipboardPopover.querySelector("img").style.display = "unset";
            } else {
                clipboardPopover.querySelector("input").value = "";
                clipboardPopover.querySelector("img").src = "";
                clipboardPopover.querySelector("img").style.display = "none";
            }
            clipboardPopover.showPopover();
        });

        const operationSubElm = document.createElement("div");
        operationSubElm.classList.add("operationSub");
        itemElm.append(operationSubElm);

        const deleteElm = document.createElement("div");
        deleteElm.textContent = "削除する";
        deleteElm.classList.add("delete");
        operationSubElm.append(deleteElm);
        deleteElm.addEventListener("click", async () => {
            const psw = random3Char();
            const res = prompt("削除コード「" + psw + "」を入力してください。");
            if (psw === res) {

                const targetSort = Number(itemElm.getAttribute("sort"));

                const transaction = iconChange20250806Db.transaction("iconChange20250806", "readwrite");
                const store = transaction.objectStore("iconChange20250806");
                const deleteRequest = store.delete(id); // 削除したいキーを指定
                deleteRequest.onsuccess = function() {
                    viewRef(nameElm.value);
                    itemElm.remove();
                    alert("削除しました。");
                };

                const maxSort = await iconChange20250806DbGetMaxSort();
                for (let sort = maxSort; sort > targetSort; sort--) {
                    const elm = view.querySelector(".item[sort='" + sort + "']");
                    const id = Number(elm.getAttribute("id"));
                    // 繰り下げ
                    await iconChange20250806DbPut(id, "sort", sort - 1)
                    elm.setAttribute("sort", sort - 1);
                }

            } else {
                alert("削除を中断しました。");
            }
        });

        const operationSubSub1Elm = document.createElement("div");
        operationSubSub1Elm.classList.add("operationSubSub1");
        operationSubElm.append(operationSubSub1Elm);

        const bkChangeElm = document.createElement("div");
        bkChangeElm.textContent = "背景変更";
        operationSubSub1Elm.append(bkChangeElm);
        bkChangeElm.addEventListener("click", async () => {
            target.id = id;
            const result = await get(id);
            target.name = result.name;
            target.url = result.url;
            target.data = result.data;

            target.mainColor = result.mainColor;
            if (result.mainColor) {
                bkChangePopover.querySelector("[mainColor]").value = result.mainColor;
                target.mainColorPicker.fromString(result.mainColor);
            } else {
                target.mainColorPicker.fromString("#FFFFFF");
                bkChangePopover.querySelector("input").value = "";
            }

            target.subColor = result.subColor;
            if (result.subColor) {
                bkChangePopover.querySelector("[subColor]").value = result.subColor;
                target.subColorPicker.fromString(result.subColor);
            } else {
                target.subColorPicker.fromString("#FFFFFF");
                bkChangePopover.querySelector("input").value = "";
            }

            target.fontColor = result.fontColor;
            if (result.fontColor) {
                bkChangePopover.querySelector("[fontColor]").value = result.fontColor;
                target.fontColorPicker.fromString(result.fontColor);
            } else {
                target.fontColorPicker.fromString("#FFFFFF");
                bkChangePopover.querySelector("input").value = "";
            }

            bkChangePopover.showPopover();
        });

        const operationSubSub2Elm = document.createElement("div");
        operationSubSub2Elm.classList.add("operationSubSub2");
        operationSubElm.append(operationSubSub2Elm);

        const copyElm = document.createElement("div");
        copyElm.textContent = "コピーする";
        operationSubSub2Elm.append(copyElm);
        copyElm.addEventListener("click", async event => {
            const targetSort = Number(itemElm.getAttribute("sort"));
            const maxSort = await iconChange20250806DbGetMaxSort();
            for (let sort = maxSort; sort >= targetSort; sort--) {
                const elm = view.querySelector(".item[sort='" + sort + "']");
                const id = Number(elm.getAttribute("id"));
                if (sort === targetSort) {
                    // 複製
                    const result = await get(id);
                    // name, data, url, sort
                    const newId = await iconChange20250806DbAdd(result.name, result.data, result.url, sort + 1);
                    const newItemElm = addElmBaseAction(newId, result.name, result.data, sort + 1, result.ptn);
                    itemElm.after(newItemElm);
                } else {
                    // 繰り上げ
                    await iconChange20250806DbPut(id, "sort", sort + 1)
                    elm.setAttribute("sort", sort + 1);
                }
            }
        });

        const ptnElm = document.createElement("select");
        operationSubSub2Elm.append(ptnElm);

        const ptnElmAdd = (t, v) => {
            const ptnElmOption = document.createElement("option");
            ptnElmOption.textContent = t;
            ptnElmOption.value = v;
            ptnElm.append(ptnElmOption);
        };

        ptnElmAdd("全体表示", 0);
        ptnElmAdd("中央表示", 1);
        ptnElmAdd("上部表示", 2);
        ptnElmAdd("右側表示", 3);
        ptnElmAdd("下部表示", 4);
        ptnElmAdd("左側表示", 5);

        if (ptn === undefined) {
            ptnElm.value = 0;
        } else {
            ptnElm.value = ptn;
        }

        ptnElm.addEventListener("change", async event => {
            const ptn = Number(event.target.value);
            await iconChange20250806DbPut(id, "ptn", ptn);
            viewAreaElm.setAttribute("ptn", ptn);
            viewRef(nameElm.value);
        });

        const swapElm = document.createElement("div");
        swapElm.textContent = "↓";
        swapElm.classList.add("swap");
        operationSubElm.append(swapElm);
        swapElm.addEventListener("click", async () => {
            const targetElm = view.querySelector(".item[sort='" + (Number(itemElm.getAttribute("sort")) + 1) + "']");
            if (!targetElm) return;
            const targetElmId = Number(targetElm.getAttribute("id"));
            const targetElmResult = await get(targetElmId);

            const itemElmId = Number(itemElm.getAttribute("id"));
            const itemElmResult = await get(itemElmId);
            await iconChange20250806DbPut(targetElmResult.id, "sort", -1)
            await iconChange20250806DbPut(itemElmResult.id, "sort", targetElmResult.sort);
            await iconChange20250806DbPut(targetElmResult.id, "sort", itemElmResult.sort)

            itemElm.setAttribute("sort", targetElmResult.sort);
            targetElm.setAttribute("sort", itemElmResult.sort);
            targetElm.after(itemElm);

        });

        return itemElm;
    };

    addElm.addEventListener("click", async () => {
        const id = await iconChange20250806DbAdd("なまえ", null, null, null, "0");
        const result = await get(id);
        addElmBaseAction(id, "なまえ", null, result.sort, "0");
    });

    // 最初の一回だけ走るやつだにょ
    const getAll = () => {
        return new Promise((resolve, reject) => {
            const transaction = iconChange20250806Db.transaction("iconChange20250806", "readonly");
            const store = transaction.objectStore("iconChange20250806");
            const index = store.index("sortIndex"); // インデックスを取得

            const request = index.getAll(); // デフォルトは昇順
            request.onsuccess = function (event) {
                resolve(request.result);
            };
        });
    };

    const get = id => {
        return new Promise((resolve, reject) => {
            const transaction = iconChange20250806Db.transaction("iconChange20250806", "readonly");
            const store = transaction.objectStore("iconChange20250806");
            const request = store.get(id);
            request.onsuccess = function () {
                resolve(request.result);
            };
        });
    }

    (async () => {
        const list = await getAll();
        for (const e of list) {
            await addElmBaseAction(e.id, e.name, e.data, e.sort, e.ptn);
        }
    })();

    const random3Char = () => {
        const chars = '0123456789';
        let result = '';
        for (let i = 0; i < 1; i++) {
            const idx = Math.floor(Math.random() * chars.length);
            result += chars[idx];
        }
        return result;
    };

    (() => {
        const div = document.createElement("div");
        const userprof = document.querySelector(".userprof");
        userprof.prepend(div);
        const imgElmg = userprof.querySelector("img");
        div.append(imgElmg);
        imgElmg.setAttribute("srcBk", imgElmg.src);
    })();

    // const viewRefSub = (data, ptn, dtFlg, e) => {
    const viewRefSub = (result, e) => {
        const data = result.data;
        const ptn = result.ptn;
        const dtFlg = e.tagName === "DT";
        const url = URL.createObjectURL(data);
        if (dtFlg) {
            if (e.getAttribute("set")) {
                e.querySelector("div").setAttribute("ptn", ptn);
                e.querySelector("div").querySelector("img").src = url;
            } else {
                e.style.background = "unset";
                e.setAttribute("set", "1");
                const div = document.createElement("div");
                e.prepend(div);
                const img = document.createElement("img");
                div.append(img);
                div.setAttribute("ptn", ptn);
                img.src = url;
            }
            const mainColor = result.mainColor;
            const subColor = result.subColor;
            const fontColor = result.fontColor;
            const dd = e.nextSibling;
            if (!dd.querySelector("img")) {
                const body = dd.querySelector(".body");
                if (mainColor) {
                    body.style.background = mainColor;
                } else {
                    body.style.background = "";
                }

                const subElm = dd.querySelector(".body").previousElementSibling;
                if (!subElm.getAttribute("background")) {
                    subElm.setAttribute("background", subElm.style.background);
                }
                if (subColor) {
                    subElm.style.background = subColor;
                } else {
                    subElm.style.background = subElm.getAttribute("background");
                }

                if (fontColor) {
                    body.style.color = fontColor;
                } else {
                    body.style.color = "";
                }
            }
        } else {
            e.querySelector("div").setAttribute("ptn", ptn);
            e.querySelector("img").src = url;
        }
    };
    const viewRef = (_name) => {
        if (_name) {
            // nameが設定されている場合の処理
            for (const e of [...talks.querySelectorAll("dt"), document.querySelector(".userprof")]) {
                const dtFlg = e.tagName === "DT";
                const name = dtFlg ? e.textContent : e.querySelector(".profname").textContent;
                // _nameが空じゃないかつ、_nameとnameが異なる場合はスキップ
                if (name !== _name) continue;
                const transaction = iconChange20250806Db.transaction(["iconChange20250806"], "readonly");
                const store = transaction.objectStore("iconChange20250806");
                const index = store.index("nameIndex");
                const request = index.get(name);
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (result && result.data) {
                        viewRefSub(result, e);
                        e.setAttribute("set", 1);
                    }
                };
            }
        } else {
            // nameが設定されていない場合の処理
            for (const e of [...talks.querySelectorAll("dt"), document.querySelector(".userprof")]) {
                if (e.getAttribute("set")) continue;
                const dtFlg = e.tagName === "DT";
                const name = dtFlg ? e.textContent : e.querySelector(".profname").textContent;
                const transaction = iconChange20250806Db.transaction(["iconChange20250806"], "readonly");
                const store = transaction.objectStore("iconChange20250806");
                const index = store.index("nameIndex");
                const request = index.get(name);
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (result && result.data) {
                        viewRefSub(result, e);
                    }
                };
            }
        }
        // 存在しないやつの設定解除
        for (const e of [...talks.querySelectorAll("dt"), document.querySelector(".userprof")]) {
            if (!e.getAttribute("set")) continue;
            const dtFlg = e.tagName === "DT";
            const name = dtFlg ? e.textContent : e.querySelector(".profname").textContent;
            const transaction = iconChange20250806Db.transaction(["iconChange20250806"], "readonly");
            const store = transaction.objectStore("iconChange20250806");
            const index = store.index("nameIndex");
            const request = index.get(name);
            request.onsuccess = event => {
                const result = event.target.result;
                if (!result?.data) {
                    if (dtFlg) {
                        e.style.background = "";
                        e.removeAttribute("set");
                        e.querySelector("div").remove();
                    } else {
                        e.querySelector("img").src = e.querySelector("img").getAttribute("srcBk");
                    }

                }
            };
        }

    };

    viewRef();
    new MutationObserver(e=>{
        viewRef();
    }).observe(talks,{childList:true});
})();
