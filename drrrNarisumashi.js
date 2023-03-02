const talks = document.querySelectorAll(".talk");
for (talk of talks) {
    if (!talk.classList.contains("system") && !talk.classList.contains("click")) {
        talk.addEventListener("click", function(){
            const name = window.prompt("変更後名", this.querySelector("dt").textContent);
            const icon = window.prompt("変更後アイコン", this.classList[1]);
            if (!!name && !!icon) {
                this.querySelector("dt").textContent = name;
                this.classList.replace(this.classList[1], icon);
                this.querySelector(".bubble").querySelector("div").style.backgroundImage = 
                    document.defaultView.getComputedStyle(this.querySelector(".body"), null).backgroundImage;
            }
            setTimeout(()=>{
                const n = name.length + 2;
                const text = document.querySelector("textarea").value;
                document.querySelector("textarea").value = text.slice(0, -n);
            },500);
        })
    }
}
