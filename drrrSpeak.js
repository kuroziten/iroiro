const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const ls = (await(await fetch("/ajax.php", { method: "post" })).json()).talks;
let id = ls[ls.length - 1].id;

const func = async () => {
    const list = (await (await fetch("/ajax.php", { method: "post" })).json()).talks;
    for (let i = 0; i < list.length; i++) {
        const t = list[list.length - 1 - i];
        const tId = t.id;
        if (id == tId) {
            if (i > 0) {
                const newT = list[list.length - i];
                let msg = newT.message;
                if (!!msg && msg != "/image") {
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
                            const audioPlayer = new Audio(audioSrc);
                            audioPlayer.play();
                        }
                    })
                        .catch((reason) => {
                            // エラー
                        });
                    await sleep(1500);
                    const newId = newT.id;
                    id = newId;
                }
            }
            break;
        }
    }
    setTimeout(() => func(), 500);
};
func();
