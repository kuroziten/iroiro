/** 設定項目. **/

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

document.querySelector(".submit").remove();

document.head.innerHTML += `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap" rel="stylesheet">`;

const style = document.createElement("style");
style.innerHTML = `
body *:not(.fa) {
font-family:"Hachi Maru Pop", cursive !important;
color:${fontColor};
}
body {
background-image:url(${bkImg});
background-size:cover;
background-position:center;
background-repeat:no-repeat;
background-attachment:fixed;
}
.message_box{
background-color:rgba(1,1,1,0) !important;
}
textarea{
resize:none;
background-color: rgba(1,1,1,.5);
}
[name="logout"]{
color:black !important;
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
`;
document.body.append(style);
