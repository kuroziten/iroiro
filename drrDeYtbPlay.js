const videoId = '2-i1gzWeeOI';
{
    const div = document.createElement("div");
    console.log(div);
    document.body.append(div);
    div.style.width = "100vw";
    const messageBox = document.querySelector(".message_box");
    const mbh = messageBox.clientHeight;
    div.style.height = `calc(100vh - ${mbh}px)`;
    div.style.backgroundColor = "red";
    div.style.position = "fixed";
    div.style.top = `${mbh}px`;
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
    player = new YT.Player('player', {
      videoId: videoId,
      events: {
        'onReady': onPlayerReady,
        'onPlayerStateChange': onPlayerStateChange
      }
    });
    }
    
    function onPlayerReady(event) {
    event.target.playVideo();
    }
    
    function onPlayerStateChange(event) {
        console.log(event.data);
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
};
