const videoId = 'I7J2MTwPXh8';
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
    
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    var player;
    function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      videoId: videoId
    });
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
    
};
