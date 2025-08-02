
// フォント
document.head.innerHTML += `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
`;


// スタイル
style = document.createElement("style");
document.body.append(style);
style.textContent = `
.newViewAAA {
position: fixed;
width: 100%;
height: 100%;
background-color: white;
display: block;
top: 0;
left: 0;
z-index: 100000;
}
.newViewAAA {
color: black;
font-family: "DotGothic16", sans-serif;
font-weight: 400;
font-style: normal;
}
`;
// 新画面
newView = document.createElement("div");
document.body.append(newView);
newView.classList.add("newViewAAA")

textarea = document.querySelector("textarea");
newView.prepend(textarea);

newViewAAAUpdate = () => {
  const dlList = talks.querySelectorAll("dl");
  for (let i = dlList.length - 1; i >= 0; i--) {
    const dl = dlList[i];
    if (dl.getAttribute("flg") === null) {
      dl.setAttribute("flg", "");
      addNewViewAAAContent(dl);
    }
  }
};
newViewAAAUpdate();
new MutationObserver(e=>{
  newViewAAAUpdate();
}).observe(talks,{childList:true});

function getRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function addNewViewAAAContent(dl) {
  const newViewAAAContent = document.createElement("div");
  textarea.after(newViewAAAContent)
  if (dl.querySelector(".body")) {
    const textContent = dl.querySelector(".body").textContent;
    for (let i = 0; i < textContent.length; i++) {
      const span = document.createElement("span");
      span.style.opacity = "0";
      span.textContent = textContent[i];
      newViewAAAContent.append(span);
    }
    for (let i = 0; i < textContent.length; i++) {
      newViewAAAContent.querySelectorAll("span")[i].style.opacity = "1";
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    newViewAAAContent.textContent = dl.querySelector(".body").textContent;



  } else {
    console.log("想定外");
  }
}
