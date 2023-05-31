const iof = async socket => {

    /********************************************************************************************************************/
    /* フィールド定数 */
    /********************************************************************************************************************/
    const dbName = 'myDatabase';
    const dbVersion = 1;
    const tableName = "TEST";
    const INCEXED_DB_QUEUE_TABLE = "QUEUE_TABLE";

    /********************************************************************************************************************/
    /* 共通要素変数 */
    /********************************************************************************************************************/
    const kotChatBodyTmp = document.createElement("kot-chat-body");
    const kotChatBodyIdTmp = document.createElement("kot-chat-body-id");
    const kotChatBodyList = document.querySelector("kot-chat-body-list");
    const textareaEl = document.querySelector("kot-chat-my-input");


    /********************************************************************************************************************/
    /* 通常関数系 */
    /********************************************************************************************************************/

    /**
     * デバッグログ用
     */
    const log = (functionName, option) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate, functionName, option);
    };

    /**
     * スリープ関数
     * @param {*} milliseconds 待機ミリ秒
     * @returns
     */
    const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

    /**
     * ランダムな文字列を返却する関数
     */
    const generateRandomString = length => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    };

    /**
     * YoutubeURLかチェック
     */
        const isYoutubeURL = url =>  {
        let leftKey = "https://www.youtube.com/watch?v=";
        if (url.startsWith(leftKey)) {
            return url.slice(leftKey.length, leftKey.length + 11);
        }
        leftKey = "https://youtu.be/";
        if (url.startsWith(leftKey)) {
            return url.slice(leftKey.length, leftKey.length + 11);
        }
    };

    /**
     * textareaの高さを計算して指定する関数
     */
     const setTextareaHeight = () => {
        try {
            textareaEl.style.height = "auto";
            textareaEl.style.height = `${textareaEl.scrollHeight}px`;
        } catch (e) {
            console.log(e)
        }
    };

    /**
     * 「QUEUE_TABLE」の定期アクション処理
     **/
    const queueAction = async () => {
        // データ一覧取得
        let queueTableRecords = await getDataAllQueueTable();
        log("start: queueAction: " + queueTableRecords.length + " 件");

        // レコードの再チェック
        let deleteRecordQueueIdList = []; // 削除対象リスト
        for (const queueTableRecord of queueTableRecords) {

            const queueId = queueTableRecord.QUEUE_ID;

            // 再チェック対象のキーリストの取得
            const keys = queueTableRecord.KEYS;

            if (!keys || keys[0].length == 20) {
                // 再チェック結果のキーリストの取得
                let keys2 = await dataCheckKeys2(keys);

                // 再チェック結果のキーリストが0件の場合
                if (!(keys2?.length)) {
                    // 削除対象リストに追加
                    deleteRecordQueueIdList.push(queueId);
                }
                // キーリストの数が一致しない場合
                else if (keys.length != keys2.length) {
                    // 対象のレコードを再チェック結果のキーリストで更新する
                    await putQueueTableSingle(queueId, keys2, new Date());
                }
            } else {
                // 変なデータの場合も削除対象リストに追加
                deleteRecordQueueIdList.push(queueId);
            }
        }

        // 削除対象リストのレコードの削除
        deleteRecordQueueIdList.forEach(targetQueueId => deleteQueueTableSingle(targetQueueId));

        // データ一覧再取得
        queueTableRecords = await getDataAllQueueTable();

        // レコードが取得出来た場合
        if (queueTableRecords?.length) {

            // 対象レコードの取得
            let tableRecords = queueTableRecords[0];

            // 色々取得
            const queueId = tableRecords.QUEUE_ID;
            const keys = tableRecords.KEYS;

            // レコードのリクエスト処理実行
            log("queueAction: emit[" + queueId + "]");
            socket.emit("please", { queueId: queueId, userId: userId, toUserId: tableRecords.TO_USER_ID, records: keys });
            log("queueAction: 5秒スリープ開始");
            await sleep(5000);
            log("queueAction: 5秒スリープ終了");
            // レコードの再取得を行い、データが更新されていた場合
            const newQueueTable = await getQueueTableSingle(queueId);
            if (newQueueTable && newQueueTable.STATUS == 1) {
                // レコード数 * 1 秒スリープ
                const sleepTime = (keys.length > 9 ? 10 : keys.length) * 500;
                log("queueAction: " + sleepTime + " ミリ秒待機開始");
                await sleep(sleepTime);
                log("queueAction: " + sleepTime + " ミリ秒待機終了");
            }
            // レコードのデータの削除
            await deleteQueueTableSingle(queueId);
        }

        // 5秒後に再実行
        await sleep(5000);
        await queueAction();
    };

    /********************************************************************************************************************/
    /* indexedDB関連 */
    /********************************************************************************************************************/
    /**
     * DBを便利に使うための自作関数
     **/
    const run = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, dbVersion);
            request.onupgradeneeded = event =>
                event.target.result
                .createObjectStore(tableName, {keyPath:'KEY'})
                .createIndex('DATE', 'DATE');
            request.onsuccess = event => {
                const db = event.target.result;
                const transaction = db.transaction(tableName, 'readwrite');
                const store = transaction.objectStore(tableName);
                resolve({
                    db: db,
                    transaction: transaction,
                    store: store
                });
            };
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                reject(null);
            };
        });
    };

    /**
     * キーを基にデータの取得
     */
    const getData2 = key => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await run();
            // SQLみたいなの実行
            const request = dbObj.store.get(key);
            // 正常終了
            request.onsuccess = event => {
                // リザルトの返却
                resolve(event.target.result);
            };
            // DBを閉じる
            dbObj.transaction.oncomplete = () => dbObj.db.close();
            // 異常終了
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                // nullの返却
                resolve(null);
            };
        });
    };

    /**
     * キーを基に全データの取得
     */
    const getAllData2 = keys => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await run();
            // 正常終了
            const list = [];
            keys.forEach(key => {
                const request = dbObj.store.get(key);
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (result) {
                        list.push(result);
                    }
                };
                request.onerror = function(event) {
                    console.error('Get request error: ' + event.target.error);
                    resolve(-1);
                };
                // 異常終了
                request.onerror = event => {
                    console.error('Database error: ' + event.target.errorCode)
                    // nullの返却
                    resolve(-1);
                };
            });
            // DBを閉じる
            dbObj.transaction.oncomplete = () => {
                dbObj.db.close();
                resolve(list);
            }
        });
    };

    /**
     * 全データを取得
     */
     const getDataAll2 = () => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await run();
            // SQLみたいなの実行
            const request = dbObj.store.openCursor();
            // 正常終了
            const list = [];
            request.onsuccess = event => {
                //
                const cursor = event.target.result;
                if (cursor) {
                    list.push(cursor.value);
                    cursor.continue();
                } else {
                    // リストの返却
                    resolve(list);
                }
            };
            // 異常終了
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                // nullの返却
                resolve(event.target.errorCode);
                reset();
            };
            // DBを閉じる
            dbObj.transaction.oncomplete = () => dbObj.db.close();
        });
    };

    /**
     * 全データのキーを取得
     */
    const getDataAllKeys2 = () => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await run();
            // SQLみたいなの実行
            const request = dbObj.store.openCursor();
            // 正常終了
            const list = [];
            request.onsuccess = event => {
                //
                const cursor = event.target.result;
                if (cursor) {
                    list.push(cursor.value.KEY);
                    cursor.continue();
                } else {
                    // リストの返却
                    resolve(list);
                }
            };
            // DBを閉じる
            dbObj.transaction.oncomplete = () => dbObj.db.close();
            // 異常終了
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                // nullの返却
                resolve(null);
            };
        });
    };

    /**
     * データの登録
     */
     const setData2 = (key, type, name, data, date) => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await run();
            // SQLみたいなの実行
            const request = dbObj.store.getKey(key);
            // 正常終了
            request.onsuccess = event => {
                if (event.target.result) {
                    dbObj.db.close();
                    resolve(-1);
                    return;
                }
                const request =
                    dbObj.store.add({ KEY: key, TYPE: type, NAME: name, DATA: data, DATE: date });
                request.onsuccess = () => resolve(1);// console.log('データの追加に成功しました');
                request.onerror = () => {
                    console.log('データの追加に失敗しました');
                    resolve(-1);
                }
            };
            // 異常終了
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                // -1の返却
                resolve(-1);
            };

            // DBを閉じる
            dbObj.transaction.oncomplete = () =>
                dbObj.db.close();//console.log('トランザクションが完了しました');
            dbObj.transaction.onerror = () => {
                console.log('トランザクション中にエラーが発生しました');
                resolve(0);
            }
        });
    };

    const setDataAll2 = records => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await run();
            records.forEach(record => {

                const key = record.KEY;
                const type = record.TYPE;
                const name = record.NAME;
                const data = record.DATA;
                const date = record.DATE;

                // SQLみたいなの実行
                const request = dbObj.store.getKey(key);
                // 正常終了
                request.onsuccess = event => {
                    if (event.target.result) {
                        dbObj.db.close();
                        resolve(-1);
                        return;
                    }
                    const request =
                        dbObj.store.add({ KEY: key, TYPE: type, NAME: name, DATA: data, DATE: date });
                    request.onsuccess = () => resolve(1);// console.log('データの追加に成功しました');
                    request.onerror = () => {
                        console.log('データの追加に失敗しました');
                        resolve(-1);
                    }
                };
                // 異常終了
                request.onerror = event => {
                    console.error('Database error: ' + event.target.errorCode)
                    // -1の返却
                    resolve(-1);
                };
            });

            // DBを閉じる
            dbObj.transaction.oncomplete = () =>
                dbObj.db.close();//console.log('トランザクションが完了しました');
            dbObj.transaction.onerror = () => {
                console.log('トランザクション中にエラーが発生しました');
                resolve(0);
            }
        });
    };

    /**
     * キーのリストから知らないキーの配列を返却
     */
    const dataCheckKeys2 = keys => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await run();
            // SQLみたいなの実行
            const request = dbObj.store.get(keys);
            // 正常終了
            const list = [];
            keys.forEach(key => {
                const request = dbObj.store.get(key);
                request.onsuccess = function(event) {
                    if (!event.target.result) {
                        list.push(key);
                    }
                };
                request.onerror = function(event) {
                    console.log('Get request error: ' + event.target.error);
                    resolve(null);
                };
            });
            // 異常終了
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                // nullの返却
                resolve(null);
            };
            // DBを閉じる
            dbObj.transaction.oncomplete = () => {
                dbObj.db.close();
                resolve(list);
            }
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

    /**
     * DBを便利に使うための自作関数
     * ※「QUEUE_TABLE」専用
     **/
    const runQueueTable = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(INCEXED_DB_QUEUE_TABLE, dbVersion);

            request.onupgradeneeded = event =>
                event.target.result
                .createObjectStore(INCEXED_DB_QUEUE_TABLE, {keyPath:'QUEUE_ID'})
                .createIndex('QUEUE_ID', 'QUEUE_ID');
            request.onsuccess = event => {
                const db = event.target.result;
                const transaction = db.transaction(INCEXED_DB_QUEUE_TABLE, 'readwrite');
                const store = transaction.objectStore(INCEXED_DB_QUEUE_TABLE);
                resolve({
                    db: db,
                    transaction: transaction,
                    store: store
                });
            };
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                reject(null);
            };
        });
    };

    /**
     * 「QUEUE_TABLE」テーブルの全データを取得
     */
    const getDataAllQueueTable = () => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await runQueueTable();
            // SQLみたいなの実行
            const request = dbObj.store.openCursor();
            // 正常終了
            const list = [];
            request.onsuccess = event => {
                //
                const cursor = event.target.result;
                if (cursor) {
                    list.push(cursor.value);
                    cursor.continue();
                } else {
                    // リストの返却
                    resolve(list);
                }
            };
            // 異常終了
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                // nullの返却
                resolve(event.target.errorCode);
                reset();
            };
            // DBを閉じる
            dbObj.transaction.oncomplete = () => dbObj.db.close();
        });
    };

    /**
     * 「QUEUE_TABLE」テーブルのデータを取得
     */
    const getQueueTableSingle = queueId => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await runQueueTable();
            // SQLみたいなの実行
            const request = dbObj.store.get(queueId);
            request.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    // リザルトの返却
                    resolve(event.target.result);
                } else {
                    // リストの返却
                    resolve(-1);
                }
            };
            // 異常終了
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                // nullの返却
                resolve(-1);
                reset();
            };
            // DBを閉じる
            dbObj.transaction.oncomplete = () => dbObj.db.close();
        });
    };

    /**
     * 「QUEUE_TABLE」テーブルにデータの登録
     * QUEUE_ID
     * KEYS
     * STATUS (0:リクエスト送信前、1:リクエスト送信中、2:リクエスト受信中)
     * TO_USER_ID
     * UPDT_DATE
     * return
     *   -2: 既にデータが存在する
     *   -1: 異常終了
     *    0: トランザクションエラー
     *    1: 正常終了
     */
    const setQueueTableSingle = (queueId, keys, status, toUserId, updtDate) => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await runQueueTable();
            // SQLみたいなの実行
            const request = dbObj.store.get(queueId);
            // 正常終了
            request.onsuccess = event => {
                if (event.target.result) {
                    dbObj.db.close();
                    resolve(-3);
                    return;
                }
                const request =
                    dbObj.store.add(
                        { QUEUE_ID: queueId, KEYS: keys, STATUS: status, TO_USER_ID: toUserId, UPDT_DATE: updtDate }
                    );
                request.onsuccess = () => resolve(1);// console.log('データの追加に成功しました');
                request.onerror = () => {
                    console.log('データの追加に失敗しました');
                    resolve(-2);
                }
            };
            // 異常終了
            request.onerror = event => {
                console.error('Database error: ' + event.target.errorCode)
                // -1の返却
                resolve(-1);
            };

            // DBを閉じる
            dbObj.transaction.oncomplete = () =>
                dbObj.db.close();//console.log('トランザクションが完了しました');
            dbObj.transaction.onerror = () => {
                console.log('トランザクション中にエラーが発生しました');
                resolve(0);
            }
        });
    };

    /**
     * 「QUEUE_TABLE」テーブルのデータの更新
     * return
     *   -2: 既にデータが存在する
     *   -1: 異常終了
     *    0: トランザクションエラー
     *    1: 正常終了
     */
    const putQueueTableSingle = (queueId, keys, updtDate) => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await runQueueTable();
            // SQLみたいなの実行
            const request = dbObj.store.get(queueId);
            // 正常終了
            request.onsuccess = event => {
                const queueTable = event.target.result;
                if (!event.target.result) {
                    console.log('更新するデータが見つかりませんでした(putQueueTableSingle)：' + queueId);
                    dbObj.db.close();
                    resolve(-3);
                    return;
                }
                queueTable.KEYS = keys;
                queueTable.UPDT_DATE = updtDate;
                const request = dbObj.store.put(queueTable);
                request.onsuccess = () => resolve(1);
                request.onerror = event => {
                    console.log('データの更新に失敗しました：' + event.target.errorCode);
                    resolve(-2);
                }
            };
            // 異常終了
            request.onerror = event => {
                console.log('データの更新に失敗しました：' + event.target.errorCode);
                // -1の返却
                resolve(-1);
            };

            // DBを閉じる
            dbObj.transaction.oncomplete = () => dbObj.db.close();
            dbObj.transaction.onerror = () => {
                console.log('トランザクション中にエラーが発生しました');
                resolve(0);
            }
        });
    };

    /**
     * 「QUEUE_TABLE」テーブルのデータの更新
     * return
     *   -2: 既にデータが存在する
     *   -1: 異常終了
     *    0: トランザクションエラー
     *    1: 正常終了
     */
        const putQueueTableOfStatus = (queueId, status, updtDate) => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await runQueueTable();
            // SQLみたいなの実行
            const request = dbObj.store.get(queueId);
            // 正常終了
            request.onsuccess = event => {
                const queueTable = event.target.result;
                if (!event.target.result) {
                    console.log('更新するデータが見つかりませんでした(putQueueTableOfStatus)' + queueId);
                    dbObj.db.close();
                    resolve(-3);
                    return;
                }
                queueTable.STATUS = status;
                queueTable.UPDT_DATE = updtDate;

                const request = dbObj.store.put(queueTable);
                request.onsuccess = () => resolve(1);
                request.onerror = event => {
                    console.log('データの更新に失敗しました：' + event.target.errorCode);
                    resolve(-2);
                }
            };
            // 異常終了
            request.onerror = event => {
                console.log('データの更新に失敗しました：' + event.target.errorCode);
                // -1の返却
                resolve(-1);
            };

            // DBを閉じる
            dbObj.transaction.oncomplete = () => dbObj.db.close();
            dbObj.transaction.onerror = () => {
                console.log('トランザクション中にエラーが発生しました');
                resolve(0);
            }
        });
    };

    /**
     * 「QUEUE_TABLE」テーブルのデータの削除
     * return
     *   -2: データが存在しない
     *   -1: 異常終了
     *    0: トランザクションエラー
     *    1: 正常終了
     */
    const deleteQueueTableSingle = queueId => {
        return new Promise(async resolve => {
            // データベースの呼び出し
            const dbObj = await runQueueTable();
            // SQLみたいなの実行
            const request = dbObj.store.index('QUEUE_ID').openCursor(IDBKeyRange.only(queueId));;
            // 正常終了
            request.onsuccess = event => {
                const cursor = event.target.result;
                if (!cursor) {
                    console.log('削除するデータが見つかりませんでした');
                    dbObj.db.close();
                    resolve(-3);
                    return;
                }
                const request = cursor.delete();
                request.onsuccess = () => resolve(1);
                request.onerror = event => {
                    console.log('データの削除に失敗しました：' + event.target.errorCode);
                    resolve(-2);
                }
            };
            // 異常終了
            request.onerror = event => {
                console.log('データの更新に失敗しました：' + event.target.errorCode);
                // -1の返却
                resolve(-1);
            };

            // DBを閉じる
            dbObj.transaction.oncomplete = () => dbObj.db.close();
            dbObj.transaction.onerror = () => {
                console.log('トランザクション中にエラーが発生しました');
                resolve(0);
            }
        });
    };

    /********************************************************************************************************************/
    /* メイン処理 */
    /********************************************************************************************************************/

    /* ユーザIDの発行 */
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = generateRandomString(20);
        localStorage.setItem('userId', userId);
    }

    /**
     *
     */
    const postAction = () => {
        let data = textareaEl.innerText.slice(0, -4);
        if (!localStorage.getItem('name'))
            data = data.replace("名前を入力して下さい：", "");

        const checkData = data.replace(/\s+/g, "");
        if ([undefined, null, ""].includes(checkData))
            return null;
        const txtArea = textareaEl.querySelectorAll("*")[1];
        textareaEl.querySelectorAll("div")[0].style.display = "none";
        txtArea.setAttribute("contenteditable", true);
        txtArea.innerHTML = "";
        setTextareaHeight();
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

    /* 送信ボタンを押した時の処理 */
    textareaEl.querySelectorAll("div")[2].addEventListener("click", () => postAction(), { passive: true });
    const kotChatChangeName = document.querySelector("kot-chat-change-name");
    kotChatChangeName.addEventListener("click", () => {
        localStorage.removeItem('name');
        textareaEl.querySelectorAll("div")[0].style.display = "block";
        textareaEl.querySelectorAll("div")[1].setAttribute("contenteditable", true);
        textareaEl.querySelectorAll("div")[1].innerHTML = "";
        setTextareaHeight();
    }, { passive: true });
    /* 特殊エンター時の処理 */
    const keydownEvent = event => {
        if (event.code === "Enter") {
            if (event.ctrlKey || event.metaKey || event.shiftKey) {
                event.preventDefault();
                return postAction();
            }
        }
        return null;
    }

    /**
     * 画面の描画処理
     */
    const viewAddData = (arg) => {
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

                const isBase64Image = base64Data =>  /^data:image\/[a-z]+;base64,/.test(base64Data);
                const isBase64Video = base64Data => base64Data.slice(0, 10) == "data:video";
                const isBinaryImage = binaryData => {
                    const signatureJpeg = new Uint8Array(binaryData.slice(0, 2));
                    const signaturePng = new Uint8Array(binaryData.slice(0, 8));
                    const signatureGif = new Uint8Array(binaryData.slice(0, 3));
                    return (
                        // jpeg
                        (
                            signatureJpeg[0] === 0xFF &&
                            signatureJpeg[1] === 0xD8
                        )
                        ||
                        // png
                        (
                            signaturePng[0] === 0x89 &&
                            signaturePng[1] === 0x50 &&
                            signaturePng[2] === 0x4E &&
                            signaturePng[3] === 0x47 &&
                            signaturePng[4] === 0x0D &&
                            signaturePng[5] === 0x0A &&
                            signaturePng[6] === 0x1A &&
                            signaturePng[7] === 0x0A
                        )
                        ||
                        // Gif
                        (
                            (signatureGif[0] === 0x47 && signatureGif[1] === 0x49 && signatureGif[2] === 0x46) || // "GIF"
                            (signatureGif[0] === 0x46 && signatureGif[1] === 0x38 && signatureGif[2] === 0x39) // "F89"
                        )
                    );
                };
                const isBinaryVideo = binaryData => {
                    const signature = new Uint8Array(binaryData.slice(0, 4));
                    return (
                        // mp4
                        (
                            signature[0] === 0x00 &&
                            signature[1] === 0x00 &&
                            signature[2] === 0x00 &&
                            (signature[3] === 0x18 || signature[3] === 0x20)
                        )
                        ||
                        // WebM
                        (
                            signature[0] === 0x1A &&
                            signature[1] === 0x45 &&
                            signature[2] === 0xDF &&
                            signature[3] === 0xA3
                        )
                        ||
                        // AVI
                        (
                            signature[0] === 0x52 &&
                            signature[1] === 0x49 &&
                            signature[2] === 0x46 &&
                            signature[3] === 0x46
                        )
                    );
                };
                if (isBase64Video(data)) {
                    const video = document.createElement("video");
                    video.src = data;
                    video.setAttribute("controls", "");
                    kotChatBody.append(video);
                } else if (isBase64Image(data)) {
                    const img = document.createElement("img");
                    img.src = data;
                    kotChatBody.append(img);
                } else if (isBinaryVideo(data)) {
                    const video = document.createElement("video");
                    const blob = new Blob([data]);
                    const blobUrl = URL.createObjectURL(blob);
                    video.src = blobUrl;
                    video.setAttribute("controls", "");
                    kotChatBody.append(video);
                } else if (isBinaryImage(data)) {
                    const img = document.createElement("img");
                    const blob = new Blob([data], { type: 'image/jpeg' });
                    const blobUrl = URL.createObjectURL(blob);
                    img.src = blobUrl;
                    kotChatBody.append(img);
                } else {
                    // 未対応のデータ形式は一旦全部画像として表示
                    const img = document.createElement("img");
                    const blob = new Blob([data], { type: 'image/jpeg' });
                    const blobUrl = URL.createObjectURL(blob);
                    img.src = blobUrl;
                    kotChatBody.append(img);
                }

                break;
            /** 0: 入室 */
            case 0:
                const div = document.createElement("div");
                div.innerText = date ?? "" + data[0] != "\n"
                    ? data
                    : data.split("").slice(1).join('');
                div.innerText = div.innerText.replace(new RegExp("\n", "g"), "")
                kotChatBody.append(div);
                break
            /** 2: 発言 */
            case 2:
                kotChatName.textContent = `${date ?? ""} [${name}]`;
                kotChatBody.append(kotChatName);

                const ytbId = isYoutubeURL(data);
                if (isYoutubeURL(data)) {
                    // iframe width="560" height="315" src="https://www.youtube.com/embed/3_q5pMoCcQE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen
                    const iframe = document.createElement("iframe");
                    iframe.src = "https://www.youtube.com/embed/" + ytbId;
                    iframe.setAttribute("frameborder", "0");
                    iframe.setAttribute("allowfullscreen", null);
                    iframe.setAttribute("allow", "autoplay");
                    kotChatBody.append(iframe);
                    kotChatBody.style.display = "flex";
                } else {
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
                }
                break;
        }
        // 入室、画像送信、チャット送信の場合
        if ([0, 1, 2].includes(type)) {
            const kotChatBodyId = kotChatBodyIdTmp.cloneNode(true);
            kotChatBodyId.innerText = key;
            kotChatBody.prepend(kotChatBodyId);
            kotChatBodyList.prepend(kotChatBody);
        }
        return kotChatBody;
    };
    if (localStorage.getItem('name')) {
        textareaEl.querySelectorAll("div")[0].style.display = "none";
        textareaEl.querySelectorAll("div")[1].setAttribute("contenteditable", true);
        textareaEl.querySelectorAll("div")[1].innerHTML = "";
        setTextareaHeight();
        const records = await getDataAll2();
        records.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
        for (const arg of records)
            viewAddData(arg);
    }

    // inputイベントが発生するたびに関数呼び出し
    textareaEl.addEventListener("input", setTextareaHeight, { passive: true });

    /* クライアントのJS */
    document.addEventListener('keydown', keydownEvent, false);
    document.querySelector("input").addEventListener("change", e => {
        const name = localStorage.getItem('name');
        if (!name)
            return alert("名前が設定されていません");

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = event => {
            const binaryData = event.target.result;
            socket.emit('chat', { type: 1, name: name, data: binaryData });
        };

        reader.readAsArrayBuffer(file);
        e.target.value = null;
        e.target.files = null;
    }, { passive: true });

    socket.on("chat", async arg => {
        if ([0, 1, 2].includes(arg.type)) {
            const key = arg.key;
            const type = arg.type;
            const name = arg.name;
            const data = arg.data;
            const date = arg.date;
            const result = await setData2(key, type, name, data, date);
            kotChatBodyList.prepend(viewAddData(arg));
        }
    });

    const viewClean = async (sort) => {
        // log("画面更新処理開始");

        const records = await getDataAll2();
        records.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
        // log("画面更新処理", records.length + " 件取得");

        let kotChatBodyList2 = document.body.querySelectorAll("kot-chat-body");
        if (records.length < kotChatBodyList2.length) {
            document.body.querySelector("kot-chat-body").parentNode.innerHTML = "";
        }
        kotChatBodyList2 = document.body.querySelectorAll("kot-chat-body");
        if (records.length > kotChatBodyList2.length) {
            for (let i = 0; i < records.length - kotChatBodyList2.length; i++)
                kotChatBodyList.append(kotChatBodyTmp.cloneNode(true));
            for (let i = 0; i < records.length; i++) {
                const arg = records[i];
                const kotChatBody = document.body.querySelectorAll("kot-chat-body")[document.body.querySelectorAll("kot-chat-body").length - i - 1];
                if (!kotChatBody.querySelector("kot-chat-body-id")
                        || kotChatBody.querySelector("kot-chat-body-id").innerText != arg.KEY) {
                     try {
                        kotChatBody.parentNode.replaceChild(viewAddData(arg), kotChatBody);
                     } catch (error) {
                        console.log(error);
                     }
                }
            }

        }
        // log("画面更新処理完了", records.length + " 件")
    };
    await viewClean();
    setInterval(async () => viewClean() , 3000);

    // 定期的に全データのキーを全員に提供(自身のIPと共に)
    // 提供されたデータを確認
    const presentation2 = async () => {
        const records = await getDataAllKeys2();
        records.sort((a, b) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime());
        socket.emit('presentation2', { userId: userId, records: records });
        await sleep(5000);
        await presentation2();
    };
    presentation2();

    // データのキーの受信
    socket.on("presentation2", async arg => {
        if (!arg.records) {
            return;
        }
        const records = await dataCheckKeys2(arg.records);
        if (records?.length) {
            const queueId = generateRandomString(10);
            await setQueueTableSingle(queueId, records, 0, arg.userId, new Date());
        }
    });
    // プリーズされたデータを確認
    // 10個ずつに分ける関数
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            chunks.push(chunk);
        }
        return chunks;
    }

    socket.on("please", async arg => {

        const functionId = generateRandomString(5);
        log("データ送信処理開始" + functionId);

        const records = await getAllData2(arg.records);
        records.sort((a, b) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime());

        if (records?.length) {
            log(arg.records.length + " 件" + functionId);
            records.splice(9);
            const results = chunkArray(records, 1);
            // データ受信リクエスト送信
            for (const result of results) {
                socket.emit(`give`, {queueId: arg.queueId, userId: userId, toUserId: arg.userId, records: result});
            }
        }
        pleaseFlg = true;
        log("データ送信処理終了" + functionId);
    });

    // データ受信リクエスト受信
    socket.on(`give`, async arg => {
        log(`受信[${arg.queueId}]`);
        await putQueueTableOfStatus(arg.queueId, 1, new Date());
        await setDataAll2(arg.records);
        // log("受信終了...");
    });

    await queueAction();
};
