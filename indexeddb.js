/** 248行目くらいからメイン処理の例 **/

(async () => {

    /**
     * カラムクラス.
     */
    class columnClass {
        /**
         * @param {string} columnName 絡む名
         * @param {string} uniqueKey 単一ユニークキー（単一ユニーク設定がfalseの場合は入力不要）
         * @param {string} groupUniqueKey グループユニークキー（グループユニーク設定がfalseの場合は入力不要）
         */
        constructor(columnName, uniqueKey, groupUniqueKey) {
            this.columnName = columnName;
            this.uniqueKey = uniqueKey;
            this.groupUniqueKey = groupUniqueKey;
        };
        // カラム名
        columnName = "";
        // 単一ユニークキー
        uniqueKey = "";
        // 複合ユニークキー
        groupUniqueKey = "";
    }

    /**
     * テーブルクラス.
     */
    class tableClass {
        /**
         * @param {string} tableName 
         * @param {Array<columnClass>} columns 
         */
        constructor(tableName, columns) {
            this.tableName = tableName;
            this.columns = {};
            for (const column of columns) {
                this.columns[column.columnName] = column;
            }
        }
        // テーブル名
        tableName = "";
        /** @type {Object.<string, columnClass>} カラムリスト */
        columns;
    };


    /**
     * DBクラス
     */
    class dbClass {
        /**
         * @param {string} dbName データベース名
         * @param {Array<tableClass>} tableList テーブルリスト
         * @param {boolean} initialize 初期化
         */
         async build(dbName, tableList, initialize) {
            this.dbName = dbName;
            if (initialize === true) {
                indexedDB.deleteDatabase(dbName);
            }
            this.request = indexedDB.open(dbName, 1);

            await new Promise(r => {
                // await new Promise();
                this.request.onupgradeneeded = (event) => {
    
                    const db = event.target.result;
    
                    this.tableList = {};
                    for (const table of tableList) {

                        this.tableList[table.tableName] = table;

                        const keyPath = Object.values(table.columns).map(e => e.columnName);
                        const objectStore = db.createObjectStore(table.tableName, { keyPath: keyPath });

                        const columns = Object.values(table.columns);

                        columns.forEach(column => objectStore.createIndex(column.columnName, column.columnName, {unique: false}));

                        columns.forEach(column => {
                            if (column.uniqueKey !== null) {
                                objectStore.createIndex(column.uniqueKey, column.columnName, {unique: true})
                            }
                        });

                        const columnsFilter = columns.filter(column => column.groupUniqueKey !== null);
                        const columnGroupList = Object.values(Object.groupBy(columnsFilter, e => e.groupUniqueKey));
                        for (const columnGroups of columnGroupList) {
                            if (columnGroups[0].groupUniqueKey !== null) {
                                objectStore.createIndex(columnGroups[0].groupUniqueKey, columnGroups.map(e => e.columnName), {unique: true});
                            }
                        }
                    }
                    this.db = db;
                }
                this.request.onsuccess = (event) => {
                    this.db = event.target.result;
                    r();
                };
            });
            return this;
        };
        request;
        // データベースの名前
        dbName;
        // テーブルリスト
        tableList;
        db;

        /**
         * レコード追加.
         *
         * @param {*} tableName 対象テーブル
         * @param {*} value 対象レコード
         */
        async add(tableName, value) {
            const request = this.db.transaction([tableName], "readwrite").objectStore(tableName).add(value);
            const res = await new Promise(r => {
                request.onsuccess = () => r();
                request.onerror = event => {
                    console.error("レコード追加処理でエラーが発生しました。キーの重複が考えられます:: ", tableName, value);
                    r();
                };
            });
        };

        /**
         * 全レコード取得.
         *
         * @param {string} tableName テーブル名
         * @returns レコード
         */
        async getAll(tableName) {
            const objectStore = this.db.transaction([tableName], "readwrite").objectStore(tableName);
            const customers = [];
            return await new Promise(r => {
                objectStore.openCursor().onsuccess = (event) => {
                    // @ts-ignore
                    const cursor = event.target.result;
                    if (cursor) {
                        customers.push(cursor.value);
                        cursor.continue();
                    } else {
                        r(customers);
                    }
                };
            });
        };

        /**
         * レコード取得
         * @param {*} tableName テーブル名
         * @param {*} indexName インデックス名（またはカラム名）
         * @param {*} keys 検索キー
         * @returns レコード
         */
        async get(tableName, indexName, keys) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(tableName, "readwrite");
                const store = transaction.objectStore(tableName);
    
                // インデックスで該当データを検索
                const index = store.index(indexName);
                let request = index.openCursor(keys);
                const customers = [];
                request.onsuccess = (event) => {
                    // @ts-ignore
                    const cursor = event.target.result;
                    if (cursor) {
                        customers.push(cursor.value);
                        cursor.continue(); // 次のデータへ
                    } else {
                        resolve(customers); // 全件処理終了
                    }
                };
            });
        };

        /**
         * レコード削除
         * @param {*} tableName テーブル名
         * @param {*} indexName インデックス名（またはカラム名）
         * @param {*} keys 検索キー
         * @returns レコード
         */
         async del(tableName, indexName, keys) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(tableName, "readwrite");
                const store = transaction.objectStore(tableName);
    
                // インデックスで該当データを検索
                const index = store.index(indexName);
                let request = index.openCursor(keys);
                const customers = [];
                request.onsuccess = (event) => {
                    // @ts-ignore
                    const cursor = event.target.result;
                    if (cursor) {
                        cursor.delete(); // 該当データを削除
                        cursor.continue(); // 次のデータへ
                    } else {
                        resolve(customers); // 全件処理終了
                    }
                };
            });
        };

        /**
         * レコード更新.
         *
         * @param {*} tableName テーブル名
         * @param {*} indexName インデックス名（またはカラム名）
         * @param {*} keys 検索キー
         * @returns レコード
         */
         async upd(tableName, indexName, keys, value) {
            await new Promise((resolve, reject) => {
                const transaction = this.db.transaction(tableName, "readwrite");
                const store = transaction.objectStore(tableName);
    
                // インデックスで該当データを検索
                const index = store.index(indexName);
                let request = index.openCursor(keys);
                request.onsuccess = (event) => {
                    // @ts-ignore
                    const cursor = event.target.result;
                    if (cursor) {
                        for (const key of Object.keys(value)) {
                            cursor.value[key] = value[key];
                        }
                        cursor.delete(); // 該当データを削除
                        store.put(cursor.value);
                        cursor.continue(); // 次のデータへ
                    } else {
                        console.log("全件処理終了");
                        resolve(); // 全件処理終了
                    }
                };
            });

        };

    };

    /* ★★★★★ 以下からメイン処理 ★★★★★ */

    /** データベースの作成 */
    const dbInfo = await new dbClass().build(
        "MyTestDatabase2",
        [
            // テーブルの作成
            new tableClass(
                "MyTestTable2",
                [
                    // カラムの作成
                    // UNIQUE_IDは他のレコードと重複しない
                    new columnClass("UNIQUE_ID", "uniqueKey01", null),
                    // NOとSUB_NOの組み合わせは他のレコードと重複しない
                    new columnClass("NO", null, "groupUniqueKey01"),
                    new columnClass("SUB_NO", null, "groupUniqueKey01"),
                    // NAMEは他のレコードと重複可能
                    new columnClass("NAME", null, null)
                ]
            )
        ],
        true
    );

    console.log("データ追加開始");

    // 重複しないデータ
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "aaa", NO: 0,SUB_NO: 0,NAME: "じてん"});

    // UNIQUE_IDが重複するデータ
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "bbb", NO: 1,SUB_NO: 1,NAME: "スカイ"});
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "bbb", NO: 2,SUB_NO: 2,NAME: "ヌイカ"});

    // NOとSUB_NOの複合キーが重複するデータ
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "ccc", NO: 3,SUB_NO: 3,NAME: "ちんげ"});
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "ddd", NO: 3,SUB_NO: 3,NAME: "まんげ"});
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "eee", NO: 3,SUB_NO: 3,NAME: "けつげ"});

    // NOは同じだが組み合わせは重複しないデータ
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "fff", NO: 4,SUB_NO: 0,NAME: "大腸A"});
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "ggg", NO: 4,SUB_NO: 1,NAME: "大腸B"});
    await dbInfo.add("MyTestTable2", {UNIQUE_ID: "hhh", NO: 4,SUB_NO: 2,NAME: "大腸C"});

    console.log("データ追加終了");

    console.log("データ全件取得開始");
    console.log(await dbInfo.getAll("MyTestTable2"));
    console.log("データ全件取得終了");

    console.log("キー検索開始");
    console.log((await dbInfo.get("MyTestTable2", "uniqueKey01", "aaa")));
    console.log((await dbInfo.get("MyTestTable2", "uniqueKey01", "aaa")));
    console.log((await dbInfo.get("MyTestTable2", "NO", 4)));
    console.log("キー検索終了");


    console.log("削除開始");
    console.log((await dbInfo.del("MyTestTable2", "groupUniqueKey01", [3, 3])));
    console.log("削除終了");

    console.log("データ全件取得開始");
    console.log(await dbInfo.getAll("MyTestTable2"));
    console.log("データ全件取得終了");

    console.log("更新開始");
    console.log((await dbInfo.upd("MyTestTable2", "NAME", "大腸B", {UNIQUE_ID: "ggg", NO: 4,SUB_NO: 1,NAME: "大腸BBQ"})));
    console.log("更新終了");

    console.log("データ全件取得開始");
    console.log(await dbInfo.getAll("MyTestTable2"));
    console.log("データ全件取得終了");

    indexedDB.deleteDatabase("MyTestDatabase");

})();
