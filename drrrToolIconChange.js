const style = document.createElement("style");
style.textContent = `
  #popover1:popover-open {
		width: 50%;
    height: 50%;
    background-color: rgba(0,0,0,1);
    display: block;
    margin: auto auto;
  }
`;
document.body.append(style);

// DB作成 & 取得
const iconChange20250806Db = await new Promise(resolve => {
  const request = indexedDB.open("iconChange20250806", 1);
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const store = db.createObjectStore("iconChange20250806", { keyPath: "name" });
  };
  request.onsuccess = () => {
    resolve(event.target.result);
  };
});

// DBに追加する関数
const iconChange20250806DbAdd = async (name, data) => await new Promise(resolve => {
  const transaction = iconChange20250806Db.transaction(["iconChange20250806"], "readwrite");
  const store = transaction.objectStore("iconChange20250806");
  const result = store.put({
    name : name,
    data: data
  });
  result.onsuccess = () => {
    console.log("成功だにょ");
    resolve();
  }
});

const getImgData = async url => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Fetch failed');

  const arrayBuffer = await response.arrayBuffer();

	return new Blob([arrayBuffer]);
};

const bdt = await getImgData("https://pbs.twimg.com/media/FgUYH2WVQAA9IRs?format=jpg");
await iconChange20250806DbAdd("ヌイカ2", bdt);
document.querySelector("dt").style.background = "transparent url('" + URL.createObjectURL(bdt) + "') no-repeat center top";


const div = document.createElement("div");
div.setAttribute("popover", "");
div.id = "popover1";

const view = document.createElement("div");
view.textContent = "ちんぽ";
div.append(view);

document.body.append(div);

const li = document.createElement("li");
document.querySelector(".menu").prepend(li);

const u = document.createElement("u");
u.textContent = "アイコン設定";
li.append(u);

li.addEventListener("click", () => {
  console.log("agi", div);
  try {
	  div.showPopover();
  } catch(e) {
    console.log(e);
  }
  console.log("agi1");
});


// div.showPopover();
// div.hidePopover();
