document.querySelectorAll(".body").forEach(e => {
	const txt = e.textContent;
	console.log(txt);
	const txtList = txt.split("");
	e.textContent = "";
	for (let t of txtList) {
		const d = document.createElement("div");
		d.textContent = t;
		e.append(d);
	}
});
