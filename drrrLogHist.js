(async () => {

  // 残す件数
  const talkCount = 30;

  const dbName = 'MyDatabase4';
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
    for (const dl of Array.from(document.querySelectorAll("dl")).reverse()) {
      try {
        await saveData({
          id: dl.id,
          outerHTML: dl.outerHTML,
          name: dl.querySelector("dt")?.textContent,
          message: dl.querySelector(".body")?.textContent,
        });
      } catch {

      }
    }
    for (const dlData of await getAllData()) {
      console.log("dlData", dlData.name, dlData.message);

      if (!document.querySelector(`dl[id="${dlData.id}"]`)) {
        if (talks.querySelectorAll("dl").length > talkCount) {
          await deleteData(dlData.no);
        } else {
          console.log("追加", dlData);
          const parser = new DOMParser();
          const doc = parser.parseFromString(dlData.outerHTML, "text/html");
          talks.append(doc.body.firstChild);
        }
      }
    }
  }
  f();
  new MutationObserver(mutationsList=>{
    f();
  }).observe(talks,{childList:true});

})();
