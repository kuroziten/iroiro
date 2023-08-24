(() => {
    let maxZIndex = 0;
    for (let e of document.querySelectorAll("*")) {
        maxZIndex = e.style.zIndex > maxZIndex ? e.style.zIndex : maxZIndex;
    }

    const button = document.createElement("button");
    button.style.width = "500px";
    button.style.height = "500px";
    button.style.fontSize = "100px";
    button.style.position = "absolute";
    button.style.top = "50%";
    button.style.left = "50%";
    button.style.transform = "translate(-50%, -50%)";
    button.style.zIndex = maxZIndex + 1;
    button.style.backgroundColor = "gray";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";

    button.textContent = "FULL";

    button.addEventListener("click", e=>{
        document.documentElement.requestFullscreen();
        e.target.remove();
    });
    document.body.prepend(button);
    undefined;
})();
