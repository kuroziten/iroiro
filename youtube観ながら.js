const youtubeId = "qrR8AI8WYOM";
const div = document.createElement("div");
document.body.append(div);
div.style = `
	position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 285.25px;
  background-color: red;
  z-index: 100000;
`;
const iframe = document.createElement("iframe");
div.append(iframe);
iframe.src = "https://www.youtube.com/embed/" + youtubeId;
iframe.style = `
	width: 100%;
	height: 100%;
	border: 0;
`;
