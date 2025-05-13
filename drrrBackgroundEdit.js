/** 設定項目. **/

/* 背景の画像（横位置, 縦位置, 文字色, 背景画像URL） */
const bkImgList = [
    [0, -600, 'white', 'https://pbs.twimg.com/media/GqLDl4pbwAAL55o?format=jpg'],
    [0, -500, 'white', 'https://pbs.twimg.com/media/GqJ6WqqbwAA_Yil?format=jpg'],
    [0, -500, 'white', 'https://pbs.twimg.com/media/Gkim34HbMAAcJm3?format=jpg'],
    [0, 0, 'white', 'https://wallpaper.forfun.com/fetch/2b/2b4bbf1f858d298a58d4823b9c67a5b6.jpeg'],
    [0, -500, 'black', 'https://pbs.twimg.com/media/GpIfTHNakAAVdto?format=jpg'],
];
/* 背景の画像を切り替える秒数(ミリ秒). */
const bkImgChangeInterval = 3000;

/* 文字の色(black, white, gray 等) */
const fontColor = "white";

/* 背景の画像. */
const bkImg = 'https://wallpaper.forfun.com/fetch/2b/2b4bbf1f858d298a58d4823b9c67a5b6.jpeg';

const img = {
    /* アイコンを変えたい人の名前: その画像のURL. */
    "ヌイカ2": "https://yt3.googleusercontent.com/ytc/AIdro_mWueVn-u1oljZJNe-uO2ePQl0aO_OWU0B0zyYbSOExsCY",
    "ぺこら": "https://yt3.googleusercontent.com/ytc/AIdro_mWueVn-u1oljZJNe-uO2ePQl0aO_OWU0B0zyYbSOExsCY",
    'なぶし': 'https://pbs.twimg.com/media/GSNNMFGaQAAW5Eg.jpg:small',
    'るしあ⋈∗*ﾟ': 'https://pbs.twimg.com/media/EMw6tw2U4AEjH7X.jpg',
    '中卒えぴ': 'https://drrrkari.com/upimg/5bb7167bac35f95d0d54d45a7140c289.jpeg',
    '不知火': 'https://i.pinimg.com/originals/10/c3/4c/10c34c526bdfcfbb4e0bf3c1c19018d2.jpg',
    'メガスキ(野ウサギ)': 'https://pbs.twimg.com/profile_images/1464762117421432837/WncPEHU-_400x400.jpg',
    '納豆ご飯丸SS': 'https://illustimage.com/photo/25022.png',
    'ぶどう2': 'https://m.media-amazon.com/images/I/51w0nrSX0xL._AC_UF894,1000_QL80_.jpg',
    'まつくん': 'https://img.freepik.com/premium-vector/weed-leaf-marijuana-logo-illustrations_228886-301.jpg',
    '苦夫': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMdM9MEQ0ExL1PmInT3U5I8v63YXBEdoIT0Q&s',
    'cent': 'https://pbs.twimg.com/profile_images/1864619536928133124/WZfGB8ph_400x400.png',
    'ｱﾓｱｽLove♓': 'https://pbs.twimg.com/media/FJadPjfUUAEg609?format=jpg',
}

/** 処理. **/
const profname = document.querySelector(".profname");
const userprof = document.querySelector(".userprof").querySelector("img");

const f = () => {
  talks.querySelectorAll("dt").forEach(e => {
    const name = e.textContent;
    const res = img[e.textContent];
    if (res) {
      e.style.background = `transparent url('${res}') no-repeat center top`
      if (profname.textContent === name) {
        userprof.src = res;
      }
    }
  });
};

f();
new MutationObserver(e=>f()).observe(talks,{childList:true});

document.querySelectorAll(".submit,.reload,.member_off").forEach(e => e.remove());

document.head.innerHTML += `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap" rel="stylesheet">`;

const style = document.createElement("style");
style.innerHTML = `
body *:not(.fa) {
font-family:"Hachi Maru Pop", cursive !important;
color:white;
text-shadow:
  1px 1px 0 #000,
  -1px 1px 0 #000,
  -1px -1px 0 #000,
  1px -1px 0 #000,
  2px 0 0 #000,
  -2px 0 0 #000,
  0 2px 0 #000,
  0 -2px 0 #000,
  2px 2px 0 #000,
  -2px 2px 0 #000,
  -2px -2px 0 #000,
  2px -2px 0 #000;
}
body {
z-index: 1;
background-size:cover;
background-repeat:no-repeat;
background-attachment:fixed;
display: block;
position: relative;
transition: color 1s;
}

body::before {
content: '';
width: 100vw;
height: 100vh;
background-size:cover;
background-repeat:no-repeat;
background-attachment:fixed;
display: block;
position: fixed;
transition: opacity 1s;
top: 0;

background-image:url(${bkImgList[0][3]});
background-position: calc(50% + ${bkImgList[0][0]}px) calc(50% - ${bkImgList[0][1]}px);
}

.message_box{
background-color:rgba(1,1,1,0) !important;
}
textarea{
resize:none;
background-color: rgba(1,1,1,.5);
}
[name="logout"]{
color:white !important;
text-shadow:
  1px 1px 0 #000,
  -1px 1px 0 #000,
  -1px -1px 0 #000,
  1px -1px 0 #000,
  2px 0 0 #000,
  -2px 0 0 #000,
  0 2px 0 #000,
  0 -2px 0 #000,
  2px 2px 0 #000,
  -2px 2px 0 #000,
  -2px -2px 0 #000,
  2px -2px 0 #000;
background-color: rgba(1,1,1,.5);
border-radius: 5px;
border: 1px solid white;
}
.userprof img {
width:58px;
}
dt{
background-size:58px !important;
}
textarea:focus {
outline: none;
}
[pekora] {
position: fixed;
bottom: 0;
left: 0;
width: 100vw;
height: 100vh;
object-fit: contain;
animation: infinite 5s forwards pekora;
z-index: 99999;
pointer-events: none;
}
@keyframes pekora {
0% {
bottom: -100vh;
left: 100vw;
}
25% {
bottom: -100vh;
left: 100vw;
}
35% {bottom: 0;left: 0;}
40% {bottom: 0;left: 0;}
42% {bottom: 1vh;left: 0;}
44% {bottom: 0;left: 0;}
46% {bottom: 1vh;left: 0;}
48% {bottom: 0;left: 0;}
50% {bottom: 1vh;left: 0;}
52% {bottom: 0;left: 0;}
65% {bottom: 0;left: 0;}
80% {
bottom: -100vh;
left: -100vw;
}
100% {
bottom: -100vh;
left: -100vw;
}
}
[robokosan] {
position: fixed;
width: 100vw;
height: 100vh;
object-fit: contain;
animation: infinite 30s forwards robokosan;
z-index: 99999;
pointer-events: none;
}
@keyframes robokosan {
0% {
bottom: 0vh;
left: 200vw;
}
${(()=>{
    let css = "";
    let upFlg = true;
    for (let i = 10; i <= 90; i++) {
        if (upFlg) {
            css += `${i}% {bottom: 1vh;}`;
        } else {
            css += `${i}% {bottom: -1vh;}`;
        }
        upFlg = !upFlg;
    }
    return css;
})()}
100% {
bottom: 0vh;
left: -100vw;
}
}
[mococo] {
position: fixed;
width: 250%;
height: 250%;
object-fit: contain;
animation: infinite 5s forwards mococo;
z-index: 99999;
pointer-events: none;
rotate: 20deg;
}
@keyframes mococo {
0% {
bottom: -250%;
left: -120%;
}
20% {
bottom: -250%;
}
25% {
bottom: -140%;
}
65% {
bottom: -140%;
}
70% {
bottom: -250%;
}
100% {
bottom: -250%;
left: -120%;
}
}
[fuwawa] {
position: fixed;
width: 250%;
height: 250%;
object-fit: contain;
animation: infinite 5s forwards fuwawa;
z-index: 99999;
pointer-events: none;
rotate: -45deg;
}
@keyframes fuwawa {
0% {
bottom: -250%;
right: -130%;
}
20% {
bottom: -250%;
}
25% {
bottom: -140%;
}
65% {
bottom: -140%;
}
70% {
bottom: -250%;
}
100% {
bottom: -250%;
right: -130%;
}
}
.body {
overflow: hidden;
position: relative;
z-index: 1;
}
.body::after {
content: '';
display: block;
position: absolute;
width: 100%;
height: 100%;
z-index: -1;
background: url(https://hololive.hololivepro.com/wp-content/uploads/2020/06/Nakiri-Ayame_pr-img_01.png);
top: 0;
left: 0px;
background-position: center 16%;
background-size: inherit;
background-repeat: no-repeat;
}

}
`;
// background: url(https://hololive.hololivepro.com/wp-content/uploads/2020/06/Nakiri-Ayame_pr-img_01.png);
// background-repeat: no-repeat;

document.body.append(style);
let flg = true;
let c = 0;
(async () => {
    while (true) {
        await new Promise(r => setTimeout(r, bkImgChangeInterval));
        if (document.querySelectorAll("[anim]").length > 2) {
            document.querySelectorAll("[anim]")[0].remove();
        }
        c++;
        if (c === bkImgList.length) {
            c = 0;
        }
        const style = document.createElement("style");
        style.setAttribute("anim", "");
        if (flg) {
            // bodyを次の画像にしてbeforeをそのまま透過
            style.innerHTML = `
body {
background-image:url(${bkImgList[c][3]});
background-position: calc(50% + ${bkImgList[c][0]}px) calc(50% - ${bkImgList[c][1]}px);
}
body::before {
opacity:0;
}
body *:not(.fa) {
transition: color 1s;
}
    `;
        } else {
            // beforeを次の画像にして透過解除
            style.innerHTML = `
body::before {
opacity:1;
background-image:url(${bkImgList[c][3]});
background-position: calc(50% + ${bkImgList[c][0]}px) calc(50% - ${bkImgList[c][1]}px);
}
`;
        }
        flg = !flg;
        document.body.append(style);
    }
})();
/*
(() => {
    const pekora = document.createElement("img");
    pekora.src = "https://img2.animatetimes.com/2023/02/14139b5bdfbe588b6053d310c942060e640172bb40f858_60486246_db410305b4c590e1b8fa760351f2d8275169188a.png";
    pekora.setAttribute("pekora", "");
    document.body.append(pekora);
})();
*/
(() => {
    const robokosan = document.createElement("img");
    robokosan.src = "https://hololive.hololivepro.com/wp-content/uploads/2020/06/Robocosan_pr-img_07.png";
    robokosan.setAttribute("robokosan", "");
    document.body.append(robokosan);
})();
/*
(() => {
    const mococo = document.createElement("img");
    mococo.src = "https://hololive.hololivepro.com/wp-content/uploads/2021/07/Mococo-Abyssgard_pr-img_01.png";
    mococo.setAttribute("mococo", "");
    document.body.append(mococo);
})();
(() => {
    const fuwawa = document.createElement("img");
    fuwawa.src = "https://hololive.hololivepro.com/wp-content/uploads/2024/08/Fuwawa-Abyssgard_pr-img_01.png";
    fuwawa.setAttribute("fuwawa", "");
    document.body.append(fuwawa);
})();
*/
