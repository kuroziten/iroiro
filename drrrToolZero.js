// ==UserScript==
// @name         デュラチャを0から作り直す
// @namespace    http://tampermonkey.net/
// @version      2025-08-31
// @description  try to take over the world!
// @author       You
// @match        https://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrrkari.com
// @grant        none
// ==/UserScript==

(async function() {
    /**************************************************/
    /**************************************************/
    /* jQyeryを無効化 */
    $ = null;

    /**************************************************/
    /**************************************************/
    /* CSSの更新 */
    const style = document.createElement("style");
    style.innerHTML = `
dl > dd > div {
    margin: -16px 0 0 !important;
}
dl > dd > div > div {
    position: relative;
    top: 39px;
    left: -3px;
    width: 22px;
    height: 16px;
}
dl > dd > div > div > div {
    height: 100%;
    background: url(https://drrrkari.com/css/tail.png) left 0px no-repeat;
}
dl > dd > div > .body {
    margin-left: 15px;
}
dl > dd > p {
    margin-left: 30px;
}
dl > dd > p > a > img {
    max-width: 200px !important;
    max-height: 200px !important;
    width: auto !important;
    height: auto !important;
}
`;
    document.body.append(style);
    /*
    <p style="margin-left:30px;">
    <a href="/upimg/798696781a3f40f760bbe12739bdea75.png" target="_blank">
    <img src="/upimg/798696781a3f40f760bbe12739bdea75.png" style="max-width: 200px; max-height: 200px; width: auto; height: auto;">

    </a></p>*/

    /**************************************************/
    /**************************************************/
    /* HTML要素を作成してから指定の要素にappendする関数 */
    const createElement = (tagName, parentElement) => {
        const e = document.createElement(tagName);
        parentElement.append(e)
        return e;
    };

    /**************************************************/
    /**************************************************/
    /* HTML要素を使いやすくするためのオブジェクト */
    const body = {
        talks: document.querySelector("#talks"),
        talkBaseChat: (() => {
            const dl = document.createElement("dl");
            dl.classList.add("talk")
            const dt = createElement("dt", dl);
            const dd = createElement("dd", dl);
            const div1 = createElement("div", dd);
            div1.classList.add("bubble");
            const div2 = createElement("div", div1);
            const div3 = createElement("div", div2);
            const p = createElement("p", div1);
            p.classList.add("body");
            return dl;
        })(),
        talkBaseImg: (() => {
            const dl = document.createElement("dl");
            dl.classList.add("talk")
            const dt = createElement("dt", dl);
            const dd = createElement("dd", dl);
            const p = createElement("p", dd);
            const a = createElement("a", p);
            const img = createElement("img", a);
            return dl;
        })(),
        talkBaseSys: (() => {
            const div = document.createElement("div");
            div.classList.add("talk");
            div.classList.add("system");
            return div;
        })(),
    };

    /**************************************************/
    /**************************************************/
    /* チャット送信処理 */
    (textarea => {
        console.log("textarea", textarea);
        let isComposing = false;
        textarea.addEventListener("compositionstart", () => isComposing = true);
        textarea.addEventListener("compositionend", () => isComposing = false);
        textarea.addEventListener("keydown", async e => {
            if (e.key != "Enter") return;
            e.preventDefault();
            if (isComposing || !textarea.value.trim()) return;
            const form = new FormData();
            form.append("message", textarea.value.trim());
            form.append("valid", "1");
            await fetch("?ajax=1", {
                "body": form,
                "method": "POST",
            });
            textarea.value = "";
            // await new Promise(r => setTimeout(r, 500));
            await ref();
        });
    })(document.querySelector("textarea"));

    /**************************************************/
    /**************************************************/
    /* チャットリセット */
    body.talks.innerHTML = "";

    const myUid = user_id.textContent;
    let ajax = null;

    document.getElementsByName("pmbtn")[0].addEventListener("click", e => {
        pm_box.style.display = "block";
        pmtalks.innerHTML = "";
        const pms = Object.values(ajax.pm);
        const tUid = document.querySelector(".select").getAttribute("uid");
        for (const pm of pms) {
            if (pm.uid !== tUid) continue;
            const talkChat = body.talkBaseChat.cloneNode(true);
            talkChat.id = pm.id;
            talkChat.classList.add(pm.icon);
            talkChat.querySelector("dt").textContent = pm.name;
            talkChat.querySelector(".body").textContent = pm.message;
            pmtalks.prepend(talkChat);
            const backgroundImage = getComputedStyle(talkChat.querySelector(".body")).backgroundImage;
            const style = talkChat.querySelector(".bubble").querySelector("div").style;
            style.backgroundImage = backgroundImage;
            if (Math.floor(Math.random() * 2)) {
                const bubble = talkChat.querySelector(".bubble");
                const div = bubble.querySelector("div").querySelector("div");
                const bp = "left -17px";
                div.style.backgroundPosition = bp;
            }
            const p = talkChat.querySelector(".body");
            const pt = parseInt(getComputedStyle(p).paddingTop);
            const pb = parseInt(getComputedStyle(p).paddingBottom);
            const h = p.clientHeight - pt - pb;
            const height = h + 30 + 8;
            const top = (Math.round((180 - height) / 2) + 23) * -1;
            style.backgroundPosition = "left " + top + "px";
        }
    });
    /**************************************************/
    /**************************************************/
    /* 画面をリフレッシュする関数 */
    let refFlg = false;
    const ref = async () => {
        if (refFlg) return;
        refFlg = true;
        ajax = await(await fetch("/ajax.php", {method:"post"})).json();
        const users = Object.values(ajax.users);
        const talks = Object.values(ajax.talks);
        for (const talk of talks) {
            if (body.talks.querySelector("[id='" + talk.id + "']")) continue;
            if (talk.image) {
                const talkImg = body.talkBaseImg.cloneNode(true);
                talkImg.id = talk.id;
                talkImg.classList.add(talk.icon);
                talkImg.querySelector("dt").textContent = talk.name;
                talkImg.querySelector("img").src = talk.image;
                body.talks.prepend(talkImg);
            } else if (talk.icon) {
                const talkChat = body.talkBaseChat.cloneNode(true);
                talkChat.id = talk.id;
                talkChat.classList.add(talk.icon);
                talkChat.querySelector("dt").textContent = talk.name;
                talkChat.querySelector(".body").textContent = talk.message;
                body.talks.prepend(talkChat);
                const backgroundImage = getComputedStyle(talkChat.querySelector(".body")).backgroundImage;
                const style = talkChat.querySelector(".bubble").querySelector("div").style;
                style.backgroundImage = backgroundImage;
                if (Math.floor(Math.random() * 2)) {
                    const bubble = talkChat.querySelector(".bubble");
                    const div = bubble.querySelector("div").querySelector("div");
                    const bp = "left -17px";
                    div.style.backgroundPosition = bp;
                }
                const p = talkChat.querySelector(".body");
                const pt = parseInt(getComputedStyle(p).paddingTop);
                const pb = parseInt(getComputedStyle(p).paddingBottom);
                const h = p.clientHeight - pt - pb;
                const height = h + 30 + 8;
                const top = (Math.round((180 - height) / 2) + 23) * -1;
                style.backgroundPosition = "left " + top + "px";
            } else {
                const talkSys = body.talkBaseSys.cloneNode(true);
                talkSys.id = talk.id;
                talkSys.textContent = talk.message;
                body.talks.prepend(talkSys);
            }
        }

        // list2に存在しないユーザーを追加
        for (const user of users) {
            if (!user_list2.querySelector('[uid="' + user.id + '"]') && user.id !== myUid) {
                const li = document.createElement("li");
                li.setAttribute("uid", user.id);
                li.style.cssText = "background: url(https://drrrkari.com/css/icon_" + user.icon + ".png) center top no-repeat transparent;"
                li.textContent = user.name;
                li.addEventListener("click", e => {
                    for (const userE of user_list2.querySelectorAll('[uid]')) {
                        userE.classList.remove("select");
                    }
                    e.target.classList.add("select");
                });
                user_list2.append(li);
                document.getElementsByName("pmbtn")[0].disabled = false;
                document.getElementsByName("igbtn")[0].disabled = false;
            }
        }
        // usersに存在しないユーザーを削除
        for (const userE of user_list2.querySelectorAll('[uid]')) {
            if (!users.some(user => user.id === userE.getAttribute("uid"))) {
                if (userE.classList.contains("select")) {
                    document.getElementsByName("pmbtn")[0].disabled = true;
                    document.getElementsByName("igbtn")[0].disabled = true;
                }
                userE.remove();
            }
        }
        refFlg = false;
    };

    /**************************************************/
    /**************************************************/
    /* ？ボタンを作る */
    document.querySelector(".private.fa.fa-question-circle").style.display = "list-item";

    /**************************************************/
    /**************************************************/
    /* 5秒ごとに画面をリフレッシュ */
    while (true) {
        await ref();
        await new Promise(r => setTimeout(r, 5000));
    }
})();
