style = document.createElement("style");
style.textContent = `
span {
animation-iteration-count: infinite;
animation-name: test;
animation-duration: 1s;
display: inline-block;
animation-timing-function: linear;
}
@keyframes test {
0% {
rotate: 0deg;
}
100% {
rotate: 360deg;
}
}
`;
document.body.append(style);
document.querySelectorAll(".body").forEach(e => e.innerHTML = e.textContent.split("").map(e => `<span>${e}</span>`).join(""));
