(async () => {

	let p = 1;
  let boxLList = [];
	let dataList = [];
	let updtDate = new Date();
	let count1 = 0;
	let count2 = 0;
	do {
		console.log(`${p} ページ目処理開始 ${updtDate.getTime()}`);
    const div = document.createElement("div");
    document.body.append(div);
		try {
	    div.innerHTML = await (await fetch(`https://bookclub.kodansha.co.jp/product_list?page=${p}&code=bungei-bunko`)).text();
		} catch(e) {
			console.log("コンティニューします");
			await new Promise(resolve => setTimeout(resolve, 1000));
			updtDate = new Date();
			continue;
		}
		boxLList = div.querySelectorAll(".boxL");
		let i = 1;
		for (let boxL of boxLList) {
			count1++;
			getData(p, i, dataList, `https://bookclub.kodansha.co.jp${boxL.getAttribute("href")}`, boxL.querySelector(".tit").textContent);
			i++;
		}
    div.remove();
		p++;
	} while(boxLList.length != 0);

	const si = setInterval(() => {
		const pastTime = new Date();
		pastTime.setSeconds(pastTime.getSeconds() - 5);
		if (updtDate < pastTime) {
			alert(`処理完了 ${count1} ${count2}`);
			console.log(`処理完了 ${count1} ${count2}`);
			const json = JSON.stringify(dataList, null, 4);
			console.log(json);
			document.body.innerText = json;
			clearInterval(si);
		}
	}, 1000);	

	function getData(p, i, dataList, url, tit) {
		updtDate = new Date();
		fetch(url)
		.then(async e => {
			updtDate = new Date();
			try {
        const div2 = document.createElement("div");
        document.body.append(div2);
        div2.innerHTML = await e.text();
        const tdList = div2.querySelector(".itemInfo")?.querySelectorAll("td");
        const data = {};

        data.title = tit;
        if (tdList != null) {
          data.author = tdList[1].textContent.trim();
          data.releaseDate = tdList[2].textContent.trim();
          data.price = tdList[3].textContent.trim();
          data.ISBN = tdList[4].textContent.trim();
          data.format = tdList[5].textContent.trim();
          data.page = tdList[6].textContent.trim();
          data.url = url;
          data.detail = div2.querySelector("#contIn_text")?.textContent.trim();
        } else {
          data.author = "";
          data.releaseDate = "";
          data.price = "";
          data.ISBN = "";
          data.format = "";
          data.page = "";
          data.url = url;
          data.detail = "";
        }
        dataList.push(data);
        div2.remove();
				count2++;
// 				console.log(`${p} ページ ${i} 冊目 処理完了 ${tit} ${url}`);
			} catch(e) {
				console.log(`${p} ページ ${i} 冊目 変なエラー リトライします ${tit} ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        getData(p, i, updtDate, dataList, url);
			}
		})
		.catch(async e => {
			updtDate = new Date();
			console.log(`${p} ページ ${i} 冊目 リトライします ${tit} ${url}`);
			await new Promise(resolve => setTimeout(resolve, 1000));
			getData(p, i, updtDate, dataList, url);
		});
	}
})();
