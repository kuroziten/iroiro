const imgList = [];
const interval = setInterval(() => {
  const list = Array.from(document.querySelectorAll("img")).filter(e => e.className && !e.alt);
  if (list.length) {
    list.forEach(e => {
      imgList.push(e.src.split("&")[0]);
      e.closest('li[role="listitem"]').remove();
    });
  } else {
    console.log("処理を終了します。");
    console.log(imgList);
    clearInterval(interval);
  }
}, 1000);
