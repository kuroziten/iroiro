setInterval(function () {
    for (img of document.querySelectorAll("img")) {
        if (img.src.substr(0, 28) == "https://pbs.twimg.com/media/"
            && img.getAttribute("test") == undefined) {
            img.setAttribute("test", "test")
            img.addEventListener("click", function () {
                const input = document.createElement("input");
                input.value = this.src.substr(0,this.src.indexOf("&"));
                document.body.append(input);
                input.select();
                document.execCommand('copy');
                input.remove();
            });
        }
    }
}, 100)
