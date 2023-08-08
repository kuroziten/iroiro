(async () => {
	for (let i = 1988; i <= new Date().getFullYear(); i++) {
		console.log(`${i} 年 検索開始`);
		let p = 1;
		while (true) {
			console.log(`${p} ページ目`);
			try {
				const div = document.createElement("div");
				document.body.append(div);
				const text = await (await fetch(`https://bungei-bunko.kodansha.co.jp/books/?year=${i}&page=${p}`)).text();
				div.innerHTML = text;
				for (let title of div.querySelector(".inner").querySelectorAll(".title")) {
					console.log(title.textContent.trim());
				}
				div.remove();
			} catch (e) {
				break;			
			}
			p++;
		}
	}
})();
