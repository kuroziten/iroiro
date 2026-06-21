// ==UserScript==
// @name         ダメージ計算
// @namespace    http://tampermonkey.net/
// @version      2026-06-21
// @description  try to take over the world!
// @author       You
// @match        https://sv.pokesol.com/calc
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokesol.com
// @grant        none
// ==/UserScript==

(async function() {
    await new Promise(r => setTimeout(r, 1500));
    const DB_NAME = "mydb";
    const STORE_NAME = "items";

    const h4Defender = document.querySelectorAll("h4")[1];
    console.log("h4Defender", h4Defender);

    const myPokemonArea = h4Defender.parentNode.nextElementSibling;
    console.log("myPokemonArea", myPokemonArea);

    const myPokemonAreaDivList = myPokemonArea
    .querySelector(":scope > div")
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[1]
    .querySelectorAll(":scope > div");





    /* 名前エリア. */
    const myPokemonNameElement = myPokemonAreaDivList[0] // 名前エリアを指定
    .querySelector(":scope > div")
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[1]
    .querySelector(":scope > div")
    .querySelector(":scope > div")
    .querySelector(":scope > div")
    .querySelector(":scope > div")
    .querySelector("input")
    ;
    console.log("myPokemonNameElement", myPokemonNameElement);





    /* タイプエリア. */
    const myPokemonTypeElement = myPokemonAreaDivList[1] // タイプエリアを指定
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[0]
    .querySelector(":scope > div")
    .querySelector("input")
    ;
    console.log("myPokemonTypeElement", myPokemonTypeElement);





    /* HPエリア. */
    const myPokemonHPButtonButtonList = myPokemonAreaDivList[3] // HPエリアを指定
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[2]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > button")
    ;
    console.log("myPokemonHPButtonButtonList", myPokemonHPButtonButtonList);

    const myPokemonHPMinusButton = myPokemonHPButtonButtonList[0];
    const myPokemonHPPlusButton = myPokemonHPButtonButtonList[1];
    console.log("myPokemonHPMinusButton", myPokemonHPMinusButton);
    console.log("myPokemonHPPlusButton", myPokemonHPPlusButton);

    await myPokemonHpPlus(5);
    await myPokemonHpMinus(5);





    /* HP努力値ラベルエリア. */
    const myPokemonHPEffortLabel = myPokemonAreaDivList[3]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[1]
    .querySelectorAll(":scope > div")[1]
    .querySelector(":scope > div")
    .querySelector(":scope > h6")
    ;
    console.log("myPokemonHPEffortLabel", myPokemonHPEffortLabel);






    /* 防御エリア. */
    const myPokemonBButtonButtonList = myPokemonAreaDivList[5] // ぼうぎょエリアを指定
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[2]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > button")
    ;
    console.log("myPokemonHPButtonButtonList", myPokemonHPButtonButtonList);

    const myPokemonBMinusButton = myPokemonBButtonButtonList[0];
    const myPokemonBPlusButton = myPokemonBButtonButtonList[1];
    console.log("myPokemonBMinusButton", myPokemonBMinusButton);
    console.log("myPokemonBPlusButton", myPokemonBPlusButton);

    await myPokemonBPlus(5);
    await myPokemonBMinus(5);





    /* 防御努力値ラベルエリア. */
    const myPokemonBEffortLabel = myPokemonAreaDivList[5]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[1]
    .querySelectorAll(":scope > div")[1]
    .querySelector(":scope > div")
    .querySelector(":scope > h6")
    ;
    console.log("myPokemonBEffortLabel", myPokemonBEffortLabel);






    /* 防御性格補正エリア. */
    const myPokemonBPersonalityButton = myPokemonAreaDivList[5]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[3]
    .querySelectorAll(":scope > div")[0]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[1]
    .querySelectorAll(":scope > button")[2]
    ;
    console.log("myPokemonBPersonalityButton", myPokemonBPersonalityButton, myPokemonBPersonalityButton.getAttribute("aria-pressed"));






    /* 特防エリア. */
    const myPokemonDButtonList = myPokemonAreaDivList[7] // とくぼうエリアを指定
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[2]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > button")
    ;
    console.log("myPokemonDButtonList", myPokemonDButtonList);

    const myPokemonDMinusButton = myPokemonDButtonList[0];
    const myPokemonDPlusButton = myPokemonDButtonList[1];
    console.log("myPokemonDMinusButton", myPokemonDMinusButton);
    console.log("myPokemonDPlusButton", myPokemonDPlusButton);

    await myPokemonDPlus(5);
    await myPokemonDMinus(5);





    /* 特防努力値ラベルエリア. */
    const myPokemonDEffortLabel = myPokemonAreaDivList[7]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[1]
    .querySelectorAll(":scope > div")[1]
    .querySelector(":scope > div")
    .querySelector(":scope > h6")
    ;
    console.log("myPokemonDEffortLabel", myPokemonDEffortLabel);





    /* 特防性格補正エリア. */
    const myPokemonDPersonalityButton = myPokemonAreaDivList[7]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[3]
    .querySelectorAll(":scope > div")[0]
    .querySelector(":scope > div")
    .querySelectorAll(":scope > div")[1]
    .querySelectorAll(":scope > button")[2]
    ;
    console.log("myPokemonDPersonalityButton", myPokemonDPersonalityButton, myPokemonDPersonalityButton.getAttribute("aria-pressed"));








    const myPokemonAddButtonElement = buttonAddFunction("追加");






    myPokemonAddButtonElement.addEventListener("click", async () => {
        const name = myPokemonNameElement.value;
        const hEffort = myPokemonHPEffortLabel.textContent;
        const bEffort = myPokemonBEffortLabel.textContent;
        const bPersonality = myPokemonBPersonalityButton.getAttribute("aria-pressed");
        const dEffort = myPokemonDEffortLabel.textContent;
        const dPersonality = myPokemonDPersonalityButton.getAttribute("aria-pressed");
        console.log(name, hEffort, bEffort, bPersonality, dEffort, dPersonality);
        const value = [name, hEffort, bEffort, bPersonality, dEffort, dPersonality].join(" ");
        //        await save({
        //            id: value,
        //            value: value
        //        });
    });





    const histList = await getAll();
    for (const hist of histList) {
        buttonAddFunction(hist.value);
    }
    let selectedHist = null;
    if (histList.length > 0) {
        selectedHist = histList[0].value;
        selectAction();
    }

    async function selectAction() {
        const l = selectedHist.split(" ");
        await myPokemonSelect(l[0]);
        const f = n => {
            if (n === 0) return 0;
            else if (n === 4) return 1;
            else {
                return (n - 4) / 8 + 1;
            }
        };
        const promiseList = [];
        promiseList.push(myPokemonHpPlus(f(Number(l[1]))));
        promiseList.push(myPokemonBPlus(f(Number(l[2]))));
        if (l[3] === "true") myPokemonBPersonalityButton.click();
        promiseList.push(myPokemonDPlus(f(Number(l[4]))));
        if (l[5] === "true") myPokemonDPersonalityButton.click();

        await Promise.all(promiseList);
    }


    function openDb() {
        return new Promise(function(resolve) {
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = function(event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, {
                        keyPath: "id"
                    });
                }
            };
            req.onsuccess = () => resolve(req.result);
        });
    }
    async function save(data) {
        const db = await openDb();
        return new Promise(function(resolve) {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(data);
            req.onsuccess = () => resolve();
        });
    }
    async function get(id) {
        const db = await openDb();
        return new Promise(function(resolve) {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result?.value);
        });
    }
    async function getAll() {
        const db = await openDb();
        return new Promise(function(resolve) {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
        });
    }
    function buttonAddFunction(name) {
        const e = document.createElement("div");
        e.textContent = name;
        e.className = "MuiButtonBase-root MuiChip-root MuiChip-filled MuiChip-sizeMedium MuiChip-colorDefault MuiChip-deletable MuiChip-deletableColorDefault MuiChip-filledDefault mui-style-1h01snd";
        myPokemonArea.prepend(e);
        return e;
    }
    async function myPokemonSelect(name) {
        if (!name) return;
        await new Promise(r => setTimeout(r, 250));
        myPokemonNameElement.parentNode.click();
        await new Promise(r => setTimeout(r, 250));
        const pokemonPList = document.getElementById(":R3aj86l9ledael6:-listbox").querySelectorAll("p");
        for (const p of pokemonPList) {
            if (p.textContent === name) {
                p.click();
                return;
            }
        }
    }
    async function buttonClick(e, count) {
        for (let i = 0; i < count; i++) {
            await new Promise(r => setTimeout(r, 50));
            e.click();
        }
    }
    async function myPokemonHpMinus(count) {
        await buttonClick(myPokemonHPMinusButton, count);
    }
    async function myPokemonHpPlus(count) {
        await buttonClick(myPokemonHPPlusButton, count);
    }
    async function myPokemonBMinus(count) {
        await buttonClick(myPokemonBMinusButton, count);
    }
    async function myPokemonBPlus(count) {
        await buttonClick(myPokemonBPlusButton, count);
    }
    async function myPokemonDMinus(count) {
        await buttonClick(myPokemonDMinusButton, count);
    }
    async function myPokemonDPlus(count) {
        await buttonClick(myPokemonDPlusButton, count);
    }

})();
