new MutationObserver(e => {
    if (Array.from(talks.querySelectorAll(".system")).some(e => e.textContent === "ーー 名無しさんが入室しました")) {
        document.querySelector(".logout").querySelector("input").click();
    }
}).observe(talks, { childList: true });
