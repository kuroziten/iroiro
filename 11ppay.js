const q = v => document.querySelector(v);
const t = q("textarea");
const t2 = t.cloneNode(1)
t.before(t2);
t.style = "display: none";
t2.style = "background-color: #F0FFFF"
t2.addEventListener("keydown", e => {
	e.preventDefault();
	if(e.key == "Enter"){
		t.value = "🐟" + t2.value;
		t2.value = "";
		q('input[value="POST!"]').click();
	}
});
