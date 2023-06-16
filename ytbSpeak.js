
const sleep = ms =>new Promise(resolve => setTimeout(resolve, ms));

const ls = document.querySelectorAll("yt-live-chat-text-message-renderer");
let id = ls[ls.length - 1].getAttribute("id");


const func = async () => {
	console.log(" ");
	console.log("######################################################################");
	console.log(id);
	const list = document.querySelectorAll("yt-live-chat-text-message-renderer");
	console.log("----------------------------------------------------------------------");
	for (let i = 0; i < list.length; i++) {
		const t = list[list.length - 1 - i];
		const tId = t.getAttribute("id");
		console.log(tId);
		if (id == tId) {
			console.log("hit1");
			if (i > 0) {
				console.log("hit2");
				const newT = list[list.length - i];
				const msg = newT.querySelector("#message").textContent;
				await sleep(1500);
				const newId = newT.getAttribute("id");
				id = newId;
				const audio_query_response = await fetch(
					"http://localhost:50021/audio_query?text=" + msg + "&speaker=1",
					{
						method: 'post',
						headers: {'Content-Type': 'application/json'}
					}
				);
				const audio_query_json = await audio_query_response.json();
				console.log(audio_query_json);
				const synthesis_response = await fetch(
								"http://localhost:50021/synthesis?speaker=1",
								{
										method: 'post',
										body: JSON.stringify(audio_query_json),
										responseType: 'arraybuffer',
										headers: {"accept": "audio/wav", 'Content-Type': 'application/json'},
								}
						);
				const synthesis_response_buf = await synthesis_response.arrayBuffer();
				const base64Data = btoa(String.fromCharCode.apply(null, new Uint8Array(synthesis_response_buf)));
				const audioSrc = 'data:audio/wav;base64,' + base64Data;
				const audioPlayer = new Audio(audioSrc);
				audioPlayer.play();			}
			break;
		}
	}
	setTimeout(() => func(), 3000);
};
console.log("かいし");
func();
