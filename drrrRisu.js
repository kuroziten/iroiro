(async () => {
  const img = document.createElement("img");
  img.src = "https://hololive.hololivepro.com/wp-content/uploads/2020/07/Ayunda-Risu_pr-img_01.png";
  const style = img.style;
  style.position = "fixed";
  style.top = "100vw";
  style.zIndex = 99999;
  style.pointerEvents = "none";
  img.style.transition = "top .5s";
  document.body.append(img);

  while (true) {
    await new Promise(r => setTimeout(r, 500));
    style.top = "0";
    await new Promise(r => setTimeout(r, 500));
    style.top = "100vw";
  }
})();
