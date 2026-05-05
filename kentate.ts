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

  alert("tsで書いたよ！")

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
  `;
  document.body.append(newStyle);

  (document.querySelector(".l-2colSide") as HTMLElement).remove();
  document.querySelectorAll(".ad-wrapper").forEach(e => e.remove());
  (document.querySelector(".l-2colMain") as HTMLElement).style.width = "100%";
  (document.querySelector(".l-2colMain__center") as HTMLElement).style.width = "100%";
  (document.querySelector("#hl_1")!.nextElementSibling as HTMLElement).remove();
  (document.querySelector("#hl_1") as HTMLElement).remove();

  const typeUrlList: string[][] = [
    ["ノーマル", "https://img.game8.jp/3735996/d91b93f4a89006df9fdcb3de5667c70b.jpeg/show"],
    ["ほのお", "https://img.game8.jp/3735991/ff60afe9523ded574a3f3e18019ddd64.jpeg/show"],
    ["みず", "https://img.game8.jp/3735998/a2ece50c9c322ffc5a16f5f3fb505428.jpeg/show"],
    ["でんき", "https://img.game8.jp/3735993/4c6c06e09fc8f9889829c6909703d2ad.jpeg/show"],
    ["くさ", "https://img.game8.jp/3735987/3ee05123c7061d77a15e34acdfebb527.jpeg/show"],
    ["こおり", "https://img.game8.jp/3735992/242b3bc6d26a1dc633f0d12af37046d3.jpeg/show"],
    ["かくとう", "https://img.game8.jp/3735997/08ebbb243e59b71e053d9ff7668a8f8f.jpeg/show"],
    ["どく", "https://img.game8.jp/3735988/edda03d318b9fb398f1688babbce09ce.jpeg/show"],
    ["じめん", "https://img.game8.jp/3735986/b52d471b041ac05b2e66054c57304ac9.jpeg/show"],
    ["ひこう", "https://img.game8.jp/3735989/ead490e70f8f5537536d6c9bf12b4aef.jpeg/show"],
    ["エスパー", "https://img.game8.jp/3736002/d9adcf5a7c7d86d4c51c84688320f03a.jpeg/show"],
    ["むし", "https://img.game8.jp/3736003/bbecd27c88e08ad7a79d01c90e217ae5.jpeg/show"],
    ["いわ", "https://img.game8.jp/3735990/5d60b08c61ffe0737c7a5533181ff2f2.jpeg/show"],
    ["ゴースト", "https://img.game8.jp/3736000/957ad3d525deaa001cefb3e54b181b81.jpeg/show"],
    ["ドラゴン", "https://img.game8.jp/3735995/a346923a25e1a33fcbe65dd4acd6a6cb.jpeg/show"],
    ["あく", "https://img.game8.jp/3735999/0abc4eb33dfbd21b707baae478be76b8.jpeg/show"],
    ["はがね", "https://img.game8.jp/3735994/9bf88e7a84e524139fe9eb0182ca41fb.jpeg/show"],
    ["フェアリー", "https://img.game8.jp/3736001/e7dc0b01568c50d1ed1e862e21c5c2f6.jpeg/show"]
  ];

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
  const DB_VERSION: number = 2;

  // indexedDB.deleteDatabase(DB_NAME);

  const db = await new Promise<IDBDatabase>(function (resolve, reject) {
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
    };

    req.onsuccess = (e: Event) => resolve((e.target as IDBOpenDBRequest).result);
  });

  const storeHabcds = (mode: IDBTransactionMode): IDBObjectStore => db.transaction(SN_HABCDS, mode).objectStore(SN_HABCDS);
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

  const storeAbility = (mode: IDBTransactionMode): IDBObjectStore => db.transaction(SN_ABILITY, mode).objectStore(SN_ABILITY);
  const insertAbility = (url: string, abilityNameList: string[]): Promise<void> => new Promise((resolve) => storeAbility("readwrite").put({ URL: url, ABILITY_NAME_LIST: abilityNameList }).onsuccess = () => resolve());
  const getAbility = (url: string): Promise<string[] | undefined> => new Promise((resolve) => storeAbility("readonly").get(url).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.ABILITY_NAME_LIST));

  const storeAbilityMst = (mode: IDBTransactionMode): IDBObjectStore => db.transaction(SN_ABILITY_MST, mode).objectStore(SN_ABILITY_MST);
  const insertAbilityMst = (abilityName: string, abilitExplanation: string): Promise<void> => new Promise((resolve) => storeAbilityMst("readwrite").put({ ABILITY_NAME: abilityName, ABILITY_EXPLANATION: abilitExplanation }).onsuccess = () => resolve());
  const getAbilityMst = (abilityName: string): Promise<string | undefined> => new Promise((resolve) => storeAbilityMst("readonly").get(abilityName).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.ABILITY_EXPLANATION));
  const getAllAbilityMst = (): Promise<string[]> => new Promise((resolve) => storeAbilityMst("readonly").getAll().onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.map((e: any) => e.ABILITY_NAME).flat()));

  const storeMove = (mode: IDBTransactionMode): IDBObjectStore => db.transaction(SN_MOVE, mode).objectStore(SN_MOVE);
  const insertMove = (url: string, moveNameList: any[]): Promise<void> => new Promise((resolve) => storeMove("readwrite").put({ URL: url, MOVE_NAME_LIST: moveNameList }).onsuccess = () => resolve());
  const getMove = (url: string): Promise<any[] | undefined> => new Promise((resolve) => storeMove("readonly").get(url).onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.MOVE_NAME_LIST));

  const storeMoveMst = (mode: IDBTransactionMode): IDBObjectStore => db.transaction(SN_MOVE_MST, mode).objectStore(SN_MOVE_MST);
  const insertMoveMst = (
    /** わざ名. */
    moveName: string,
    moveType: string,
    movePower: string,
    moveAccuracy: string,
    movePP: number,
    moveCategory: string | undefined,
    moveExplanation: string | undefined
  ): Promise<void> => new Promise((resolve) => storeMoveMst("readwrite").put({
    MOVE_NAME: moveName,
    MOVE_TYPE: moveType,
    MOVE_POWER: movePower,
    MOVE_ACCURACY: moveAccuracy,
    MOVE_PP: movePP,
    MOVE_CATEGORY: moveCategory,
    MOVE_EXPLANATION: moveExplanation
  }).onsuccess = () => resolve());
  const getMoveMst = (moveName: string): Promise<string | undefined> => new Promise((resolve) => storeMoveMst("readonly").get(moveName).onsuccess = (e: Event) => resolve((e.target as IDBRequest).result));
  const getAllMoveMst = (): Promise<string[]> => new Promise((resolve) => storeMoveMst("readonly").getAll().onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.map((e: any) => e.MOVE_NAME).flat()));

  // const getAllMoveMst = (): Promise<string[]> => new Promise((resolve) => storeMoveMst("readonly").getAll().onsuccess = (e: Event) => resolve(((e.target as IDBRequest).result)?.map((e: any) => e.MOVE_NAME).flat()));

  // result_areaを取得する
  const result_area: HTMLElement = document.querySelector("#result_area")!;
  const trList = await new Promise<NodeListOf<HTMLTableRowElement>>(async r => {
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

  const hElement: HTMLTableCellElement = createTh("HP");
  const aElement: HTMLTableCellElement = createTh("こうげき");
  const bElement: HTMLTableCellElement = createTh("ぼうぎょ");
  const cElement: HTMLTableCellElement = createTh("とくこう");
  const dElement: HTMLTableCellElement = createTh("とくぼう");
  const sElement: HTMLTableCellElement = createTh("すばやさ");
  const tElement: HTMLTableCellElement = createTh("合計");

  // タイプフィルター追加
  const filterArea: HTMLDivElement = document.createElement("div");
  filterArea.id = "filterArea";
  for (const typeUrl of typeUrlList) {
    const img: HTMLImageElement = document.createElement("img");
    img.setAttribute("type", typeUrl[0]);
    img.src = typeUrl[1];
    filterArea.append(img);
    img.addEventListener("click", () => {
      if (img.getAttribute("check") !== null) {
        img.removeAttribute("check");
      } else if (filterArea.querySelectorAll("[check]").length <= 1) {
        img.setAttribute("check", "");
      }
      const filterList: string[] = Array.from(filterArea.querySelectorAll("[check]")).map(e => e.getAttribute("type")!);
      if (filterList.length > 0) {
        for (let i: number = 1; i < trList.length; i++) {
          const tr: HTMLTableRowElement = trList[i];
          const td: HTMLTableCellElement = tr.querySelectorAll("td")[2];
          tr.removeAttribute("exclusion");
          const imgList: NodeListOf<HTMLImageElement> = td.querySelectorAll('img');
          if (filterList.length > imgList.length) {
            tr.setAttribute("exclusion", "");
          } else {
            for (const type of filterList) {
              if (!td.querySelector('[alt="' + type + '"]')) {
                tr.setAttribute("exclusion", "");
              }
            }
          }
        }
      } else {
        for (let i: number = 1; i < trList.length; i++) {
          trList[i].removeAttribute("exclusion");
        }
      }
    });
  }
  result_area.before(filterArea);

  // _blank付与
  for (let i: number = 1; i < trList.length; i++) {
    (trList[i].querySelectorAll("td")[1].querySelector("a") as HTMLAnchorElement).target = "_blank";
  }

  // 列追加
  start = performance.now();
  for (let i: number = 0; i < trList.length; i++) {
    const tr: HTMLTableRowElement = trList[i];
    if (i === 0) {
      tr.append(createTh("とくせい"));
      const moveThElement = createTh("わざ");
      moveThElement.style.display = "none";
      tr.append(moveThElement);
      tr.append(hElement);
      tr.append(aElement);
      tr.append(bElement);
      tr.append(cElement);
      tr.append(dElement);
      tr.append(sElement);
      tr.append(tElement);
      tr.querySelectorAll("th").forEach(e => e.setAttribute("width", ""));
    } else {

      const tdList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");
      const no: number = Number(tdList[0].textContent);
      const name: string = tdList[1].textContent!.trim();
      const pokemonUrl: string = tr.querySelector("a")!.href;

      // とくせい
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

      // わざあるかな
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
              const moveType: string = tdList[c + 1].querySelector("img")?.alt.replace("タイプ", "") as string;
              const movePower: string = tdList[c + 2].textContent?.trim() as string;
              const moveAccuracy: string = tdList[c + 3].textContent?.trim() as string;
              const movePP: number = Number(tdList[c + 4].textContent?.trim());
              let moveCategory: string| undefined = "";
              let moveExplanation: string| undefined = "";
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
                await insertMoveMst(
                  moveName,
                  moveType,
                  movePower,
                  moveAccuracy,
                  movePP,
                  moveCategory,
                  moveExplanation
                );
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
      const moveTdElement = createTd(moveNameList.join(", "));
      moveTdElement.style.display = "none";
      tr.append(moveTdElement);

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

      tr.append(createTd(h));
      tr.append(createTd(a));
      tr.append(createTd(b));
      tr.append(createTd(c));
      tr.append(createTd(d));
      tr.append(createTd(s));
      tr.append(createTd(t));
    }
  }
  console.log(`列追加_処理時間: ${performance.now() - start} ms`);

  // とくせいフィルター追加
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

  // こうげきが高い順にソート
  const sortEvent = (i: number) => {
    const rows: { no: number; name: string; attack: number; tr: HTMLTableRowElement }[] = [];
    for (const tr of Array.from(trList).slice(1)) {
      const tdList: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");
      const no: number = Number(tdList[0].textContent!.trim());
      const name: string = tdList[1].textContent!.trim();
      const attack: number = Number(tdList[i].textContent!.trim());
      rows.push({ no, name, attack, tr });
    }
    rows.sort((a, b) => b.attack - a.attack);
    const tbody: HTMLElement = trList[0].parentNode as HTMLElement;
    for (const row of rows) {
      tbody.appendChild(row.tr);
    }
  };
  aElement.addEventListener("click", () => sortEvent(6));
  cElement.addEventListener("click", () => sortEvent(8));
  sElement.addEventListener("click", () => sortEvent(10));
  alert("準備完了");
})();

// npx -p typescript tsc kentate.ts --target esnext --lib dom,esnext
