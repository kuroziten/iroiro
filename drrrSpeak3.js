value = document.querySelector("input").value;
function waitForAudioToEnd(audio) {
	return new Promise((resolve) => {
		audio.addEventListener('ended', resolve, { once: true });
	});
}

async function p() {
	console.log("value", value);
	const inputList = document.querySelectorAll("input");

	if (inputList[0].value !== value) {
		for (i = 1; i < inputList.length; i++) {
			const e = inputList[i];
			if (e.value === value) {
				const e = inputList[i - 1];
				const msg = e.parentNode.querySelector("message").textContent;
				if (msg !== "") {
					audio = new Audio(await(await(await fetch("http://localhost:3001?msg='" + e.parentNode.querySelector("message").textContent + "'")).text()));
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
