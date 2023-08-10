const { JSDOM } = require("jsdom");
const fs = require('fs');
const { exec } = require('child_process');
(async () => {
    const startDate = new Date();
    let page = 1;
    const pageObjList = [];
    let searchTarget = [];
    // ページの処理中件数
    let process = 0;
    // ページの必要処理件数
    let processComp = 0;
    // エンドページフラグ
    let processEnd = false;
    // 10ページずつ処理

    do {
        fetch(`https://bookclub.kodansha.co.jp/product_list?page=${page}&code=bungei-bunko`)
        .then(async e => {
            const html = new JSDOM(await e.text()).window.document;
            const boxLList = html.querySelectorAll(".boxL");
            if (boxLList.length == 0) {
                processEnd = true;
                process++;
                return;
            }
            boxLList.forEach(boxL => {
                const pageObj = {
                    id: boxL.getAttribute("href").split("=")[1],
                    tit: boxL.querySelector(".tit").textContent.trim(),
                };
                searchTarget.push(`${pageObj.id}.csv`);
                pageObjList.push(pageObj);
            });
            process++;
        });
        processComp++;
        console.log(`${page} ページ目処理開始`)
        if (page % 100 == 0) {
            while (process !== processComp) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        page++;
    } while(!processEnd);
    console.log(`処理完了 有効ページ件数：${pageObjList.length}`);

    const action = pageObj => {
        const url = `https://bookclub.kodansha.co.jp/product?item=${pageObj.id}`;
        fetch(url)
        .then(async e => {
            const html = new JSDOM(await e.text()).window.document;
            const tdList = html.querySelector(".itemInfo")?.querySelectorAll("td");
            const data = {};
            data.TITLE = pageObj.tit;
            data.URL = url;
            if (tdList == undefined) {
                data.AUTHOR = "";
                data.RELEASE_DATE = "";
                data.PRICE = "";
                data.ISBN = "";
                data.FORMAT = "";
                data.PAGE = "";
                data.DETAIL = "";
            } else {
                data.AUTHOR = `"${tdList[1].textContent.trim().replace(/"/g, '""')}"`;
                data.RELEASE_DATE = `"${tdList[2].textContent.trim().replace(/"/g, '""')}"`;
                data.PRICE = `"${tdList[3].textContent.trim().replace(/"/g, '""')}"`;
                data.ISBN = `"${tdList[4].textContent.trim().replace(/"/g, '""')}"`;
                data.FORMAT = `"${tdList[5].textContent.trim().replace(/"/g, '""')}"`;
                data.PAGE = `"${tdList[6].textContent.trim().replace(/"/g, '""')}"`;
                data.DETAIL = `"${html.querySelector("#contIn_text")?.textContent.replace(/"/g, '""')}"`;
            }
            // CSVファイルへの出力
            const csvHeader = Object.keys(data).join(',') + '\n';
            const csvContent = csvHeader + Object.values(data).join(',');    
            fs.writeFileSync(`${pageObj.id}.csv`, csvContent);
        })
        .catch(async e => {
            await new Promise(resolve => setTimeout(resolve, 500));
            action(pageObj);
        });
    };
    pageObjList.forEach(pageObj => action(pageObj));

    const si1 = setInterval(() => {
        let newSearchTarget = [];
        searchTarget.forEach(csvFileName => {
            if (!fs.existsSync(csvFileName)) newSearchTarget.push(csvFileName);
        });
        searchTarget = newSearchTarget;
        console.log(`処理中 ${pageObjList.length - searchTarget.length} / ${pageObjList.length}`);
        if (searchTarget.length == 0) {
            clearInterval(si1);

            let headerPushFlg = false;
            const combinedCsvData = [];
            for (const pageObj of pageObjList) {
                const fileContent = fs.readFileSync(`${pageObj.id}.csv`, 'utf8');
                const lines = fileContent.split('\n');
            
                if (!headerPushFlg) {
                    combinedCsvData.push(lines[0]);
                    headerPushFlg = true;
                }
            
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim() !== '') {
                        combinedCsvData.push(lines[i]);
                    }
                }
                fs.unlinkSync(`${pageObj.id}.csv`);
            }
            fs.writeFileSync("CSV.csv", combinedCsvData.join('\n'));
            console.log(`処理完了 ${(new Date().getTime() - startDate.getTime()) / 1000} 秒`);
        }
    }, 1000);

})();
