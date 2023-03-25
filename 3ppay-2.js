const session_hash = Math.random().toString(36).substr(2, 11);
await fetch("run/predict/", {
    method: "POST",
    body: JSON.stringify({
        data: [],
        fn_index: "206",
        session_hash: session_hash,
    }),
    headers: {
        "Content-Type": "application/json"
    }    
})
await fetch("run/predict/", {
    method: "POST",
    body: JSON.stringify({
        data: [],
        fn_index: "214",
        session_hash: session_hash,
    }),
    headers: {
        "Content-Type": "application/json"
    }    
})
await fetch("run/predict/", {
    method: "POST",
    body: JSON.stringify({
        data: [],
        fn_index: "215",
        session_hash: session_hash,
    }),
    headers: {
        "Content-Type": "application/json"
    }    
})
const W = new WebSocket("wss://48c98b231b3da19bd9.gradio.live/queue/join");
