/** 設定項目. **/

/* 文字の色(black, white, gray 等) */
fontColor = "black";

/* 背景の画像. */
bkImg = "https://pbs.twimg.com/media/GpIfTHNakAAVdto?format=jpg";

img = {
  /* アイコンを変えたい人の名前: その画像のURL. */
  "ヌイカ2": "https://yt3.googleusercontent.com/ytc/AIdro_mWueVn-u1oljZJNe-uO2ePQl0aO_OWU0B0zyYbSOExsCY",
  "ぺこら": "https://yt3.googleusercontent.com/ytc/AIdro_mWueVn-u1oljZJNe-uO2ePQl0aO_OWU0B0zyYbSOExsCY",
}

/** 処理. **/
profname = document.querySelector(".profname");
userprof = document.querySelector(".userprof").querySelector("img");
userprof.style.width = "58px";
document.body.style.backgroundImage = `url(${bkImg})`;
document.body.style.backgroundSize = "100%";
updtFunc = () => {
  talks.querySelectorAll("dt").forEach(e => {
    s = e.style;
    n = e.textContent;
    res = img[e.textContent];
    if (res) {
      s.background = `transparent url('${res}') no-repeat center top`
      s.backgroundSize = "58px";
      if (profname.textContent === n) {
        userprof.src = res;
      }
    }
  });	
};
updtFunc();
new MutationObserver(e=>{
  updtFunc();
}).observe(talks,{childList:true});
mbs = document.querySelector(".message_box").style;
mbs.backgroundColor = "rgba(1,1,1,0)";
mbs.color = fontColor;
document.querySelector("#body").style.color = fontColor;

document.head.innerHTML += `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap" rel="stylesheet">`;
document.body.style.fontFamily = '"Hachi Maru Pop", cursive';
