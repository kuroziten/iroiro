
const style = document.querySelector("style");
const i = (a,b) => `dl.${a} dt {background: transparent url(${b}) no-repeat center top;background-size: 60px;}`;
style.innerHTML = `${style.innerText}
${i("nyan","https://pbs.twimg.com/media/FoClJVDaAAArAzJ?format=png")}
${i("bm","https://drrrkari.com/upimg/024316e9d6ab4f29effb675fc0a6f76b.jpeg")}
`;

