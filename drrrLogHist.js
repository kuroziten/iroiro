// 表示する件数
const talkCount = 1000;

/** チャットを作る関数 */
const createChat = (talkData) => {
    const dl = document.createElement("dl");
    dl.classList.add("talk");
    dl.classList.add(talkData.icon);
    dl.id = talkData.id;
    dl.innerHTML = `
<dt>name</dt>
<dd>
<div class="bubble" style="margin: -16px 0px 0px;"><div style="position: relative; float: left; margin: 0px; top: 39px; left: -3px; width: 22px; height: 16px; "><div style="width: 100%; height: 100%; background: transparent url(&quot;https://drrrkari.com/css/tail.png&quot;);"></div></div>
<p class="body" style="margin: 0px 0px 0px 15px;">message</p>
</div>
</dd>`;
    talks.append(dl);
    dl.querySelector("dt").textContent = talkData.name;
    dl.querySelector(".body").textContent = talkData.message;
    const target = dl.querySelector(".bubble").querySelector("div");
    const url = getComputedStyle(dl.querySelector(".body")).backgroundImage;
    target.style.background = url;
}
/** チャット（画像）を作る関数 */
const createImgChat = (talkData) => {
    const dl = document.createElement("dl");
    dl.classList.add("talk");
    dl.classList.add(talkData.icon);
    dl.id = talkData.id;
    dl.innerHTML = `
<dt>name</dt><dd>
<p style="margin-left:30px;">
<a href="${talkData.message}" target="_blank">
<img src="${talkData.image}" style="max-width: 200px;max-height: 200px;">
</a></p>
</dd>`;
    dl.querySelector("dt").textContent = talkData.name;
    console.log(dl);
    talks.append(dl);
}
/** チャット（システム）を作る関数 */
const createImgSystem = (talkData) => {
    const div = document.createElement("div");
    div.classList.add("talk");
    div.classList.add("system");
    div.id = talkData.id;
    div.textContent = talkData.message;
    talks.append(div);
}

(async () => {

    const dbName = 'MyDatabase5';
    const storeName = 'MyStore';

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    console.log("新しくしました");
                    const store = db.createObjectStore('MyStore', {
                        keyPath: 'no',
                        autoIncrement: true // ← これで自動ID採番
                    });
                    store.createIndex('id', 'id', { unique: true });
                }
            };

            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });
    }
    async function saveData(data) {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(data); // 既に同じIDがあれば上書きされる
        await tx.done;
    }
    async function getData(id) {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const result = await store.get(id);
        return result;
    }
    async function deleteData(id) {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(id);
        await tx.done;
    }
    async function getAllData() {
        return await new Promise(async r => {
            const db = await openDB();
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const result = await store.getAll();
            result.onsuccess = async (event) => {
                r(event.target.result);
            };

        });
    }

    const f = async () => {
        const talksData =(await(await fetch("/ajax.php", {method: "POST"})).json()).talks;
        for (const talkData of talksData) {
            try {
                await saveData(talkData);
                //              console.log("DBに追加", talkData);
            } catch {}
        }
        const allData = (await getAllData()).reverse();
        const allElm = document.querySelectorAll("dl");
        const lastIndex = talkCount > allData.length ? allData.length : talkCount;
        for (let i = allElm.length; i < lastIndex; i++) {
            const talkData = allData[i];
            const elm = allElm[i];
            if (talkData.image) {
                console.log("これは画像です", talkData.image);
                createImgChat(talkData);
            } else if (talkData.uid === "0") {
                console.log("これはシステムです", talkData.message);
                createImgSystem(talkData);
            } else {
                console.log("これはチャットです", talkData.message);
                createChat(talkData);
            }
        }

    }
    await f();
    let processFlg = false;
    new MutationObserver(async mutationsList=>{
        if (processFlg) return;
        processFlg = true;
        await f();
        processFlg = false;
    }).observe(talks,{childList:true});
})();
