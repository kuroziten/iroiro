(async () => {
    const idList = [];
    let page = 1;
    const startDate = new Date();
    do {
        const div = document.createElement("div");
        document.body.append(div);
        div.innerHTML = await (await fetch(`https://bookclub.kodansha.co.jp/product_list?page=${page}&code=bungei-bunko`)).text();
        if (div.querySelector("h1").textContent.trim() == "リクエスト集中により処理が完了できませんでした") {
            break;
        } else {
            console.log(`${page} ページ目 処理開始`);
            div.querySelectorAll(".boxL").forEach(boxL => idList.push([boxL.querySelector(".tit").textContent.trim(), boxL.getAttribute("href")]));
        }
        div.remove();
        page++;
    } while (1);

    const count = idList.length;
    const dataList = [];
    idList.forEach(id => getData(id));

    function getData(id) {
        const url = `https://bookclub.kodansha.co.jp${id[1]}`;
        fetch(url)
            .then(async e => {
                const div = document.createElement("div");
                document.body.append(div);
                div.innerHTML = await e.text();
                const data = {};
                data.TITLE = `"${id[0].replace(/"/g, '""')}"`;
                data.URL = url;
                if (div.querySelector(".itemInfo") != null) {
                    const tdList = div.querySelector(".itemInfo").querySelectorAll("td");
                    data.AUTHOR = `"${tdList[1].textContent.trim().replace(/"/g, '""')}"`;
                    data.RELEASE_DATE = `"${tdList[2].textContent.trim().replace(/"/g, '""')}"`;
                    data.PRICE = `"${tdList[3].textContent.trim().replace(/"/g, '""')}"`;
                    data.ISBN = `"${tdList[4].textContent.trim().replace(/"/g, '""')}"`;
                    data.FORMAT = `"${tdList[5].textContent.trim().replace(/"/g, '""')}"`;
                    data.PAGE = `"${tdList[6].textContent.trim().replace(/"/g, '""')}"`;
                    data.DETAIL = `"${div.querySelector("#contIn_text")?.textContent.replace(/"/g, '""')}"`;
                } else {
                    data.AUTHOR = "";
                    data.RELEASE_DATE = "";
                    data.PRICE = "";
                    data.ISBN = "";
                    data.FORMAT = "";
                    data.PAGE = "";
                    data.DETAIL = "";
                }
                dataList.push(data);
                div.remove();
            })
            .catch(async e => {
                console.log(`接続エラー ${url}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                getData(id);
            });
    }

    const si = setInterval(() => {
        console.log(`処理中 ${dataList.length}/${count}`);
        const pastTime = new Date();
        pastTime.setSeconds(pastTime.getSeconds() - 5);
        if (count == dataList.length) {
            console.log(`処理完了 --処理時間：${(new Date().getTime() - startDate.getTime()) / 1000} 秒`);
            const separator = ',';
            const keys = Object.keys(dataList[0]);
            const header = keys.join(separator);
            const csvRows = dataList.map(object => keys.map(key => object[key]).join(separator));
            const csvContent = [header, ...csvRows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.innerText = "CSVファイルをダウンロード";
            link.href = URL.createObjectURL(blob);
            link.download = "booklist.csv";
            document.body.innerHTML = "";
            document.body.append(link);
            clearInterval(si);
        }
    }, 3000);
})();
