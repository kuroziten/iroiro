(async () => {

    let p = 1;
  let boxLList = [];
    let dataList = [];
    let updtDate = new Date();
    do {
        console.log(`${p} ページ目処理開始`);
    const div = document.createElement("div");
    document.body.append(div);
    div.innerHTML = await (await fetch(`https://bookclub.kodansha.co.jp/product_list?page=${p}&code=bungei-bunko`)).text();
        boxLList = div.querySelectorAll(".boxL");
        for (let boxL of boxLList) {
            getData(p, i, updtDate, dataList, `https://bookclub.kodansha.co.jp${boxL.getAttribute("href")}`)
        }
    div.remove();
        p++;
    } while(boxLList.length != 0);

    const si = setInterval(() => {
        const pastTime = new Date(); // 現在の時間をコピー
        pastTime.setSeconds(pastTime.getSeconds() - 3); // 3秒前の時間を設定
        if (updtDate < pastTime) {
            console.log("処理完了");
            console.log(JSON.stringify(dataList));
            clearInterval(si);
        }
    }, 1000);   

    function getData(p, i, updtDate, dataList, url) {
        fetch(url)
        .then(async e => {
            const div2 = document.createElement("div");
        document.body.append(div2);
            div2.innerHTML = await e.text();
            const tdList = div2.querySelector(".itemInfo").querySelectorAll("td");
            const data = {};

            data.title = tdList[0].textContent.trim();
            data.author = tdList[1].textContent.trim();
            data.releaseDate = tdList[2].textContent.trim();
            data.price = tdList[3].textContent.trim();
            data.ISBN = tdList[4].textContent.trim();
            data.format = tdList[5].textContent.trim();
            data.page = tdList[6].textContent.trim();
//          data.detail = div2.querySelector("#contIn_text").textContent.trim();
            dataList.push(data);
            div2.remove();
        })
        .catch(e => getData(p, i, updtDate, dataList, url));
    }
})();
