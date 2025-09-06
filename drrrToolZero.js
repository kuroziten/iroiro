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

/** デュラチャのベース処理 */
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

#talks > dl > dd > div {
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
}
#talks dl > dd > div > div > div {
    background: url(https://drrrkari.com/css/tail.png) left 0px no-repeat;
}

#pmtalks dl > dd > div > div {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 16px 22px;
    border-color: transparent transparent rgb(91, 160, 255) transparent;
    position: relative;
    float: left;
    top: 21px;
    left: -3px;
}

#pmtalks dl > dd > div > div > div {
    border-style: solid;
    border-width: 0px 0px 7px 10px;
    border-color: transparent transparent #fff transparent;
    margin-left: -9px;
    padding-top: 5px;
}

#pmtalks dl > dd > div > p {
    margin: -18px 0px 0px 15px;
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
    //transparent transparent #fff transparent
    document.body.append(style);

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
    let refFlg = false;
    (textarea => {
        console.log("textarea", textarea);
        let isComposing = false;
        textarea.addEventListener("compositionstart", () => isComposing = true);
        textarea.addEventListener("compositionend", () => isComposing = false);
        textarea.addEventListener("keydown", async e => {
            if (e.key != "Enter") return;
            e.preventDefault();
            if (isComposing || !textarea.value.trim()) return;
            if (refFlg) return;
            refFlg = true;
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
            refFlg = false;
        });
    })(document.querySelector("textarea"));

    /**************************************************/
    /**************************************************/
    /* チャットリセット */
    body.talks.innerHTML = "";

    /**************************************************/
    /**************************************************/
    /* 自分のUIDを取得 */
    const myUid = user_id.textContent;

    /**************************************************/
    /**************************************************/
    /* ajax.phpを保持する変数 */
    let ajax = null;

    /**************************************************/
    /**************************************************/
    /* 内緒ボタンを押した時のやつ */
    const pmbtnClickAction = tUid => {
        console.log("pmbtnClickAction");
        pm_box.style.display = "block";
        pmtalks.innerHTML = "";
        const pms = Object.values(ajax.pm);
        for (const pm of pms) {
            if (pm.uid !== tUid && pm.uid !== myUid) continue;
            const talkChat = body.talkBaseChat.cloneNode(true);
            talkChat.id = pm.id;
            talkChat.classList.add(pm.icon);
            talkChat.querySelector("dt").textContent = pm.name;
            talkChat.querySelector(".body").textContent = pm.message;
            pmtalks.prepend(talkChat);
            const backgroundImage = getComputedStyle(talkChat.querySelector(".body")).backgroundImage;
            const style = talkChat.querySelector(".bubble").querySelector("div").style;
            style.backgroundImage = backgroundImage;
            const p = talkChat.querySelector(".body");
            const pt = parseInt(getComputedStyle(p).paddingTop);
            const pb = parseInt(getComputedStyle(p).paddingBottom);
            const h = p.clientHeight - pt - pb;
            const height = h + 30 + 8;
            const top = (Math.round((180 - height) / 2) + 23) * -1;
            style.backgroundPosition = "left " + top + "px";
            const borderColor = getComputedStyle(p).borderColor;
            talkChat.querySelector(".bubble").querySelector("div").style.borderColor = "transparent transparent " + borderColor + " transparent";
        }
    };
    document.getElementsByName("pmbtn")[0].addEventListener("click", e => {
        pmbtnClickAction(document.querySelector(".select").getAttribute("uid"));
    });

    /**************************************************/
    /**************************************************/
    /* 画面をリフレッシュする関数 */
    const dtEAddEventListener = dtE =>
        dtE.addEventListener("click", e => {
            const name = "@" + e.target.textContent;
            const messageE = document.querySelector('.inputarea [name="message"]');
            if (messageE.value === "") {
                messageE.value = name + " ";
            } else if (/.+\s$/.test(messageE.value)) {
                messageE.value += name;
            } else {
                messageE.value += " " + name;
            }
            messageE.focus();
        });
    let previousPm = null;
    const ref = async () => {
        ajax = await(await fetch("/ajax.php", {method:"post"})).json();
        customAction(ajax);
        const users = Object.values(ajax.users);
        const talks = Object.values(ajax.talks);
        const pms = Object.values(ajax.pm);
        if (previousPm === null) {
            if (pms.length === 0) {
                previousPm = "";
            } else {
                previousPm = pms.slice(-1)[0];
            }
        }
        let pm = null;
        if (pms.length > 0) {
            pm = pms.slice(-1)[0];
        }
        console.log(pms);
        if (pm_box.style.display === "" && previousPm.id != pm.id) {
            pmbtnClickAction(pm.uid);
        }

        for (const talk of talks) {
            if (body.talks.querySelector("[id='" + talk.id + "']")) continue;
            if (talk.image) {
                // 画像の作成処理
                const talkImg = body.talkBaseImg.cloneNode(true);
                talkImg.id = talk.id;
                talkImg.classList.add(talk.icon);
                talkImg.querySelector("dt").textContent = talk.name;
                dtEAddEventListener(talkImg.querySelector("dt"));
                talkImg.querySelector("a").href = talk.image;
                talkImg.querySelector("a").target = "_blank";
                talkImg.querySelector("img").src = talk.image;
                body.talks.prepend(talkImg);
            } else if (talk.icon) {
                // チャットの作成処理
                const talkChat = body.talkBaseChat.cloneNode(true);
                talkChat.id = talk.id;
                talkChat.classList.add(talk.icon);
                talkChat.querySelector("dt").textContent = talk.name;
                dtEAddEventListener(talkChat.querySelector("dt"));
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
                // システムチャットの作成処理
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
    };

    /**************************************************/
    /**************************************************/
    /* ？ボタンを作る */
    document.querySelector(".private.fa.fa-question-circle").style.display = "list-item";

    /**************************************************/
    /**************************************************/
    /* 5秒ごとに画面をリフレッシュ */
    while (true) {
        if (refFlg) return;
        refFlg = true;
        await ref();
        refFlg = false;
        await new Promise(r => setTimeout(r, 5000));
    }
})();
