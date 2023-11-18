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
		color: white;
	}
	body {
		margin: 0;
		background: linear-gradient(0deg, #1D3156, #2D4166);
		min-height: 100vh;
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
	div:nth-child(n + 3) {
		display: flex;
  	align-content: center;
  	justify-content: center;
	}
	th:nth-child(n + 2) {
		border-left: 1px solid black;
	}
	th {
		padding: calc(.5vw * var(--size))
	}
	
	input[type="button"],input[type="submit"] {
		font-family: 'RocknRoll One', sans-serif;
		background-color: aqua;
		width: calc(100% - 1px);
		height: 100%;
		margin: 1px;
		border-radius: 5px;
		border: 1px solid black;
	}
	div:nth-of-type(2) {
		td:nth-of-type(2) {
			display: flex;
    	align-items: center;
    	justify-content: center;
		}
	}
	.tbl, .tbl td, .tbl th {
		border: 1px solid white;
		padding: 0;
	}
	.tbl td {
		border-left: 0;
  	border-top: 0;
	}
	.tbl td:nth-child(n + 2) {
		border-right: 0;
	}
	a {
		color: aqua;
	}
	footer {
		position: fixed;
  	bottom: 0;
  	background-color: rgba(200,200,0,.1);
	}
`;
document.body.append(style);
