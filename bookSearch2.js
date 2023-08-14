(async () => {
    const startDate = new Date();
    let page = 1;
    const idList = [];
    let process = 0;
    let compProcess = 0;
    let processEndFlg = false;
    const processCount = 100;
    do {
        const action = page => {
      fetch(`https://bookclub.kodansha.co.jp/product_list?page=${page}&code=bungei-bunko`)
      .then(async e => {
                const div = document.createElement("div");
                div.innerHTML = await e.text();
                if (div.querySelector("h1").textContent.trim() == "リクエスト集中により処理が完了できませんでした") {
                    processEndFlg = true;
        } else {
                    div.querySelectorAll(".boxL").forEach(boxL => idList.push(boxL.getAttribute("href").split("=")[1]));                    
                }
                process++;
            })
            .catch(async e => {
                await new Promise(resolve => setTimeout(resolve, 500));
                action(page);
            });
        };
        action(page);
        compProcess++;

        if (page % 100 == 0) {
            while(process != compProcess) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        if (processEndFlg) {
            break;
        }

        page++;
    } while(1);

    console.log(`${idList.length} 件 処理開始`);

    process = 0;
    compProcess = 0;
    const dataList = [];

    for (let i = 0; i < idList.length; i++) {
        const action = id => {
            const url = `https://bookclub.kodansha.co.jp/product?item=${idList[i]}`;
            fetch(url)
            .then(async e => {
                const div = document.createElement("div");
                div.innerHTML = await e.text();
                const tdList = div.querySelector(".itemInfo")?.querySelectorAll("td");
                if (tdList == undefined) {
                    console.log(`リトライ ${url}`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    action(id);
                    return;
                }
                const data = {};
                data.TITLE = `"${tdList[0].textContent.trim().replace(/"/g, '""')}"`;
                data.URL = url;
                data.AUTHOR = `"${tdList[1].textContent.trim().replace(/"/g, '""')}"`;
                data.RELEASE_DATE = `"${tdList[2].textContent.trim().replace(/"/g, '""')}"`;
                data.PRICE = `"${tdList[3].textContent.trim().replace(/"/g, '""')}"`;
                data.ISBN = `"${tdList[4].textContent.trim().replace(/"/g, '""')}"`;
                data.FORMAT = `"${tdList[5].textContent.trim().replace(/"/g, '""')}"`;
                data.PAGE = `"${tdList[6].textContent.trim().replace(/"/g, '""')}"`;
                data.DETAIL = `"${div.querySelector("#contIn_text")?.textContent.replace(/"/g, '""')}"`;
                dataList.push(data);
                process++;
                div.querySelector
            }).catch(async e => {
                    console.log(`スーパーリトライ ${url}`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    action(id);
                    return;
            });
        }
        action(idList[i]);
        compProcess++;
        if (process <= compProcess - processCount) {
            while(process <= compProcess - processCount) {
                console.log(`処理中 ${process} / ${compProcess}`);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
    
    while (process != idList.length) {
        console.log(`処理中 ${process} / ${compProcess}`);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
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
})();
