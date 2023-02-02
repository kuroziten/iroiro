const videoId = 'taixhqpjvK4';
{
    const div = document.createElement("div");
    console.log(div);
    document.body.append(div);
    div.style.width = "100vw";
    const messageBox = document.querySelector(".message_box");
    messageBox.style.backgroundColor = "rgba(0,0,0,0)";
    messageBox.style.color = "white";
    const mbh = messageBox.clientHeight;
    div.style.height = `100vh`;
    div.style.backgroundColor = "red";
    div.style.position = "fixed";
    div.style.top = `0`;
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    div.style.zIndex = "-1";
    div.style.zIndex = "-1";

    const innterDiv = document.createElement("div");
    div.append(innterDiv);
    innterDiv.id = "player";
    innterDiv.style.minHeight = "100%";
    innterDiv.style.minWidth = "100%";
    
    var tag = document.createElement('script');
    
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player(
            'player'
            ,{
                videoId: videoId
            },{
                'playsinline': 1
            }
            
        );
    }

    let notPlayFlg = true;
    setInterval(()=>{
        if (player.getPlayerState() != 1 && !notPlayFlg) {
            notPlayFlg = true;
        };
    },500);
    document.body.addEventListener("click", function(){
        if (notPlayFlg) {
            notPlayFlg = false;
            player.playVideo();
        }
    });

    const style = document.createElement("style");
    document.body.append(style);
    style.type = `text/css`;
    style.innerText = `
        body::-webkit-scrollbar{
            display: none;
        }        
    `;

    const menu = document.querySelector(".menu");
    
    const newUpimg = document.createElement("li");
    menu.prepend(newUpimg);
    newUpimg.innerText = "画像送信";
    newUpimg.style.textDecoration = "underline";
    newUpimg.style.color = "pink";
    const input_file = document.querySelector('#img_path');
    newUpimg.addEventListener(
        "click",
        function () {
            input_file.click();
        }
    );
    input_file.addEventListener(
        "change",
        function () {
            const fd = new FormData();
        	fd.append('img_path', this.files[0]);
            fd.append('upimg', 'アップロード');
        	fetch( '/room/', {
            	method: 'POST',
            	body: fd
        	})
            
        }
    );

    const upimg = document.getElementsByClassName("upimg")[0];
    upimg.style.display = "none";
    
    const ytbZButton = document.createElement("li");
    menu.prepend(ytbZButton);
    ytbZButton.style.border = "1px solid blue";
    ytbZButton.style.borderRadius = "100%";
    ytbZButton.innerText = "　";
    ytbZButton.addEventListener(
        "click",
        function () {
            if (div.style.zIndex == "-1") {
                div.style.zIndex = "0";
            } else {
                div.style.zIndex = "-1";
            }
        }
    );    
};
