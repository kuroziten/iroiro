// １．socket変数を作成
script1 = document.createElement("script");
script1.innerHTML = `
	let socket = null;
`;
document.body.append(script1);

// ２．websocketに接続
script2 = document.createElement("script");
script2.type = "module";
script2.innerHTML = `
    import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
    socket = io("wss://kirihiro.com");
`;
document.body.append(script2);

// ３接続完了まで待機
await new Promise(r => {
    const interval = setInterval(() => {
        if (socket) {
            clearInterval(interval);
            r(socket);
        }
    }, 500);
});

// ４．受信時の設定
socket.on("message", (msg) => {
    console.log("受信しました", msg);
});

// ５．送信
socket.emit("message", {name: "ヌイカ", content: "うんこおおおお"});
