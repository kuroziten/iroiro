// ==UserScript==
// @name         自動投稿
// @namespace    http://tampermonkey.net/
// @version      2025-08-13
// @description  try to take over the world!
// @author       You
// @match        https://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrrkari.com
// @grant        none
// ==/UserScript==

(() => {
    const 発言 = ["発言１", "発言２", "発言３"];
    let nextMinutes;
    const nowMinutes = new Date().getMinutes();
    if (nowMinutes >= 0 && nowMinutes < 20) {
        nextMinutes = 20;
    } else if (nowMinutes >= 20 && nowMinutes < 40) {
        nextMinutes = 40;
    } else {
        nextMinutes = 0;
    }
    const myName = document.querySelector(".profname").textContent;
    setInterval(async () => {
        const nowMinutes = new Date().getMinutes();
        if (nextMinutes === nowMinutes) {
            const res = await(await fetch("/ajax.php",{method:"post"})).json();
            const user = Object.values(res.users).filter(e=>e.name==myName)[0];
            const update = user.update;
            const dt = new Date(new Date("1970/01/01 00:00:00").getTime() + update * 1000 + 1000 * 60 * 60 * 9);
            const diffMinutes = (new Date().getTime() - dt.getTime()) / 1000 / 60;
            // 条件①自分自身のUpdateが指定時間以内になる
            const talks = Object.values(res.talks);
            if (!talks.some(t => t.uid === user.id && t.time === Math.floor(user.update)) || diffMinutes >= 10) {
                document.querySelector("textarea[name='message']").value = 発言[Math.floor(Math.random() * 発言.length)];
                document.querySelector("input[name='post']").click();
            }
            if (nowMinutes >= 0 && nowMinutes < 20) {
                nextMinutes = 20;
            } else if (nowMinutes >= 20 && nowMinutes < 40) {
                nextMinutes = 40;
            } else {
                nextMinutes = 0;
            }
        }
    }, 5000);
})();
