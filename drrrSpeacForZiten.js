
document.body.prepend(document.createElement("input"));
let id = document.querySelector("linux").querySelector("input").value;
const audioList = [];
const audio = document.createElement("audio");
document.body.append(audio);
audio.addEventListener("ended", () => audioList.shift());
const func = async () => {
    const list = document.querySelectorAll("linux");
    for (let i = 0; i < list.length; i++) {
        const t = list[i];
        const tId = t.querySelector("input").value;
        if (id == tId && i > 0) {
					id = list[i - 1].querySelector("input").value;
					let msg = list[i - 1].querySelector("message").textContent;
					if (!!msg && msg != "/image" && msg.slice(0, 4) != "http" && msg.slice(0, 3) != "/ai") {
						msg = msg.replace(/\s+/g, '+');
						const audio_query_response = await fetch(
							"http://localhost:50021/audio_query?text=" + msg + "&speaker=3",
							{
								method: 'post',
								headers: { 'Content-Type': 'application/json' }
							}
						);
						const audio_query_json = await audio_query_response.json();
						const synthesis_response = await fetch(
							"http://localhost:50021/synthesis?speaker=3",
							{
								method: 'post',
								body: JSON.stringify(audio_query_json),
								responseType: 'arraybuffer',
								headers: { "accept": "audio/wav", 'Content-Type': 'application/json' },
							}
						).then(async (response) => {
							if (response.ok) {
								const synthesis_response_buf = await response.arrayBuffer();
								const base64Data = btoa(String.fromCharCode.apply(null, new Uint8Array(synthesis_response_buf)));
								const audioSrc = 'data:audio/wav;base64,' + base64Data;
								audioList.push({
									msg: msg,
									src: audioSrc,
									sts: 0
								});
							}
						})
						.catch((reason) => {
							// エラー
						});
					}
					break;
        }
				
    }
		if (audioList.length > 0 && audioList[0].sts == 0) {
			audioList[0].sts = 1;
			audio.src = audioList[0].src;
			audio.play();
		}
    setTimeout(() => func(), 500);
};
func();
