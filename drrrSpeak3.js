value = document.querySelector("input").value;
function waitForAudioToEnd(audio) {
	return new Promise((resolve) => {
		audio.addEventListener('ended', resolve, { once: true });
	});
}

const speakObj = {
	"ケロロ二等兵": 100,
	"cent": 23,
	"ヌイカ2": 8,
	"ケンシロウ": 70,
	"しんじまいたい": 23,
};

async function p() {
	console.log("value", value);
	const inputList = document.querySelectorAll("input");

	if (inputList[0].value !== value) {
		for (i = 1; i < inputList.length; i++) {
			const e = inputList[i];
			if (e.value === value) {
				const e = inputList[i - 1];
				const msg = e.parentNode.querySelector("message").textContent;
				const name = e.parentNode.querySelector("name").textContent;
// 				let speak = 54;
				let speak = 42;
				if (name != "" && name in speakObj) {
					speak = speakObj[name];
				}
				if (msg !== "") {
					const form = new FormData();
					form.append("msg", msg);
					form.append("speak", speak);
					let res = await fetch("http://localhost:3001", {method: "post", body: form});
					res = await res.text();
					
					const audio = new Audio(res);
					audio.play();
					await audio.play(); // 再生を開始
					await waitForAudioToEnd(audio); // 再生終了まで待機					

				}
				value = inputList[i - 1].value;
				break;
			}
		}
	}
	await new Promise(r => setTimeout(r, 1000));
	p();
}
p();
