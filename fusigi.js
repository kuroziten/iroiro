/*
内緒機能が使えなくなる。画面をリロードしたら処理が内緒機能が使えるようになる
*/
(() => {
    const aaa = () => {
        const formData = new FormData();
        formData.append("message", "a");
        formData.append("valid", 1);
        fetch("https://drrrkari.com/room/?ajax=1&id=5d0a23e3de92e99e4920a68248429aa5", {
            method: "POST",
            body: formData
        });
    };
    aaa();
    setInterval(()=>aaa(), 1000*60*15);
    setInterval(()=>$("#pm_box").hide(), 1000);
    document.querySelector(".private").addEventListener("click", () => {
        $(".submit input[name=post]").slideToggle();
        $("#message textarea").slideToggle();
        $(".userprof").slideToggle();
        $("#setting_pannel2").slideToggle();
    });
})();
