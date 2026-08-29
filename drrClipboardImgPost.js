/**
 * デュラララチャットでクリップボードの画像を送信するツール.
 *
 * 名誉協力者補佐代行: 【チャーコードマスター】ルツ
 **/
/*javascript:(()=>{let file=null;document.querySelector('textarea').addEventListener('paste',async e=>{if(file!=null)return;for(const item of e.clipboardData.items){if(item.type.indexOf('image')===-1)continue;e.preventDefault();file=await compressImageTo1MB(item.getAsFile());console.log("file.size",file.size);const reader=new FileReader();reader.readAsDataURL(file);reader.onload=async e=>{const base64Data=e.target.result;const d=document.createElement("div");const d2=document.createElement("div");const img=document.createElement("img");const d3=document.createElement("div");const yes=document.createElement("div");const no=document.createElement("div");img.src=base64Data;document.body.append(d);d.innerHTML="送信してよろしいですか？";yes.innerHTML="送信する";no.innerHTML="キャンセル";d.append(d2);d2.append(img);d.append(d3);d3.append(yes);d3.append(no);yes.addEventListener("mouseenter",e=>{e.target.style.backgroundColor="pink"});yes.addEventListener("mouseleave",e=>{e.target.style.backgroundColor="white"});no.addEventListener("mouseenter",e=>{e.target.style.backgroundColor="pink"});no.addEventListener("mouseleave",e=>{e.target.style.backgroundColor="white"});yes.addEventListener("click",async()=>{const fd=new FormData();fd.append("img_path",file);fd.append("upimg","アップロード");const response=await fetch("/room/",{method:"POST",body:fd});d.remove();console.log("response",response);file=null});no.addEventListener("click",()=>{file=null;d.remove()});d.style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background-color:black;border-radius:10px;border:1px solid white;padding:5px;text-align:center;";d2.style="width:270px;height:270px;border-radius:10px;border:1px solid white;padding:5px;margin-bottom:5px;";img.style="object-fit:contain;width:100%;height:100%;";d3.style="display:flex;justify-content:space-between;";yes.style="background-color:white;color:black;width:100%;margin-right:2.5px;border-radius:10px;";no.style="background-color:white;color:black;width:100%;margin-left:2.5px;border-radius:10px;"}}});async function compressImageTo1MB(file){const MAX_SIZE=1024*1024*3;if(file.size<=MAX_SIZE)return file;const image=new Image();const imageData=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)});await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=imageData});let width=image.naturalWidth;let height=image.naturalHeight;let reSize=99;while(true){const canvas=document.createElement("canvas");const ctx=canvas.getContext("2d");canvas.width=width;canvas.height=height;ctx.drawImage(image,0,0,width,height);const blob=await new Promise(resolve=>{canvas.toBlob(resolve,"image/jpeg",reSize/100)});if(blob.size>MAX_SIZE){reSize--;continue}return new File([blob],file.name.replace(/\.[^.]+$/,".jpg"),{type:"image/jpeg",lastModified:Date.now()})}}})();*/
javascript: {
    (() => {
        let file = null;

        document.querySelector('textarea').addEventListener('paste', async e => {
            if (file != null) return;

            for (const item of e.clipboardData.items) {
                if (item.type.indexOf('image') === -1) continue;

                e.preventDefault();

                file = await compressImageTo1MB(item.getAsFile());
                console.log("file.size", file.size);

                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = async e => {
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

                    yes.addEventListener("mouseenter", e => {
                        e.target.style.backgroundColor = "pink";
                    });

                    yes.addEventListener("mouseleave", e => {
                        e.target.style.backgroundColor = "white";
                    });

                    no.addEventListener("mouseenter", e => {
                        e.target.style.backgroundColor = "pink";
                    });

                    no.addEventListener("mouseleave", e => {
                        e.target.style.backgroundColor = "white";
                    });

                    yes.addEventListener("click", async () => {
                        const fd = new FormData();

                        fd.append("img_path", file);
                        fd.append("upimg", "アップロード");

                        const response = await fetch("/room/", {
                            method: "POST",
                            body: fd
                        });

                        d.remove();

                        console.log("response", response)

                        file = null;
                    });

                    no.addEventListener("click", () => {
                        file = null;
                        d.remove();
                    });

                    d.style =
                        "position:fixed;" +
                        "left:50%;" +
                        "top:50%;" +
                        "transform:translate(-50%,-50%);" +
                        "background-color:black;" +
                        "border-radius:10px;" +
                        "border:1px solid white;" +
                        "padding:5px;" +
                        "text-align:center;";

                    d2.style =
                        "width:270px;" +
                        "height:270px;" +
                        "border-radius:10px;" +
                        "border:1px solid white;" +
                        "padding:5px;" +
                        "margin-bottom:5px;";

                    img.style =
                        "object-fit:contain;" +
                        "width:100%;" +
                        "height:100%;";

                    d3.style =
                        "display:flex;" +
                        "justify-content:space-between;";

                    yes.style =
                        "background-color:white;" +
                        "color:black;" +
                        "width:100%;" +
                        "margin-right:2.5px;" +
                        "border-radius:10px;";

                    no.style =
                        "background-color:white;" +
                        "color:black;" +
                        "width:100%;" +
                        "margin-left:2.5px;" +
                        "border-radius:10px;";
                };
            }
        });

        async function compressImageTo1MB(file) {
            const MAX_SIZE = 1024 * 1024 * 3;

            // 1MB以下なら何もしない
            if (file.size <= MAX_SIZE) {
                return file;
            }

            const image = new Image();

            const imageData = await new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;

                reader.readAsDataURL(file);
            });

            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
                image.src = imageData;
            });

            let width = image.naturalWidth;
            let height = image.naturalHeight;

            let reSize = 99;
            while (true) {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );

                const blob = await new Promise(resolve => {
                    canvas.toBlob(
                        resolve,
                        "image/jpeg",
                        reSize / 100
                    );
                });

                if (blob.size > MAX_SIZE) {
                    reSize--;
                    continue;
                }

                return new File(
                    [blob],
                    file.name.replace(/\.[^.]+$/, ".jpg"),
                    {
                        type: "image/jpeg",
                        lastModified: Date.now()
                    }
                );
            }
        }
    })();
}
