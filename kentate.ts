// ==UserScript==
// @name     剣盾拡張機能
// @namespace  http://tampermonkey.net/
// @version    2026-05-03
// @description  try to take over the world!
// @author     You
// @match    https://game8.jp/pokemon-sword-shield/260149
// @icon     https://www.google.com/s2/favicons?sz=64&domain=game8.jp
// @grant    none
// ==/UserScript==

(async () => {

  document.body.style.display = "none";

  const $ = <T extends Element>(selector: string): T =>
    document.querySelector(selector)! as T;

  const newStyle: HTMLStyleElement = document.createElement("style");
  newStyle.textContent = `
#result_area {
  & tr > td:nth-of-type(2) a {
    display: flex;
    align-items: center;
    & img {
      margin: 0 !important;
    }
  }
  tr[exclusion] {
    display: none;
  }
}
#filterArea img {
  filter: brightness(0.5);
  
}
#filterArea img[check] {
  filter: unset;
}
#filterArea img:hover {
  filter: brightness(1.25);
}

#moveFilterArea {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;

  width: 520px;
  min-height: 42px;

  padding: 6px;

  border: 1px solid #ccc;
  border-radius: 8px;

  cursor: text;
  background: white;
}

#moveFilterAreaKeyword {
  flex: 1;
  min-width: 120px;

  border: none;
  outline: none;

  font-size: 16px;
  padding: 4px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 4px 8px;

  border-radius: 999px;

  background: #e8f0ff;
  font-size: 14px;
}

.remove {
  cursor: pointer;
  color: #666;
  font-weight: bold;
}

#moveFilterSuggestions {
  position: fixed;
  z-index: 999999;

  width: 520px;
  max-height: 240px;

  overflow-y: auto;
  overflow-x: hidden;

  overscroll-behavior: contain;

  padding: 4px;

  border: 1px solid #ccc;
  border-radius: 8px;

  background: white;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  display: none;
}

.item {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.item:hover,
.active {
  background: #eef4ff;
}

.description {
  margin-top: 2px;
  font-size: 12px;
  color: #666;
}

.pokemonTypeFilterAreaImg {
  width: 20%;
}

  `;
  document.body.append(newStyle);

  (document.querySelector(".l-2colSide") as HTMLElement).remove();
  document.querySelectorAll(".ad-wrapper").forEach(e => e.remove());
  (document.querySelector(".l-2colMain") as HTMLElement).style.width = "100%";
  (document.querySelector(".l-2colMain__center") as HTMLElement).style.width = "100%";
  (document.querySelector(".l-billboard_container") as HTMLElement).remove();
  (document.querySelector(".a-announce") as HTMLElement).remove();
  (document.querySelector(".a-paragraph") as HTMLElement).remove();
  (document.querySelector(".a-table") as HTMLElement).remove();
  (document.querySelector(".p-archiveHeader") as HTMLElement).remove();
  (document.querySelector(".a-outline") as HTMLElement).remove();
  (document.querySelector(".track_mario") as HTMLElement).remove();
  (document.querySelector(".text-field") as HTMLElement).remove();
  (document.querySelector(".a-paragraph") as HTMLElement).remove();
  (document.querySelector(".search-display_field-container") as HTMLElement).style.display = "none";
  (document.querySelector(".l-breadcrumb") as HTMLElement).remove();
  (document.querySelector("header") as HTMLElement).remove();
  (document.querySelector(".p-gameHeader") as HTMLElement).remove();
  (document.querySelector(".p-gameNavText") as HTMLElement).remove();
  (document.querySelector("#hl_1")!.nextElementSibling as HTMLElement).remove();
  (document.querySelector("#hl_1") as HTMLElement).remove();

  const PokemonUrl = {
    "ノーマル": "https://img.game8.jp/3735996/d91b93f4a89006df9fdcb3de5667c70b.jpeg/show",
    "ほのお": "https://img.game8.jp/3735991/ff60afe9523ded574a3f3e18019ddd64.jpeg/show",
    "みず": "https://img.game8.jp/3735998/a2ece50c9c322ffc5a16f5f3fb505428.jpeg/show",
    "でんき": "https://img.game8.jp/3735993/4c6c06e09fc8f9889829c6909703d2ad.jpeg/show",
    "くさ": "https://img.game8.jp/3735987/3ee05123c7061d77a15e34acdfebb527.jpeg/show",
    "こおり": "https://img.game8.jp/3735992/242b3bc6d26a1dc633f0d12af37046d3.jpeg/show",
    "かくとう": "https://img.game8.jp/3735997/08ebbb243e59b71e053d9ff7668a8f8f.jpeg/show",
    "どく": "https://img.game8.jp/3735988/edda03d318b9fb398f1688babbce09ce.jpeg/show",
    "じめん": "https://img.game8.jp/3735986/b52d471b041ac05b2e66054c57304ac9.jpeg/show",
    "ひこう": "https://img.game8.jp/3735989/ead490e70f8f5537536d6c9bf12b4aef.jpeg/show",
    "エスパー": "https://img.game8.jp/3736002/d9adcf5a7c7d86d4c51c84688320f03a.jpeg/show",
    "むし": "https://img.game8.jp/3736003/bbecd27c88e08ad7a79d01c90e217ae5.jpeg/show",
    "いわ": "https://img.game8.jp/3735990/5d60b08c61ffe0737c7a5533181ff2f2.jpeg/show",
    "ゴースト": "https://img.game8.jp/3736000/957ad3d525deaa001cefb3e54b181b81.jpeg/show",
    "ドラゴン": "https://img.game8.jp/3735995/a346923a25e1a33fcbe65dd4acd6a6cb.jpeg/show",
    "あく": "https://img.game8.jp/3735999/0abc4eb33dfbd21b707baae478be76b8.jpeg/show",
    "はがね": "https://img.game8.jp/3735994/9bf88e7a84e524139fe9eb0182ca41fb.jpeg/show",
    "フェアリー": "https://img.game8.jp/3736001/e7dc0b01568c50d1ed1e862e21c5c2f6.jpeg/show"
  };

  type PokemonType = keyof typeof PokemonUrl;

  const typeUrlList = Object.entries(PokemonUrl) as [PokemonType, string][];

  /* ポケモンDB */
  const POKEMON_MST_DB_NAME: string = "MST_DB";
  const POKEMON_MST_SN_EXISTS: string = "EXISTS";
  const POKEMON_MST_SN_DATA: string = "DATA";
  const pokemonMstDb = await new Promise<IDBDatabase>(function (resolve, reject) {
    var req: IDBOpenDBRequest = indexedDB.open(POKEMON_MST_DB_NAME, 1);
    req.onupgradeneeded = function (e: IDBVersionChangeEvent) {
      var db: IDBDatabase = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(POKEMON_MST_SN_EXISTS)) {
        db.createObjectStore(POKEMON_MST_SN_EXISTS, { keyPath: "URL" });
      }
      if (!db.objectStoreNames.contains(POKEMON_MST_SN_DATA)) {
        db.createObjectStore(POKEMON_MST_SN_DATA, { keyPath: "URL" });
      }
    };
    req.onsuccess = (e: Event) => resolve((e.target as IDBOpenDBRequest).result);
  });
  const storePokemonMstExists = (mode: IDBTransactionMode): IDBObjectStore => pokemonMstDb.transaction(POKEMON_MST_SN_EXISTS, mode).objectStore(POKEMON_MST_SN_EXISTS);
  const insertPokemonMstExists = (url: string): Promise<void> => new Promise((resolve) => storePokemonMstExists("readwrite").put({ URL: url }).onsuccess = () => resolve());
  const getPokemonMstExists = (url: string): Promise<boolean> => new Promise((resolve) => storePokemonMstExists("readonly").get(url).onsuccess = (e: Event) => resolve(!!(e.target as IDBRequest).result));

  const storePokemonMstData = (mode: IDBTransactionMode): IDBObjectStore => pokemonMstDb.transaction(POKEMON_MST_SN_DATA, mode).objectStore(POKEMON_MST_SN_DATA);
  const insertPokemonMstData = (url: string, mstData: string): Promise<void> => new Promise((resolve) => storePokemonMstData("readwrite").put({ URL: url, MST_DATA: mstData }).onsuccess = () => resolve());
  const getPokemonMstData = (url: string): Promise<string | undefined> => new Promise((resolve) => storePokemonMstData("readonly").get(url).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.MST_DATA));

  /* わざDB */
  const MOVE_MST_DB_NAME: string = "MOVE_DB";
  const MOVE_MST_SN_EXISTS: string = "EXISTS";
  const MOVE_MST_SN_DATA: string = "DATA";
  const moveMstDb = await new Promise<IDBDatabase>(function (resolve, reject) {
    var req: IDBOpenDBRequest = indexedDB.open(MOVE_MST_DB_NAME, 1);
    req.onupgradeneeded = function (e: IDBVersionChangeEvent) {
      var db: IDBDatabase = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(MOVE_MST_SN_EXISTS)) {
        db.createObjectStore(MOVE_MST_SN_EXISTS, { keyPath: "MOVE_NAME" });
      }
      if (!db.objectStoreNames.contains(MOVE_MST_SN_DATA)) {
        db.createObjectStore(MOVE_MST_SN_DATA, { keyPath: "MOVE_NAME" });
      }
    };
    req.onsuccess = (e: Event) => resolve((e.target as IDBOpenDBRequest).result);
  });
  const storeMoveMstDataExists = (mode: IDBTransactionMode): IDBObjectStore => moveMstDb.transaction(MOVE_MST_SN_EXISTS, mode).objectStore(MOVE_MST_SN_EXISTS);
  const insertMoveMstDataExists = (moveName: string): Promise<void> => new Promise((resolve) => storeMoveMstDataExists("readwrite").put({ MOVE_NAME: moveName }).onsuccess = () => resolve());
  const getMoveMstDataExists = (moveName: string): Promise<boolean> => new Promise((resolve) => storeMoveMstDataExists("readonly").get(moveName).onsuccess = (e: Event) => resolve(!!(e.target as IDBRequest).result));

  const storeMoveMstData = (mode: IDBTransactionMode): IDBObjectStore => moveMstDb.transaction(MOVE_MST_SN_DATA, mode).objectStore(MOVE_MST_SN_DATA);
  const insertMoveMstData = (moveName: string, mstData: string): Promise<void> => new Promise((resolve) => storeMoveMstData("readwrite").put({ MOVE_NAME: moveName, MST_DATA: mstData }).onsuccess = () => resolve());
  const getMoveMstData = (moveName: string): Promise<string | undefined> => new Promise((resolve) => storeMoveMstData("readonly").get(moveName).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.MST_DATA));

  const DB_NAME: string = "myDB";
  const SN_HABCDS: string = "habcds";
  const SN_ABILITY: string = "abilyty";
  const SN_ABILITY_MST: string = "abilytyMst";
  const SN_MOVE: string = "move";
  const SN_MOVE_MST: string = "moveMst";
  const SN_MAX_MOVE_POWER: string = "maxMovePower";
  const SN_MAX_MOVE_POWER_TXT: string = "maxMovePowerTxt";
  const SN_RESULT_AREA_INNER_HTML: string = "resultAreaInnerHTML";
  const DB_VERSION: number = 5;

  // indexedDB.deleteDatabase(DB_NAME);

  const statusDb = await new Promise<IDBDatabase>(function (resolve, reject) {
    var req: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = function (e: IDBVersionChangeEvent) {
      var db: IDBDatabase = (e.target as IDBOpenDBRequest).result;

      // HABCDS
      if (!db.objectStoreNames.contains(SN_HABCDS)) {
        db.createObjectStore(SN_HABCDS, { keyPath: "URL" });
      }

      // ポケモンごとに持っているとくせい（リストで保持）
      if (!db.objectStoreNames.contains(SN_ABILITY)) {
        db.createObjectStore(SN_ABILITY, { keyPath: "URL" });
      }

      // とくせいマスタ（とくせいの情報を保持）
      if (!db.objectStoreNames.contains(SN_ABILITY_MST)) {
        db.createObjectStore(SN_ABILITY_MST, { keyPath: "ABILITY_NAME" });
      }

      // ポケモンごとに持っているわざ（リストで保持）
      if (!db.objectStoreNames.contains(SN_MOVE)) {
        db.createObjectStore(SN_MOVE, { keyPath: "URL" });
      }

      // わざマスタ（わざの情報を保持）
      if (!db.objectStoreNames.contains(SN_MOVE_MST)) {
        db.createObjectStore(SN_MOVE_MST, { keyPath: "MOVE_NAME" });
      }

      // 最大威力
      if (!db.objectStoreNames.contains(SN_MAX_MOVE_POWER)) {
        db.createObjectStore(SN_MAX_MOVE_POWER, { keyPath: "URL_AND_TYPES" });
      }

      // 最大威力テキスト
      if (!db.objectStoreNames.contains(SN_MAX_MOVE_POWER_TXT)) {
        db.createObjectStore(SN_MAX_MOVE_POWER_TXT, { keyPath: "URL_AND_TYPES" });
      }

      // resultAreaInnerHTML
      if (!db.objectStoreNames.contains(SN_RESULT_AREA_INNER_HTML)) {
        db.createObjectStore(SN_RESULT_AREA_INNER_HTML, { keyPath: "KEY" });
      }
    };

    req.onsuccess = (e: Event) => resolve((e.target as IDBOpenDBRequest).result);
  });

  const storeHabcds = (mode: IDBTransactionMode): IDBObjectStore => statusDb.transaction(SN_HABCDS, mode).objectStore(SN_HABCDS);
  const insertHabcds = (url: string, h: any, a: any, b: any, c: any, d: any, s: any): Promise<void> => new Promise((resolve) => storeHabcds("readwrite").put({
    URL: url,
    H: Number(h),
    A: Number(a),
    B: Number(b),
    C: Number(c),
    D: Number(d),
    S: Number(s),
    T: Number(h) + Number(a) + Number(b) + Number(c) + Number(d) + Number(s)
  }).onsuccess = () => resolve());
  const getHabcds = (url: string): Promise<any> => new Promise((resolve) => storeHabcds("readonly").get(url).onsuccess = (e: Event) => resolve((e.target as IDBRequest).result));

  const storeAbility = (mode: IDBTransactionMode): IDBObjectStore => statusDb.transaction(SN_ABILITY, mode).objectStore(SN_ABILITY);
  const insertAbility = (url: string, abilityNameList: string[]): Promise<void> => new Promise((resolve) => storeAbility("readwrite").put({ URL: url, ABILITY_NAME_LIST: abilityNameList }).onsuccess = () => resolve());
  const getAbility = (url: string): Promise<string[] | undefined> => new Promise((resolve) => storeAbility("readonly").get(url).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.ABILITY_NAME_LIST));

  const storeAbilityMst = (mode: IDBTransactionMode): IDBObjectStore => statusDb.transaction(SN_ABILITY_MST, mode).objectStore(SN_ABILITY_MST);
  const insertAbilityMst = (abilityName: string, abilitExplanation: string): Promise<void> => new Promise((resolve) => storeAbilityMst("readwrite").put({ ABILITY_NAME: abilityName, ABILITY_EXPLANATION: abilitExplanation }).onsuccess = () => resolve());
  const getAbilityMst = (abilityName: string): Promise<string | undefined> => new Promise((resolve) => storeAbilityMst("readonly").get(abilityName).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.ABILITY_EXPLANATION));
  const getAllAbilityMst = (): Promise<string[]> => new Promise((resolve) => storeAbilityMst("readonly").getAll().onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.map((e: any) => e.ABILITY_NAME).flat()));

  const storeMove = (mode: IDBTransactionMode): IDBObjectStore => statusDb.transaction(SN_MOVE, mode).objectStore(SN_MOVE);
  const insertMove = (url: string, moveNameList: any[]): Promise<void> => new Promise((resolve) => storeMove("readwrite").put({ URL: url, MOVE_NAME_LIST: moveNameList }).onsuccess = () => resolve());
  const getMove = (url: string): Promise<any[] | undefined> => new Promise((resolve) => storeMove("readonly").get(url).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.MOVE_NAME_LIST));

  type MoveMstOptionType = {
    /** わざ名. */
    MOVE_NAME: string,
    /** わざタイプ. */
    MOVE_TYPE: PokemonType,
    /** わざ威力. */
    MOVE_POWER: string,
    /** わざ命中率. */
    MOVE_ACCURACY: string,
    /** わざPP. */
    MOVE_PP: number,
    /** わざ分類. */
    MOVE_CATEGORY: string | undefined,
    /** わざ説明. */
    MOVE_EXPLANATION: string | undefined
  };
  const storeMoveMst = (mode: IDBTransactionMode): IDBObjectStore => statusDb.transaction(SN_MOVE_MST, mode).objectStore(SN_MOVE_MST);
  const insertMoveMst = (
    o: MoveMstOptionType
  ): Promise<void> => new Promise((resolve) => storeMoveMst("readwrite").put({
    MOVE_NAME: o.MOVE_NAME,
    MOVE_TYPE: o.MOVE_TYPE,
    MOVE_POWER: o.MOVE_POWER,
    MOVE_ACCURACY: o.MOVE_ACCURACY,
    MOVE_PP: o.MOVE_PP,
    MOVE_CATEGORY: o.MOVE_CATEGORY,
    MOVE_EXPLANATION: o.MOVE_EXPLANATION
  }).onsuccess = () => resolve());
  const getMoveMst = (moveName: string): Promise<MoveMstOptionType | undefined> => new Promise((resolve) => storeMoveMst("readonly").get(moveName).onsuccess = (e: Event) => resolve((e.target as IDBRequest).result));
  const getAllMoveMst = (): Promise<MoveMstOptionType[]> => new Promise((resolve) => storeMoveMst("readonly").getAll().onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)));

  type MaxMovePowerType = {
    /** わざ名. */
    MOVE_NAME: string,
    /** わざタイプ. */
    MOVE_TYPE: string,
    /** わざ威力. */
    MOVE_POWER: number,
    /** 火力指標. */
    MOVE_MAX_POWER: number
  };
  type MaxMovePowerDBType = {
    URL_AND_TYPES: string
  } & MaxMovePowerType;
  const storeMaxMovePower = (mode: IDBTransactionMode): IDBObjectStore => statusDb.transaction(SN_MAX_MOVE_POWER, mode).objectStore(SN_MAX_MOVE_POWER);
  const insertMaxMovePower = (url: string, types: string[], o: MaxMovePowerType): Promise<void> => new Promise((resolve) => storeMaxMovePower("readwrite").put({
    URL_AND_TYPES: url + types.sort().join(","), ...o
  }).onsuccess = () => resolve());
  const getMaxMovePower = (url: string, types: string[]): Promise<MaxMovePowerDBType> => new Promise((resolve) => storeMaxMovePower("readonly").get(url + types.sort().join(",")).onsuccess = (e: Event) => resolve((e.target as IDBRequest).result));

  const storeMaxMovePowerTxt = (mode: IDBTransactionMode): IDBObjectStore => statusDb.transaction(SN_MAX_MOVE_POWER_TXT, mode).objectStore(SN_MAX_MOVE_POWER_TXT);
  const insertMaxMovePowerTxt = (url: string, types: string[], txt: string): Promise<void> => new Promise((resolve) => storeMaxMovePowerTxt("readwrite").put({
    URL_AND_TYPES: url + types.sort().join(","), TXT: txt
  }).onsuccess = () => resolve());
  const getMaxMovePowerTxt = (url: string, types: string[]): Promise<string> => new Promise((resolve) => storeMaxMovePowerTxt("readonly").get(url + types.sort().join(",")).onsuccess = (e: Event) => resolve((e.target as IDBRequest).result?.TXT));

  const storeResultAreaInnerHTML = (mode: IDBTransactionMode): IDBObjectStore => statusDb.transaction(SN_RESULT_AREA_INNER_HTML, mode).objectStore(SN_RESULT_AREA_INNER_HTML);
  const insertResultAreaInnerHTML = (innerHTML: string): Promise<void> => new Promise((resolve) => storeResultAreaInnerHTML("readwrite").put({
    KEY: "1", INNER_HTML: innerHTML
  }).onsuccess = () => resolve());
  const getResultAreaInnerHTML = (): Promise<string> => new Promise((resolve) => storeResultAreaInnerHTML("readonly").get("1").onsuccess = (e: Event) => resolve((e.target as IDBRequest).result?.INNER_HTML));

  // const getAllMoveMst = (): Promise<string[]> => new Promise((resolve) => storeMoveMst("readonly").getAll().onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.map((e: any) => e.MOVE_NAME).flat()));

  // result_areaを取得する
  let result_area: HTMLElement = document.querySelector("#result_area")!;
  let trList = await new Promise<NodeListOf<HTMLTableRowElement>>(async r => {
    while (true) {
      const trList: NodeListOf<HTMLTableRowElement> = result_area.querySelectorAll("tr");
      if (trList.length > 0) r(trList);
      await new Promise(r2 => setTimeout(r2, 500));
    }
  });

  // 情報取得
  console.log("情報取得_処理開始");
  let start: number = performance.now();
  for (let i: number = 1; i < trList.length; i++) {
    const tr: HTMLTableRowElement = trList[i];
    const tdList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");
    const url: string = tr.querySelector("a")!.href;
    const res: boolean = await getPokemonMstExists(url);
    if (res) {
      continue;
    }
    if (await getPokemonMstData(url)) {
      await insertPokemonMstExists(url);
      continue;
    }
    console.log("マスタ作成");
    if (!res) {
      const no: number = Number(tdList[0].textContent);
      const name: string = tdList[1].textContent!.trim();
      console.log("insert開始", no, name);
      await insertPokemonMstData(url, await (await fetch(url)).text());
      await insertPokemonMstExists(url);
      console.log("insert完了", no, name);
    }
  }
  console.log(`情報取得_処理時間: ${performance.now() - start} ms`);

  const createTh = (text: string): HTMLTableCellElement => {
    const th: HTMLTableCellElement = document.createElement("th");
    th.textContent = text;
    return th;
  };
  const createTd = (text: any): HTMLTableCellElement => {
    const td: HTMLTableCellElement = document.createElement("td");
    td.textContent = text;
    return td;
  };

  const movePowerElement = createTh("最大威力");
  const hElement: HTMLTableCellElement = createTh("HP");
  const aElement: HTMLTableCellElement = createTh("こうげき");
  const bElement: HTMLTableCellElement = createTh("ぼうぎょ");
  const cElement: HTMLTableCellElement = createTh("とくこう");
  const dElement: HTMLTableCellElement = createTh("とくぼう");
  const sElement: HTMLTableCellElement = createTh("すばやさ");
  const tElement: HTMLTableCellElement = createTh("合計");

  async function filterFunc() {
    const parent = result_area.parentNode as HTMLElement;
    const next = result_area.nextSibling;
    result_area.remove();

    for (let i: number = 1; i < trList.length; i++) {
      // 解除
      const tr: HTMLTableRowElement = trList[i];
      tr.removeAttribute("exclusion");
      // タイプでフィルター
      if (filterStatus.pokemonType.length > 0) {
        // フィルターの条件に含まれているタイプを持っていないものは除外
        const alts = Array.from(tr.querySelectorAll("td")[2].querySelectorAll("img")).map(e => e.alt);
        if (!filterStatus.pokemonType.every(e => alts.some(ee => e === ee))) {
          tr.setAttribute("exclusion", "");
          continue;
        }
      }

      // わざでフィルター
      const pokemonUrl = tr.querySelectorAll("td")[1].querySelector("a")!.href;
      const moveList = await getMove(pokemonUrl);
      if (!filterStatus.moveName.every(e => (moveList as string[]).some(ee => e === ee))) {
        tr.setAttribute("exclusion", "");
        continue;
      }
    }

    parent.insertBefore(result_area, next);
  }


  // タイプフィルター追加
  const pokemonTypeFilterArea: HTMLDivElement = document.createElement("div");
  pokemonTypeFilterArea.id = "filterArea";
  for (const typeUrl of typeUrlList) {
    const img: HTMLImageElement = document.createElement("img");
    pokemonTypeFilterArea.append(img);
    img.setAttribute("type", typeUrl[0]);
    img.src = typeUrl[1];
    img.classList.add("pokemonTypeFilterAreaImg");
    img.addEventListener("click", () => {
      if (img.getAttribute("check") !== null) {
        img.removeAttribute("check");
      } else if (pokemonTypeFilterArea.querySelectorAll("[check]").length <= 1) {
        img.setAttribute("check", "");
      } else {
        return;
      }
      filterStatus.pokemonType = Array.from(pokemonTypeFilterArea.querySelectorAll("[check]")).map(e => e.getAttribute("type")!);
      console.log(filterStatus.pokemonType);
      filterFunc();
    });
  }
  result_area.before(pokemonTypeFilterArea);

  // _blank付与
  for (let i: number = 1; i < trList.length; i++) {
    (trList[i].querySelectorAll("td")[1].querySelector("a") as HTMLAnchorElement).target = "_blank";
  }


  type FilterStatusType = {
    pokemonType: string[],
    moveName: string[]
  };
  /** フィルター用オブジェクト */
  const filterStatus: FilterStatusType = {
    pokemonType: [],
    moveName: []
  };

  // 列追加
  start = performance.now();
  for (let i: number = 0; i < trList.length; i++) {
    const tr: HTMLTableRowElement = trList[i];
    if (i === 0) {
      let start2: number = performance.now();
      tr.append(createTh("とくせい"));
      // const moveThElement = createTh("わざ");
      // moveThElement.style.display = "none";
      // tr.append(moveThElement);
      tr.append(movePowerElement);
      tr.append(hElement);
      tr.append(aElement);
      tr.append(bElement);
      tr.append(cElement);
      tr.append(dElement);
      tr.append(sElement);
      tr.append(tElement);
      tr.querySelectorAll("th").forEach(e => e.setAttribute("width", ""));
      // console.log(`ヘッダー_処理時間: ${performance.now() - start2} ms`);
    } else {

      let start2: number = performance.now();
      const tdList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");
      const no: number = Number(tdList[0].textContent);
      const name: string = tdList[1].textContent!.trim();
      /** ポケモンのタイプ. */
      const pokemonType: PokemonType[] = Array.from(tdList[2].querySelectorAll("img")).map(e => e.alt) as PokemonType[];
      const pokemonUrl: string = tr.querySelector("a")!.href;
      // console.log(`情報取得_処理時間: ${performance.now() - start2} ms`);

      // とくせい
      start2 = performance.now();
      let abilityNameList: string[] | undefined = await getAbility(pokemonUrl);
      if (!abilityNameList) {
        abilityNameList = [];
        const txt: string | undefined = await getPokemonMstData(pokemonUrl);
        const html: Document = new DOMParser().parseFromString(
          txt!,
          "text/html"
        );
        const h3List: NodeListOf<HTMLHeadingElement> = html.querySelectorAll("h3");
        for (const h3 of h3List) {
          const action = async (abilityNameList: string[], h3: HTMLHeadingElement) => {
            const table: HTMLTableElement = h3.nextElementSibling as HTMLTableElement;
            const trList: NodeListOf<HTMLTableRowElement> = table.querySelectorAll("tr:not(:first-child)");
            for (const tr of trList) {
              const tdList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");
              const abilityName: string = tdList[0].textContent!.trim();
              const abilityExplanation: string = tdList[1].textContent!.trim();
              abilityNameList.push(abilityName);

              const abilityMst: string | undefined = await getAbilityMst(abilityName);
              if (!abilityMst) {
                await insertAbilityMst(abilityName, abilityExplanation);
              }
            }
          };
          if (h3.textContent === "特性" && h3.nextElementSibling!.tagName === "TABLE") {
            await action(abilityNameList, h3);
          }
          if (h3.textContent === "夢特性(隠れ特性)" && h3.nextElementSibling!.tagName === "TABLE") {
            await action(abilityNameList, h3);
          }
        }
        await insertAbility(pokemonUrl, abilityNameList);
      }
      tr.append(createTd(abilityNameList.join(", ")));
      // console.log(`とくせい_処理時間: ${performance.now() - start2} ms`);

      // わざあるかな
      start2 = performance.now();
      let moveType = null;
      let moveNameList: string[] | undefined = await getMove(pokemonUrl);
      if (!moveNameList) {
        console.log(no, name, "わざないから作ろう！");
        // ないから作ろう！
        moveNameList = [];
        // まずはポケモンのマスタデータからHTMLを読み込んで
        const txt: string | undefined = await getPokemonMstData(pokemonUrl);
        const html: Document = new DOMParser().parseFromString(
          txt!,
          "text/html"
        );
        // そのHTMLからH3タグリストを取得して
        const h3List: NodeListOf<HTMLHeadingElement> = html.querySelectorAll("h3");
        for (const h3 of h3List) {
          // それぞれのH3タグに対して以下の処理を行う！
          const action = async (moveNameList: string[], h3: HTMLHeadingElement) => {
            // H3タグの後ろのテーブルを取得
            const table: HTMLTableElement = h3.nextElementSibling as HTMLTableElement;
            // テーブルのTRリストを取得して
            const trList: NodeListOf<HTMLTableRowElement> = table.querySelectorAll("tr");
                /** わざの位置 */ let c: number = -1;
            for (let i = 0; i < trList.length; i++) {
              const tr = trList[i];
              // まずはわざの列番号を取得
              if (i === 0) {
                const thList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("th");
                for (let j = 0; j < thList.length; j++) {
                  const th = thList[j];
                  if (/わざ|技/.test(th.textContent as string)) {
                    c = j;
                    break;
                  }
                }
                continue;
              }
              // そこからわざの名前を取得しよう！
              const tdList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");
              const moveName: string = tdList[c].textContent!.trim();
              moveNameList.push(moveName);
              const moveUrl: string | undefined = tdList[c].querySelector("a")?.href;
              // todo
              const moveType: PokemonType = tdList[c + 1].querySelector("img")?.alt.replace("タイプ", "") as PokemonType;
              const movePower: string = tdList[c + 2].textContent?.trim() as string;
              const moveAccuracy: string = tdList[c + 3].textContent?.trim() as string;
              const movePP: number = Number(tdList[c + 4].textContent?.trim());
              let moveCategory: string | undefined = "";
              let moveExplanation: string | undefined = "";
              (moveNameList as string[]).push(moveName);

              // あとで使うかもしれないからわざマスタもなければ作ろう！
              if (!await getMoveMst(moveName)) {
                // 無かったから作ろう！
                // わざマスタデータのHTMLを読み込んでわざマスタを作ろう！
                let moveMstData = await getMoveMstData(moveName);
                if (!moveMstData) {
                  // 大変だ！わざマスタデータがない！
                  // そんな時はわざURLからHTMLを開いてわざマスタデータを登録しよう！
                  if (!moveUrl) {
                    // 大変だ！わざURLが無い！
                    // そんな時はわざマスタデータを空で登録しちゃえ！
                    moveMstData = "";
                  } else {
                    // わざURLがある！
                    moveMstData = await (await fetch(moveUrl)).text();
                    await new Promise(r => setTimeout(r, 5000));
                  }
                  await insertMoveMstData(moveName, moveMstData);
                  await insertMoveMstDataExists(moveName);
                }
                const html: Document = new DOMParser().parseFromString(
                  (await getMoveMstData(moveName) as string),
                  "text/html"
                );
                // h3タグをループして わざ名+"の効果" を探そう！
                const h3List = html.querySelectorAll("h3");
                for (const h3 of h3List) {
                  if (h3.textContent === moveName + "の効果" && h3.nextElementSibling?.tagName === "TABLE") {
                    // thタグをループして効果と分類を探そう！
                    const thList = h3.nextElementSibling.querySelectorAll("th");
                    for (const th of thList) {
                      if (th.textContent === "効果") {
                        moveExplanation = th.nextElementSibling?.textContent?.trim();
                      } else if (th.textContent === "分類") {
                        moveCategory = th.nextElementSibling?.textContent?.trim();
                      }
                      if (moveExplanation !== "" && moveCategory != "") break;
                    }
                    break;
                  }
                }
                // わざマスタを登録しよう！
                await insertMoveMst({
                  MOVE_NAME: moveName,
                  MOVE_TYPE: moveType as PokemonType,
                  MOVE_POWER: movePower,
                  MOVE_ACCURACY: moveAccuracy,
                  MOVE_PP: movePP,
                  MOVE_CATEGORY: moveCategory,
                  MOVE_EXPLANATION: moveExplanation
                });
              }
            }
          };
          if (/わざ|技/.test(h3.textContent as string) && h3.nextElementSibling!.tagName === "TABLE") {
            await action(moveNameList, h3);
          }
        }
        // わざを登録しよう！
        moveNameList = [...new Set(moveNameList)];
        await insertMove(pokemonUrl, moveNameList);
      }
      // const moveTdElement = createTd(moveNameList.join(", "));
      // moveTdElement.style.display = "none";
      // tr.append(moveTdElement);
      // console.log(`わざ_処理時間: ${performance.now() - start2} ms`);

      // 最大威力
      const maxMoveElement = createTd("最大威力");
      tr.append(maxMoveElement);

      start2 = performance.now();
      let habcds: any = await getHabcds(pokemonUrl);
      let [h, a, b, c, d, s, t]: (any | null)[] = [null, null, null, null, null, null, null];
      if (!habcds) {
        const txt: string | undefined = await getPokemonMstData(pokemonUrl);
        const html: Document = new DOMParser().parseFromString(
          txt!,
          "text/html"
        );
        for (const td of html.querySelectorAll("td.center")) {
          if (td.textContent === "HP") {
            if (!h) h = td.nextElementSibling!.textContent!.trim();
            if (h && a && b && c && d && s) break;
            continue;
          }
          if (td.textContent === "攻撃") {
            if (!a) a = td.nextElementSibling!.textContent!.trim();
            if (h && a && b && c && d && s) break;
            continue;
          }
          if (td.textContent === "防御") {
            if (!b) b = td.nextElementSibling!.textContent!.trim();
            if (h && a && b && c && d && s) break;
            continue;
          }
          if (td.textContent === "特攻") {
            if (!c) c = td.nextElementSibling!.textContent!.trim();
            if (h && a && b && c && d && s) break;
            continue;
          }
          if (td.textContent === "特防") {
            if (!d) d = td.nextElementSibling!.textContent!.trim();
            if (h && a && b && c && d && s) break;
            continue;
          }
          if (td.textContent === "素早さ") {
            if (!s) s = td.nextElementSibling!.textContent!.trim();
            if (h && a && b && c && d && s) break;
            continue;
          }
        }
        if (h && a && b && c && d && s) {
          await insertHabcds(pokemonUrl, h, a, b, c, d, s);
          t = Number(h) + Number(a) + Number(b) + Number(c) + Number(d) + Number(s)
        }
      } else {
        [h, a, b, c, d, s, t] = [habcds.H, habcds.A, habcds.B, habcds.C, habcds.D, habcds.S, habcds.T];
      }
      // console.log(`HABCDS取得_処理時間: ${performance.now() - start2} ms`);

      start2 = performance.now();
      tr.append(createTd(h));
      tr.append(createTd(a));
      tr.append(createTd(b));
      tr.append(createTd(c));
      tr.append(createTd(d));
      tr.append(createTd(s));
      tr.append(createTd(t));
      // console.log(`HABCDS_処理時間: ${performance.now() - start2} ms`);

      start2 = performance.now();
      new Promise(async r => {
        let maxMovePowerTxt: string = await getMaxMovePowerTxt(pokemonUrl, pokemonType);
        if (!maxMovePowerTxt) {
          let maxMoveRes: MaxMovePowerType = await getMaxMovePower(pokemonUrl, pokemonType);
          if (!maxMoveRes) {
            console.log(no, name, "DBに最大火力指数が登録されていないので計算します！");
            maxMoveRes = await maxMove(name, pokemonType, a, c, moveNameList);
            console.log(no, name, "最大火力指数をDBに登録します！");
            await insertMaxMovePower(pokemonUrl, pokemonType, maxMoveRes);
          }
          maxMovePowerTxt = `${maxMoveRes.MOVE_NAME}(${maxMoveRes.MOVE_TYPE}_${maxMoveRes.MOVE_POWER}): ${maxMoveRes.MOVE_MAX_POWER}`;
          await insertMaxMovePowerTxt(pokemonUrl, pokemonType, maxMovePowerTxt);
        }

        maxMoveElement.textContent = maxMovePowerTxt;
        r("");
      });
      // console.log(no, name, `最大火力指数_処理時間: ${performance.now() - start2} ms`);

      // 最大威力
      start2 = performance.now();
      // console.log(`最大威力_処理時間: ${performance.now() - start2} ms`);

    }
  }

  console.log(`列追加_処理時間: ${performance.now() - start} ms`);

  // とくせいフィルター追加
  let start2: number = performance.now();
  const abilityFilterArea: HTMLSelectElement = document.createElement("select");
  result_area.before(abilityFilterArea);
  const option: HTMLOptionElement = document.createElement("option");
  abilityFilterArea.append(option);
  for (const abilityName of await getAllAbilityMst()) {
    const option: HTMLOptionElement = document.createElement("option");
    option.value = abilityName;
    option.textContent = abilityName;
    abilityFilterArea.append(option);
  }
  console.log(`とくせいフィルター追加_処理時間: ${performance.now() - start2} ms`);

  // わざフィルター追加
  わざフィルター();
  async function わざフィルター() {

    const moveFilterArea: HTMLDivElement = document.createElement("div");
    result_area.before(moveFilterArea);
    moveFilterArea.id = "moveFilterArea";
    const moveFilterAreaKeyword = document.createElement("input");
    moveFilterArea.append(moveFilterAreaKeyword);
    moveFilterAreaKeyword.id = "moveFilterAreaKeyword";
    const moveFilterSuggestions = document.createElement("div");
    moveFilterArea.after(moveFilterSuggestions);
    moveFilterSuggestions.id = "moveFilterSuggestions";
    moveFilterSuggestions.popover = "manual";
    type Move = [string, string, string];

    let moveList: Move[] = [
      ["10まんボルト", "でんき / 威力90 / 命中100", "みゅ"],
      ["かえんほうしゃ", "ほのお / 威力90 / 命中100", "みゅ"],
      ["れいとうビーム", "こおり / 威力90 / 命中100", "みゅ"],
      ["シャドーボール", "ゴースト / 威力80 / 命中100", "みゅ"],
      ["じしん", "じめん / 威力100 / 命中100", "みゅ"],
      ["ハイドロポンプ", "みず / 威力110 / 命中80", "みゅ"],
      ["ラスターカノン", "はがね / 威力80 / 命中100", "みゅ"],
      ["エアスラッシュ", "ひこう / 威力75 / 命中95", "みゅ"],
      ["あくのはどう", "あく / 威力80 / 命中100", "みゅ"],
      ["サイコキネシス", "エスパー / 威力90 / 命中100", "みゅ"],
      ["ムーンフォース", "フェアリー / 威力95 / 命中100", "みゅ"],
      ["インファイト", "かくとう / 威力120 / 命中100", "みゅ"]
    ];

    moveList = (await getAllMoveMst()).map(e => [
      e.MOVE_NAME,
      `${e.MOVE_TYPE} / 威力${e.MOVE_POWER} / 命中${e.MOVE_ACCURACY}`,
      e.MOVE_EXPLANATION,
    ] as Move);

    const selectedMoves: string[] = [];

    let activeIndex = -1;

    const normalize = (str: string): string =>
      str
        .normalize("NFKC")
        .replace(/[\u30a1-\u30f6]/g, s =>
          String.fromCharCode(
            s.charCodeAt(0) - 0x60
          )
        );

    const filteredMoves = (): Move[] => {
      const value =
        normalize(moveFilterAreaKeyword.value.trim());

      return moveList.filter(([name]) =>
        !selectedMoves.includes(name) &&
        (
          !value ||
          normalize(name).includes(value)
        )
      );
    };

    const updatePosition = (): void => {
      const rect =
        moveFilterArea.getBoundingClientRect();

      moveFilterSuggestions.style.left =
        `${rect.left}px`;

      moveFilterSuggestions.style.top =
        `${rect.bottom + 4}px`;

      moveFilterSuggestions.style.width =
        `${rect.width}px`;
    };

    const openMoveFilterSuggestions = (): void => {
      updatePosition();

      moveFilterSuggestions.style.display = "block";
    };

    const closeMoveFilterSuggestions = (): void => {
      moveFilterSuggestions.style.display = "none";
    };

    const renderTags = (): void => {
      moveFilterArea
        .querySelectorAll(".tag")
        .forEach(v => v.remove());

      selectedMoves.forEach(name => {
        const tag = document.createElement("div");

        tag.className = "tag";

        tag.innerHTML = `
          <span>${name}</span>
          <span class="remove">×</span>
        `;

        (
          tag.querySelector(".remove") as HTMLSpanElement
        ).onclick = () => {
          selectedMoves.splice(
            selectedMoves.indexOf(name),
            1
          );

          renderTags();
          renderMoveFilterSuggestions();

          filterStatus.moveName = Array.from(moveFilterArea.querySelectorAll("div")).map(e => e.querySelectorAll("span")[0].textContent) as string[];
          filterFunc();
        };

        moveFilterArea.insertBefore(
          tag,
          moveFilterAreaKeyword
        );
      });
    };

    const selectMove = (name: string): void => {
      selectedMoves.push(name);

      moveFilterAreaKeyword.value = "";

      activeIndex = -1;

      renderTags();
      renderMoveFilterSuggestions();

      moveFilterAreaKeyword.focus();

      filterStatus.moveName = Array.from(moveFilterArea.querySelectorAll("div")).map(e => e.querySelectorAll("span")[0].textContent) as string[];
      filterFunc();
    };

    const renderMoveFilterSuggestions = (): void => {
      const list = filteredMoves();

      if (!list.length) {
        activeIndex = -1;

        closeMoveFilterSuggestions();

        return;
      }

      if (activeIndex >= list.length) {
        activeIndex = 0;
      }

      moveFilterSuggestions.innerHTML = "";

      list.forEach(([name, desc1, desc2], i) => {
        const item =
          document.createElement("div");

        item.className =
          `item ${i === activeIndex
            ? "active"
            : ""
          }`;

        item.innerHTML = `
<div>${name}</div>
<div class="description">
  ${desc1}
</div>
<div class="description">
  ${desc2}
</div>
        `;

        item.onmousedown = (
          e: MouseEvent
        ): void => {
          e.preventDefault();

          selectMove(name);

        };

        moveFilterSuggestions.append(item);
      });

      openMoveFilterSuggestions();

      if (activeIndex >= 0) {
        (
          moveFilterSuggestions.children[
          activeIndex
          ] as HTMLElement
        )?.scrollIntoView({
          block: "nearest"
        });
      }
    };



    moveFilterAreaKeyword.oninput = (): void => {
      activeIndex = -1;

      renderMoveFilterSuggestions();
    };


    moveFilterAreaKeyword.onfocus =
      renderMoveFilterSuggestions;

    moveFilterArea.onclick = (): void =>
      moveFilterAreaKeyword.focus();


    moveFilterAreaKeyword.onkeydown = (
      e: KeyboardEvent
    ): void => {
      const list = filteredMoves();

      if (!list.length) {
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();

        activeIndex =
          (activeIndex + 1)
          % list.length;

        renderMoveFilterSuggestions();
      }

      else if (e.key === "ArrowUp") {
        e.preventDefault();

        activeIndex =
          (
            activeIndex - 1 +
            list.length
          ) % list.length;

        renderMoveFilterSuggestions();
      }

      else if (e.key === "Enter") {
        if (activeIndex >= 0) {
          e.preventDefault();

          selectMove(
            list[activeIndex][0]
          );
        }
      }

      else if (
        e.key === "Backspace" &&
        !moveFilterAreaKeyword.value &&
        selectedMoves.length
      ) {
        e.preventDefault();

        moveFilterAreaKeyword.value =
          selectedMoves.pop()!;

        activeIndex = -1;

        renderTags();
        renderMoveFilterSuggestions();

        if (moveFilterAreaKeyword.value) {
          filterStatus.moveName = Array.from(moveFilterArea.querySelectorAll("div")).map(e => e.querySelectorAll("span")[0].textContent) as string[];
          filterFunc();
        }

        requestAnimationFrame(() =>
          moveFilterAreaKeyword.setSelectionRange(
            moveFilterAreaKeyword.value.length,
            moveFilterAreaKeyword.value.length
          )
        );
      }
    };




    document.onclick = (
      e: MouseEvent
    ): void => {
      const target =
        e.target as Node | null;

      if (
        !moveFilterArea.contains(target) &&
        !moveFilterSuggestions.contains(target)
      ) {
        closeMoveFilterSuggestions();
      }
    };




    window.addEventListener(
      "resize",
      updatePosition
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );


  }

  // こうげきが高い順にソート
  const sortEvent = (i: number, isAsc: boolean = false) => {
    const rows: {
      no: number;
      name: string;
      attack: number;
      tr: HTMLTableRowElement;
    }[] = [];

    for (const tr of Array.from(trList).slice(1)) {
      const tdList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");

      const no: number = Number(tdList[0].textContent!.trim());
      const name: string = tdList[1].textContent!.trim();
      const attack: number = Number(tdList[i].textContent!.trim());

      rows.push({ no, name, attack, tr });
    }

    rows.sort((a, b) =>
      isAsc
        ? a.attack - b.attack
        : b.attack - a.attack
    );

    const tbody: HTMLElement = trList[0].parentNode as HTMLElement;

    for (const row of rows) {
      tbody.appendChild(row.tr);
    }
  };

  const movePowerSortEvent = (i: number) => {
    const rows: { no: number; name: string; attack: number; tr: HTMLTableRowElement }[] = [];
    for (const tr of Array.from(trList).slice(1)) {
      const tdList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");
      const no: number = Number(tdList[0].textContent!.trim());
      const name: string = tdList[1].textContent!.trim();
      // "リーフストーム(くさ_130): 12675".match(/\: \d+/)[0].match(/\d+/)
      const attack: number = Number(tdList[i].textContent!.trim().match(/\: \d+/)![0].match(/\d+/)![0]);
      rows.push({ no, name, attack, tr });
    }
    rows.sort((a, b) => b.attack - a.attack);
    const tbody: HTMLElement = trList[0].parentNode as HTMLElement;
    for (const row of rows) {
      tbody.appendChild(row.tr);
    }
  };
  trList[0].querySelectorAll("th")[0].addEventListener("click", () => sortEvent(0, true));
  movePowerElement.addEventListener("click", () => movePowerSortEvent(5));
  aElement.addEventListener("click", () => sortEvent(6));
  cElement.addEventListener("click", () => sortEvent(8));
  sElement.addEventListener("click", () => sortEvent(10));

  /** こうげきする側のタイプ: {こうげきされる側のタイプ: 相性} */
  const Matchup = {
    ノーマル: { ノーマル: "　", ほのお: "　", みず: "　", でんき: "　", くさ: "　", こおり: "　", かくとう: "　", どく: "　", じめん: "　", ひこう: "　", エスパー: "　", むし: "　", いわ: "△", ゴースト: "×", ドラゴン: "　", あく: "　", はがね: "△", フェアリー: "　" },
    ほのお: { ノーマル: "　", ほのお: "△", みず: "△", でんき: "　", くさ: "⚪︎", こおり: "⚪︎", かくとう: "　", どく: "　", じめん: "　", ひこう: "　", エスパー: "　", むし: "⚪︎", いわ: "△", ゴースト: "　", ドラゴン: "△", あく: "　", はがね: "⚪︎", フェアリー: "　" },
    みず: { ノーマル: "　", ほのお: "⚪︎", みず: "△", でんき: "　", くさ: "△", こおり: "　", かくとう: "　", どく: "　", じめん: "⚪︎", ひこう: "　", エスパー: "　", むし: "　", いわ: "⚪︎", ゴースト: "　", ドラゴン: "△", あく: "　", はがね: "　", フェアリー: "　" },
    でんき: { ノーマル: "　", ほのお: "　", みず: "⚪︎", でんき: "△", くさ: "△", こおり: "　", かくとう: "　", どく: "　", じめん: "×", ひこう: "⚪︎", エスパー: "　", むし: "　", いわ: "　", ゴースト: "　", ドラゴン: "△", あく: "　", はがね: "　", フェアリー: "　" },
    くさ: { ノーマル: "　", ほのお: "△", みず: "⚪︎", でんき: "　", くさ: "△", こおり: "　", かくとう: "　", どく: "△", じめん: "⚪︎", ひこう: "△", エスパー: "　", むし: "△", いわ: "⚪︎", ゴースト: "　", ドラゴン: "△", あく: "　", はがね: "△", フェアリー: "　" },
    こおり: { ノーマル: "　", ほのお: "△", みず: "△", でんき: "　", くさ: "⚪︎", こおり: "△", かくとう: "　", どく: "　", じめん: "⚪︎", ひこう: "⚪︎", エスパー: "　", むし: "　", いわ: "　", ゴースト: "　", ドラゴン: "⚪︎", あく: "　", はがね: "△", フェアリー: "　" },
    かくとう: { ノーマル: "⚪︎", ほのお: "　", みず: "　", でんき: "　", くさ: "　", こおり: "⚪︎", かくとう: "　", どく: "△", じめん: "　", ひこう: "△", エスパー: "△", むし: "△", いわ: "⚪︎", ゴースト: "×", ドラゴン: "　", あく: "⚪︎", はがね: "⚪︎", フェアリー: "△" },
    どく: { ノーマル: "　", ほのお: "　", みず: "　", でんき: "　", くさ: "⚪︎", こおり: "　", かくとう: "　", どく: "△", じめん: "△", ひこう: "　", エスパー: "　", むし: "　", いわ: "△", ゴースト: "△", ドラゴン: "　", あく: "　", はがね: "×", フェアリー: "⚪︎" },
    じめん: { ノーマル: "　", ほのお: "⚪︎", みず: "　", でんき: "⚪︎", くさ: "△", こおり: "　", かくとう: "　", どく: "⚪︎", じめん: "　", ひこう: "×", エスパー: "　", むし: "△", いわ: "⚪︎", ゴースト: "　", ドラゴン: "　", あく: "　", はがね: "⚪︎", フェアリー: "　" },
    ひこう: { ノーマル: "　", ほのお: "　", みず: "　", でんき: "△", くさ: "⚪︎", こおり: "　", かくとう: "⚪︎", どく: "　", じめん: "　", ひこう: "　", エスパー: "　", むし: "⚪︎", いわ: "△", ゴースト: "　", ドラゴン: "　", あく: "　", はがね: "△", フェアリー: "　" },
    エスパー: { ノーマル: "　", ほのお: "　", みず: "　", でんき: "　", くさ: "　", こおり: "　", かくとう: "⚪︎", どく: "⚪︎", じめん: "　", ひこう: "　", エスパー: "△", むし: "　", いわ: "　", ゴースト: "　", ドラゴン: "　", あく: "×", はがね: "△", フェアリー: "　" },
    むし: { ノーマル: "　", ほのお: "△", みず: "　", でんき: "　", くさ: "⚪︎", こおり: "　", かくとう: "△", どく: "△", じめん: "　", ひこう: "△", エスパー: "⚪︎", むし: "　", いわ: "　", ゴースト: "△", ドラゴン: "　", あく: "⚪︎", はがね: "△", フェアリー: "△" },
    いわ: { ノーマル: "　", ほのお: "⚪︎", みず: "　", でんき: "　", くさ: "　", こおり: "⚪︎", かくとう: "△", どく: "　", じめん: "△", ひこう: "⚪︎", エスパー: "　", むし: "⚪︎", いわ: "　", ゴースト: "　", ドラゴン: "　", あく: "　", はがね: "△", フェアリー: "　" },
    ゴースト: { ノーマル: "×", ほのお: "　", みず: "　", でんき: "　", くさ: "　", こおり: "　", かくとう: "　", どく: "　", じめん: "　", ひこう: "　", エスパー: "⚪︎", むし: "　", いわ: "　", ゴースト: "⚪︎", ドラゴン: "　", あく: "△", はがね: "　", フェアリー: "　" },
    ドラゴン: { ノーマル: "　", ほのお: "　", みず: "　", でんき: "　", くさ: "　", こおり: "　", かくとう: "　", どく: "　", じめん: "　", ひこう: "　", エスパー: "　", むし: "　", いわ: "　", ゴースト: "　", ドラゴン: "⚪︎", あく: "　", はがね: "△", フェアリー: "×" },
    あく: { ノーマル: "　", ほのお: "　", みず: "　", でんき: "　", くさ: "　", こおり: "　", かくとう: "△", どく: "　", じめん: "　", ひこう: "　", エスパー: "⚪︎", むし: "　", いわ: "　", ゴースト: "⚪︎", ドラゴン: "　", あく: "△", はがね: "　", フェアリー: "△" },
    はがね: { ノーマル: "　", ほのお: "△", みず: "△", でんき: "△", くさ: "　", こおり: "⚪︎", かくとう: "　", どく: "　", じめん: "　", ひこう: "　", エスパー: "　", むし: "　", いわ: "⚪︎", ゴースト: "　", ドラゴン: "　", あく: "　", はがね: "△", フェアリー: "⚪︎" },
    フェアリー: { ノーマル: "　", ほのお: "△", みず: "　", でんき: "　", くさ: "　", こおり: "　", かくとう: "⚪︎", どく: "△", じめん: "　", ひこう: "　", エスパー: "　", むし: "　", いわ: "　", ゴースト: "　", ドラゴン: "⚪︎", あく: "⚪︎", はがね: "△", フェアリー: "　" }
  };

  async function maxMove(
    /** デバッグ用にポケモンのタイプも取得しておこう */
    pokemonName: string,
    /** ポケモンのタイプ. */
    pokemonType: PokemonType[],
    /** ポケモンのこうげき種族値. */
    a: number,
    /** ポケモンのとくこう種族値. */
    c: number,
    /** ポケモンのわざ名リスト. */
    moveNameList: string[]
  ): Promise<{
    MOVE_NAME: string,
    MOVE_TYPE: string,
    MOVE_POWER: number,
    MOVE_MAX_POWER: number
  }> {
    /* わざをループ. */
    let tmp: {
      MOVE_NAME: string,
      MOVE_TYPE: string,
      MOVE_POWER: number,
      MOVE_MAX_POWER: number
    } = {
      MOVE_NAME: "",
      MOVE_TYPE: "",
      MOVE_POWER: 0,
      MOVE_MAX_POWER: 0
    };
    for (const moveName of moveNameList) {
      const move = await getMoveMst(moveName);
      if (!/^\d+$/.test(move?.MOVE_POWER as string)) continue;
      const タイプ一致 = pokemonType.some(e => e === move?.MOVE_TYPE) ? 1.5 : 1;
      const 種族値 = move?.MOVE_CATEGORY === "物理" ? a : c;
      const 威力 = Number(move?.MOVE_POWER);
      const 火力指標 = 威力 * 種族値 * タイプ一致;
      if (tmp.MOVE_MAX_POWER < 火力指標) {
        tmp = {
          MOVE_NAME: moveName,
          MOVE_TYPE: move?.MOVE_TYPE as string,
          MOVE_POWER: Number(move?.MOVE_POWER),
          MOVE_MAX_POWER: 火力指標
        };
      }
    }
    console.log(pokemonName, tmp);
    return tmp;
  }

  document.body.style.display = "unset";

})();

// npx tsc kentate.ts --target esnext --lib dom,esnext
// npx -p typescript tsc kentate.ts --target esnext --lib dom,esnext
