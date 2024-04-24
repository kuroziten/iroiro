list = Array.from(document.querySelectorAll("div")).filter(e=>/^ListView__ItemContainer/.test(e.className));
srclist = [];
(async()=>{
  for(let e of list) {
		await new Promise( resolve => setTimeout(resolve, 500));
    e.querySelector("a").click();
		await new Promise( resolve => setTimeout(resolve, 500));
    a = Array.from(document.querySelectorAll("a")).filter(e=>/\/mylist\/purchase\/book/.test(e.href));
//     console.log(a);
		o = false;
		if (a.length > 0) {
			o = true;
			a[0].click();
		}
		await new Promise( resolve => setTimeout(resolve, 1500));
		list3 = Array.from(document.querySelectorAll("div"))
		.filter(e=>/^Components__EpisodeListItemContainer-sc-/.test(e.className));

		s = Array.from(document.querySelectorAll("div"))
		.filter(e=>/shared__SiteOverlay-sc-/.test(e.className))[0];

		sbk = -1;
		while (s.scrollTop < s.scrollHeight) {
			s.scrollTop += window.innerHeight / 2;
			if (s.scrollTop == sbk) {
				break;
			}
			await new Promise( resolve => setTimeout(resolve, 50));
			sbk = s.scrollTop;
		}
		await new Promise( resolve => setTimeout(resolve, 500));

		srclist.push(location.href);
		console.log(location.href);
		for (let e2 of list3) {
			list4 = Array.from(e2.querySelectorAll("div"))
			.filter(e=>/^PurchasedBadge__BadgeContainer-sc-eq/.test(e.className))
			.filter(e=>e.textContent=="購入済み");
			if (list4.length) {
				src = e2.querySelectorAll("picture")[0].querySelector("img").src;
// 				console.log(src.substring(0, src.indexOf("jpg") + 3));
				
				srclist.push(src.substring(0, src.indexOf("jpg") + 3));
			}
		}
		if (o) {
			history.back();
			await new Promise( resolve => setTimeout(resolve, 100));
			
		}
		history.back();
  }
	console.log(srclist.map(e=>e.substring("https://".length)).join(","));
})();

