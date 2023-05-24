const iof = async socket => {
    const kotChatBodyList = document.querySelector("kot-chat-body-list");
    const textareaEl = document.querySelector("kot-chat-my-input");
    const postAction = () => {
        let data = textareaEl.innerText;
        if (!localStorage.getItem('name'))
            data = data.replace("名前を入力して下さい：", "");

        if (!data.replace("\n", ""))
            return null;
        textareaEl.querySelectorAll("div")[0].style.display = "none";
        textareaEl.querySelectorAll("div")[1].setAttribute("contenteditable", true);
        textareaEl.querySelectorAll("div")[1].innerHTML = "";
        textareaEl.style.height = "auto";
        textareaEl.style.height = `${this.scrollHeight}px`;
        if (!localStorage.getItem('name')) {
            localStorage.setItem('name', data);
            // 入室
            socket.emit('chat', {type: 0, name: data, data: data});
        } else {
            // チャット処理
            socket.emit('chat', {type: 2, name: localStorage.getItem('name'), data: data});
        }
        return data;
    };
    textareaEl.querySelectorAll("div")[2].addEventListener("click", () => {
        postAction();
    });
    const dbName = 'myDatabase';
    const dbVersion = 1;
    const tableName = "TEST";
    const kotChatBodyTmp = document.createElement("kot-chat-body");
    const kotChatBodyIdTmp = document.createElement("kot-chat-body-id");
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    /**
     * 自分の保持しているデータを全員に共有
     * めんどくさいから全部まとめてやる
     */
     const getDBAll = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDbOpen();
            request.onsuccess = event => {
                const db = event.target.result;
                const transaction = db.transaction(tableName, "readonly");
                const objectStore = transaction.objectStore(tableName);
                const index = objectStore.index("DATE");
                const request = index.openCursor(null, "prev"); // 降順にソートするために "prev" を指定
                const records = [];
                request.onsuccess = event => {
                    const cursor = event.target.result;
                    if (cursor) {
                        records.push(cursor.value);
                        cursor.continue();
                    } else {
                        // DATEを新しい順に並び替える
                        records.sort((a, b) => {
                            const dateA = new Date(a.DATE).getTime();
                            const dateB = new Date(b.DATE).getTime();
                            return dateA - dateB;
                        });

                        resolve(records); // データの取得後にresolveする
                    }
                };
                request.onerror = () => reject(new Error('キーの取得に失敗しました'));
                transaction.onerror = () => reject(new Error('トランザクション中にエラーが発生しました'));
                db.close();
            };
            request.onerror = () => reject(new Error('データベースのオープンに失敗しました'));
        });
    };


    /**
     * データが不備の場合、削除して画面リロード
     */
    const reset = () => {
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = () => {};//console.log("データベースの削除に成功しました");
        request.onerror = () => console.error("データベースの削除中にエラーが発生しました");
        window.location.reload();
    };


    const indexedDbOpen = () => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('TEST')) {
                const objectStore = db.createObjectStore('TEST', { keyPath: 'KEY' });
                objectStore.createIndex('DATE', 'DATE');
            }
        };
        return request;
    };
    /**
     * 画面を開いた時の表示処理
     */
    const viewAddData = (arg, isFirstView) => {
        const kotChatName = document.createElement("kot-chat-name");
        const kotChatBody = document.createElement("kot-chat-body");
        const key = arg.key ?? arg.KEY;
        const type = arg.type ?? arg.TYPE;
        const name = arg.name ?? arg.NAME;
        const data = arg.data ?? arg.DATA;
        let date = arg.date ?? arg.DATE ?? "";
        if (date != "") {
            const currentDate = new Date(date);
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            date = formattedDate;
        }

        switch (type) {
            /** 1: 画像送信 */
            case 1:
                kotChatBody.style.display = "flex";
                kotChatName.textContent = `${date ?? ""} [${name}]`;
                kotChatBody.append(kotChatName);
                const img = document.createElement("img");
                img.src = data;
                kotChatBody.append(img);
                break;
            /** 0: 入室 */
            case 0:
                const div = document.createElement("div");
                div.innerText = date ?? "" + data[0] != "\n"
                    ? data
                    : data.split("").slice(1).join('');
                kotChatBody.append(div);
                break
            /** 2: 発言 */
            case 2:
                kotChatName.textContent = `${date ?? ""} [${name}]`;
                kotChatBody.append(kotChatName);
                let fflg = true;
                const dataSize = data.split("\n").length;
                for (d of data.split("\n")) {
                    if (dataSize == 2 && fflg && !d) {
                        fflg = false;
                    }
                    else if (fflg) {
                        const span = document.createElement("span");
                        span.innerText = "# " + d;
                        kotChatBody.append(span);
                        fflg = false;
                    } else {
                        const div = document.createElement("div");
                        div.innerText = d;
                        kotChatBody.append(div);
                    }
                }
                break;
        }
        // 入室、画像送信、チャット送信の場合
        if ([0, 1, 2].includes(type)) {
            const kotChatBodyId = kotChatBodyIdTmp.cloneNode(true);
            kotChatBodyId.innerText = key;
            kotChatBody.prepend(kotChatBodyId);
            kotChatBodyList.prepend(kotChatBody);
            // if (!isFirstView)
            //     addDB(key, type, name, data);
        }
        return kotChatBody;
    };
    if (!localStorage.getItem('name'))
        localStorage.setItem('status', "login");
    else {
        textareaEl.querySelectorAll("div")[0].style.display = "none";
        textareaEl.querySelectorAll("div")[1].setAttribute("contenteditable", true);
        textareaEl.querySelectorAll("div")[1].innerHTML = "";
        textareaEl.style.height = "auto";
        textareaEl.style.height = `${this.scrollHeight}px`;

        const records = await getDBAll();
        for (const arg of records)
            viewAddData(arg, true);
    }

    /**
     * textareaの高さを計算して指定する関数
     */
    const setTextareaHeight = () => {
        try {
            this.currentTarget.style.height = "auto";
            this.currentTarget.style.height = `${this.scrollHeight}px`;
        } catch { }
    }

    // デフォルト値としてスタイル属性を付与
    textareaEl.setAttribute("style", `height: ${textareaEl.scrollHeight}px;`);
    // inputイベントが発生するたびに関数呼び出し
    textareaEl.addEventListener("input", setTextareaHeight);

    const keydownEvent = event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
            if (event.code === "Enter") {
                return postAction();
            }
        }
        return null;
    }

    /**
     * IndexedDbに登録するやつ
     *
     * @param {*} key  キー
     * @param {*} name 所有者名
     * @param {*} data base64の画像データ
     */
    const addDB = (key, type, name, data, date) => {
        const request = indexedDbOpen();

        request.onsuccess = event => {
            const db = event.target.result;
            const transaction = db.transaction(['TEST'], 'readwrite');
            const store = transaction.objectStore('TEST');
            const getRequest = store.getKey(key);

            getRequest.onsuccess = event => {
                const existingKey = event.target.result;
                if (existingKey !== undefined) {
                    db.close();
                    return;
                }

                const addRequest = store.add({ KEY: key, TYPE: type, NAME: name, DATA: data, DATE: date ?? new Date() });
                addRequest.onsuccess = () => {};// console.log('データの追加に成功しました');
                addRequest.onerror = () => console.log('データの追加に失敗しました');
                transaction.oncomplete = () => {};//console.log('トランザクションが完了しました');
                transaction.onerror = () => console.log('トランザクション中にエラーが発生しました');
                db.close();
            };

            getRequest.onerror = () => {
                console.log('キーの取得に失敗しました');
                db.close();
            };
        };

        request.onerror = () => console.log('データベースのオープンに失敗しました');

    }

    /**
     * DBから取得するやつ
     * プロミスなので取得する時は await が必要
     * @param {*} key
     * @returns
     */
    const getDB = key => {
        return new Promise((resolve, reject) => {
            const request = indexedDbOpen();

            request.onsuccess = event => {
                const db = event.target.result;
                const transaction = db.transaction(['TEST'], 'readwrite');
                const store = transaction.objectStore('TEST');
                const getRequest = store.get(key);
                getRequest.onsuccess = event => resolve(event.target.result);
                getRequest.onerror = () => reject(new Error('データの取得に失敗しました'));
                transaction.onerror = () => reject(new Error('トランザクション中にエラーが発生しました'));
                db.close();
            };
            request.onerror = () => {
                reject(new Error('データベースのオープンに失敗しました'));
            };
        });
    };

    /* クライアントのJS */
    document.addEventListener('keydown', keydownEvent, false);
    document.querySelector("input").addEventListener("change", e => {
        const name = localStorage.getItem('name');
        if (!name)
            return alert("名前が設定されていません");

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = event => {
            const base64Data = event.target.result;
            socket.emit('chat', { type: 1, name: name, data: base64Data });
        };

        reader.readAsDataURL(file);
        e.target.value = null;
        e.target.files = null;
    });

    socket.on("chat", arg => {
        if ([0, 1, 2].includes(arg.type)) {
            const key = arg.key;
            const type = arg.type;
            const name = arg.name;
            const data = arg.data;
            addDB(key, type, name, data);
        }
    });
    socket.on("presentation", arg => {
        const key = arg.KEY;
        const type = arg.TYPE;
        const name = arg.NAME;
        const data = arg.DATA;
        const date = arg.DATE;
        addDB(key, type, name, data, date);
    });

    setInterval(async () => {

        const records = await getDBAll();
        let kotChatBodyList2 = document.body.querySelectorAll("kot-chat-body");
        // socket.emit('presentation', records);
        if (records.length < kotChatBodyList2.length) {
            document.body.querySelector("kot-chat-body").parentNode.innerHTML = "";
        }
        kotChatBodyList2 = document.body.querySelectorAll("kot-chat-body");
        if (records.length > kotChatBodyList2.length) {
            for (let i = 0; i < records.length - kotChatBodyList2.length; i++)
                kotChatBodyList.prepend(kotChatBodyTmp.cloneNode(true));
            for (let i = 0; i < records.length; i++) {
                const arg = records[i];
                const kotChatBody = document.body.querySelectorAll("kot-chat-body")[document.body.querySelectorAll("kot-chat-body").length - i - 1];
                if (!kotChatBody.querySelector("kot-chat-body-id")
                        || kotChatBody.querySelector("kot-chat-body-id").innerText != arg.KEY) {
                     try {
                        kotChatBody.parentNode.replaceChild(viewAddData(arg, true), kotChatBody);
                     } catch (error) {
                        console.log(error);
                     }
                }
            }

        }

    }, 2000);
    const presentation = async () => {
        const records = await getDBAll();
        for (const record of records) {
            socket.emit('presentation', record);
            await sleep(500);
        }
        await presentation();
    };
    presentation();
};
