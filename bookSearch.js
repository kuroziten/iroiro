
(async () => {

	let p = 1;
  let boxLList = [];
	let dataList = [];
	do {
    const div = document.createElement("div");
    document.body.append(div);
    div.innerHTML = await (await fetch(`https://bookclub.kodansha.co.jp/product_list?page=${p}&code=bungei-bunko`)).text();
		boxLList = div.querySelectorAll(".boxL");
		for (let boxL of boxLList) {
			const div2 = document.createElement("div");
	    document.body.append(div2);
			div2.innerHTML = await (await fetch(`https://bookclub.kodansha.co.jp${boxL.getAttribute("href")}`)).text();
			const tdList = div2.querySelector(".itemInfo").querySelectorAll("td");
			const data = {};

			data.title = tdList[0].textContent.trim();
			data.author = tdList[1].textContent.trim();
			data.releaseDate = tdList[2].textContent.trim();
			data.price = tdList[3].textContent.trim();
			data.ISBN = tdList[4].textContent.trim();
			data.format = tdList[5].textContent.trim();
			data.page = tdList[6].textContent.trim();
			data.detail = div2.querySelector("#contIn_text").textContent.trim();
			console.log(data.title);
			dataList.push(data);
			div2.remove();
		}
    div.remove();
		p++;
	} while(boxLList.length != 0);
	console.log(dataList);
})();
