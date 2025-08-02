
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
.newViewAAA div {
	transition: filter 500ms;
}
.newViewAAA .hotalP {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0;
  height: 0;
  transition: all 5000ms;
}
.newViewAAA .hotalP .hotalC {
	min-width: 500px;
  min-height: 500px;
  background-color: red;
  filter: blur(.9rem);
  border-radius: 100%;
  opacity: .5;
  transition: all 3000ms;
}
`;
// filter: blur(-0.9rem);
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

// もじばけ
(async () => {
  while (true) {
    const divList = newView.querySelectorAll("div");
    const newViewAAAContent = divList[Math.floor(Math.random() * divList.length)];
    for (const span of newViewAAAContent.querySelectorAll("span")) {
      const tmp = span.textContent;
      if (getCharType(tmp)) {
        const txt = new TextDecoder('shift_jis').decode(new TextEncoder().encode(tmp));
        span.textContent = txt;
        await new Promise(resolve => setTimeout(resolve, rand(500) + 100));
        span.textContent = tmp;
        break;
      }
    }
    await new Promise(resolve => setTimeout(resolve, rand(5000)));
  }
})();

// ぶるぁあ
(async () => {
  while (true) {
    const divList = newView.querySelectorAll("div");
    const newViewAAAContent = divList[Math.floor(Math.random() * divList.length)];
    newViewAAAContent.style.filter = "blur(.9rem)";
    await new Promise(resolve => setTimeout(resolve, rand(500) + 100));
    newViewAAAContent.style.filter = "";
    await new Promise(resolve => setTimeout(resolve, rand(5000)));
  }
})();

// ホタル
(async () => {
  while (true) {
    const hotalP = document.createElement("div");
    hotalP.classList.add("hotalP");
    newView.append(hotalP);
    const hotalC = document.createElement("div");
    hotalC.classList.add("hotalC");
    hotalP.append(hotalC);
    hotalP.style.left = rand(100) + "%";
    hotalP.style.top = "120%";
    const size = rand(400) + 100;
    hotalC.style.minWidth = size + "px";
    hotalC.style.minHeight = size + "px";
    hotalC.style.backgroundColor = ["red", "black", "gray"][rand(3)];
    await new Promise(resolve => setTimeout(resolve, rand(100)));
    hotalP.style.top = "-20%";
    hotalP.style.transition = "all " + (rand(15000) + 5000) + "ms";
    hotalP.addEventListener('transitionend', (event) => {
      
      hotalC.style.minWidth = 0;
      hotalC.style.minHeight = 0;
      setTimeout(() => hotalP.remove(), 3000);
    });
    await new Promise(resolve => setTimeout(resolve, rand(5000)));
  }
})();


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
    const textContent = dl.querySelector("dt").textContent + "::" + dl.querySelector(".body").textContent;
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
  } else {
    console.log("想定外");
  }
}

function getCharType(char) {
  const code = char.charCodeAt(0);

  if (code >= 0x3040 && code <= 0x309F) {
    return 'ひらがな';
  } else if (code >= 0x30A0 && code <= 0x30FF) {
    return 'カタカナ';
  } else if (code >= 0x4E00 && code <= 0x9FFF) {
    return '漢字';
  } else {
    return false;
  }
}

function rand(ms) {
  return Math.floor(Math.random() * ms);
}
