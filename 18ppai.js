const targetEncIp = "CFT";
setInterval(
    async () => 
    Object.values((await(await fetch("/ajax.php",{method:"post"})).json()).users).forEach(e=>{
        if (e.encip?.slice(0,3)==targetEncIp.slice(0,3)) {
            const body = new FormData();
            body.append("ban_user", e.id);
            body.append("block", 1);
            fetch("?ajax=1",{method:"post",body:body});
        }
    }),
    100
);
