(async () => {

	const startDate = new Date();
	let p = 1;
  let boxLList = [];
	let dataList = [];
	let updtDate = new Date();
	let count1 = 0;
	let count2 = 0;
	let endFlg = false;
	do {
		console.log(`${p} ページ目処理開始 ${updtDate.getTime()}`);
		if (p % 10 == 0) {
			await getDataBase(p, true);
		} else {
			getDataBase(p, false);
		}
		
		p++;
		console.log(`${p} ${endFlg}`);
	} while(!endFlg);

	const si = setInterval(() => {
		const pastTime = new Date();
		pastTime.setSeconds(pastTime.getSeconds() - 5);
		if (updtDate < pastTime && count1 == count2) {
			console.log(`処理完了 ${count1} ${count2}`);
			const json = JSON.stringify(dataList, null, 4);
			console.log(json);
			document.body.innerText = json;
			console.log(`処理時間：${(new Date().getTime() - startDate.getTime()) / 1000}`);
			alert(`処理完了 ${count1} ${count2}`);
			clearInterval(si);
		}
	}, 1000);	

	async function getDataBase(p, awaitFlg) {
		updtDate = new Date();
		const url = `https://bookclub.kodansha.co.jp/product_list?page=${p}&code=bungei-bunko`;
		if (!awaitFlg) {
			fetch(url)
			.then(async e => {
				getDataBaseAction(await e.text());
			})
			.catch(async e => {
				updtDate = new Date();
				console.log(`${p} ページ目 リトライします ${url}`);
				await new Promise(resolve => setTimeout(resolve, 1000));
				getDataBase(p);
			});		
		} else {
			getDataBaseAction(await(await fetch(url)).text());
		}
	}
	function getDataBaseAction(html) {
			const div = document.createElement("div");
			document.body.append(div);
			div.innerHTML = html;
			if (div.querySelector("h1").textContent == "リクエスト集中により処理が完了できませんでした") {
				endFlg = true;
			} else {
				const boxLList = div.querySelectorAll(".boxL");
				let i = 1;
				for (let boxL of boxLList) {
					count1++;
					getData(p, i, dataList, `https://bookclub.kodansha.co.jp${boxL.getAttribute("href")}`, boxL.querySelector(".tit").textContent);
					i++;
				}
			}
			div.remove();
	}
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
