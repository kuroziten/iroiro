// 宣言（TODOの部分を書き換える）
const pokemonPageUrlDb = await (new class {
  // TODO: DB名（他のDB名と重複しないようにすること）
  private DN: string = "pokemonPageUrlDb";
  // TODO: 情報を取得、登録するキー
  private keyPath: string = "pokemonName";
  // TODO: 取得、登録する情報の形
  private type: {
    pokemonName: typeof this.keyPath,
    pokemonPageUrl: string,
    pokemonPageGet: "0"|"1",
  };
  private db: IDBDatabase;
  private store = (mode: "readonly"|"readwrite"|"versionchange") => this.db.transaction(this.DN, mode).objectStore(this.DN);
  public set = async (obj: typeof this.type): Promise<void> => new Promise(resolve => this.store("readwrite").put(obj).onsuccess = () => resolve());
  public get = async (pokemonName: string): Promise<typeof this.type> => new Promise((resolve) => this.store("readonly").get(pokemonName).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)));
  getAll = (): Promise<typeof this.type[]> => new Promise((resolve) => this.store("readonly").getAll().onsuccess = (e: Event) => resolve((e.target as IDBRequest).result));
  public reset = async () => {
    this.db.close();
    await new Promise<void>(resolve => indexedDB.deleteDatabase(this.DN).onsuccess = () => resolve());
    await this.build();
  };
  public build = async () => {
    const DN = this.DN;
    const keyPath = this.keyPath;
    this.db = await new Promise<IDBDatabase>(function (resolve) {
      const req: IDBOpenDBRequest = indexedDB.open(DN, 1);
      req.onupgradeneeded = function (e: IDBVersionChangeEvent) {
        const db: IDBDatabase = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(DN)) db.createObjectStore(DN, { keyPath });
      };
      req.onsuccess = (e: Event) => resolve((e.target as IDBOpenDBRequest).result);
    });
    return this;
  };
}).build();

// リセット（DBを作り直したい時に流す）
await pokemonPageUrlDb.reset();

// 登録
await pokemonPageUrlDb.set({
  pokemonName: "テスト1",
  pokemonPageUrl: "http://test",
  pokemonPageGet: "0"
});
await pokemonPageUrlDb.set({
  pokemonName: "テスト2",
  pokemonPageUrl: "http://test",
  pokemonPageGet: "0"
});

// 取得
console.log(await pokemonPageUrlDb.get("テスト1"));
console.log(await pokemonPageUrlDb.get("テスト2"));
console.log(await pokemonPageUrlDb.get("テスト3"));// 存在しない場合はundefined

// 全部取得
console.log(await pokemonPageUrlDb.getAll());
