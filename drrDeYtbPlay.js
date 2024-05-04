let file = null;
document.querySelector('textarea').addEventListener('paste', e => {
    if (file != null) return;
    for (item of (e.clipboardData || e.originalEvent.clipboardData).items) {
        if (item.type.indexOf('image') !== -1) {
            event.preventDefault();
            file = item.getAsFile();
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                const base64Data = e.target.result;
                const d = document.createElement("div");
                const d2 = document.createElement("div");
                const img = document.createElement("img");
                const d3 = document.createElement("div");
                const yes = document.createElement("div");
                const no = document.createElement("div");
                img.src = base64Data;
                document.body.append(d);

                d.innerHTML = "送信してよろしいですか？";
                yes.innerHTML = "送信する";
                no.innerHTML = "キャンセル";

                d.append(d2);
                d2.append(img);
                d.append(d3);
                d3.append(yes);
                d3.append(no);

                yes.addEventListener("mouseover", e => {
                    const s = e.target.style;
                    s.backgroundColor = "pink";
                });
                yes.addEventListener("mouseout", e => {
                    const s = e.target.style;
                    s.backgroundColor = "white";
                });
                no.addEventListener("mouseover", e => {
                    const s = e.target.style;
                    s.backgroundColor = "pink";
                });
                no.addEventListener("mouseout", e => {
                    const s = e.target.style;
                    s.backgroundColor = "white";
                });
                yes.addEventListener("click", async e => {
                    const fd = new FormData();
                    fd.append('img_path', file);
                    fd.append('upimg', 'アップロード');
                    const res = await fetch('/room/', {
                        method: 'POST',
                        body: fd
                    });
                    const text = await res.text();
                    const html = document.createElement("div");
                    html.innerHTML = text;
                    if (!html.querySelector("textarea")) {
                        if (html.querySelector(".header")?.querySelector("p")) {
                            alert("画像は10秒以上時間をあけてから投稿してください。");
                            return;
                        }
                        alert("413 Request Entity Too Large");
                    }
                    file = null;
                    d.remove();
                });
                no.addEventListener("click", e => {
                    file = null;
                    d.remove();
                });

                d.style = `
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translateX(-50%)
                translateY(-50%);
                background-color: black;
                border-radius: 10px;
                border: 1px solid white;
                padding: 5px;
                text-align: center;`;
                d2.style = `
                width: 270px;
                height: 270px;
                border-radius: 10px;
                border: 1px solid white;
                padding: 5px;
                margin-bottom: 5px;`;
                img.style = `
                object-fit: contain;
                width: 100%;
                height: 100%;`;
                d3.style = `
                display: flex;
                justify-content: space-between;`;
                yes.style = `
                background-color: white;
                color: black;
                width: 100%;
                margin-right: 2.5px;
                border-radius: 10px;
                `;
                no.style = `
                background-color: white;
                color: black;
                width: 100%;
                margin-left: 2.5px;
                border-radius: 10px;
                `;
            };
        }
    }
});
