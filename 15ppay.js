
const link1 = document.createElement("link");
const link2 = document.createElement("link");
const link3 = document.createElement("link");
link1.rel = "preconnect";
link1.href = "https://fonts.googleapis.com";
link2.rel = "preconnect";
link2.href = "https://fonts.gstatic.com";
link2.crossorigin = "";
link3.rel = "stylesheet";
link3.href = "https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap";
document.body.append(link1);
document.body.append(link2);
document.body.append(link3);
const style = document.createElement("style");
style.textContent = `
	:root {
		font-family: 'RocknRoll One', sans-serif;
		--size: 1;
	}
	body {
		margin: 0;
	}
	h1 {
		margin: 0;
		padding: calc(1vw * var(--size));
		background-color: green;
		text-align: center;
		color: red;
		font-size: calc(4vw);
		-webkit-text-stroke: calc(.1vw * var(--size)) white;
		text-stroke: calc(.1vw * var(--size)) white;
	}
	h1, h2, p {
		text-align: center;
	}
	p {
		width: 100vw;
	}
	div::nth-of-type(1) {
		display: flex;
  	align-content: center;
  	justify-content: center;
	}
`;
document.body.append(style);
