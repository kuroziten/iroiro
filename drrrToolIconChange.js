// <button popovertarget="my-popover">ポップオーバーを開く</button>
// <div popover id="my-popover">私から皆さんへ、こんにちは！</div>

const button = document.createElement("button");
button.textContent = "ちんぽ";
button.setAttribute("popovertarget", "my-popover");
document.body.prepend(button);

const popover = document.createElement("div");
popover.setAttribute("popover", "");
popover.id = "my-popover";
popover.textContent = "ちんこ";
document.body.append(popover);

popover.showPopover();


// // DB作成 & 取得
// const iconChange20250806Db = await new Promise(resolve => {
//   const request = indexedDB.open("iconChange20250806", 1);
//   request.onupgradeneeded = function(event) {
//     const db = event.target.result;
//     const store = db.createObjectStore("iconChange20250806", { keyPath: "name" });
//   };
//   request.onsuccess = () => {
//     resolve(event.target.result);
//   };
// });

// // DBに追加する関数
// const iconChange20250806DbAdd = async (name, data) => await new Promise(resolve => {
//   const transaction = iconChange20250806Db.transaction(["iconChange20250806"], "readwrite");
//   const store = transaction.objectStore("iconChange20250806");
//   const result = store.put({
//     name : name,
//     data: data
//   });
//   result.onsuccess = () => {
//     console.log("成功だにょ");
//     resolve();
//   }
// });

// const div = document.createElement("div");
// div.setAttribute("popover", "auto");
// div.id = "popover1";

// const view = document.createElement("div");
// view.textContent = "ちんぽ";
// div.append(view);

// document.body.append(div);

// const style = document.createElement("style");
// style.textContent = `
// 	#popover1 {
//   	display: none;
//   }
//   #popover1:popover-open {
// 		width: 100%;
//     height: 100%;
//     background-color: rgba(0,0,0,.1);
//     display: flex;
//     justify-content: center;
//     align-items: center;    
//   }
// `;
// // document.body.append(style);

// const li = document.createElement("li");
// document.querySelector(".menu").prepend(li);

// const u = document.createElement("u");
// u.textContent = "アイコン設定";
// li.append(u);

// li.addEventListener("click", () => {
//   console.log("agi", div);
//   try {
// 	  div.showPopver();
//   } catch(e) {
//     console.log(e);
//   }
//   console.log("agi1");
// });


// // div.showPopover();
// // div.hidePopover();
