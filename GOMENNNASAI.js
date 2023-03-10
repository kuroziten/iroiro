(() => {
    s = "";
    for (i=0;i<24;i++)s+="ごめんなさい";
    b = new FormData();
    h = {message: s,valid: 1};
    for (let k in h)b.append(k, h[k]);
    setInterval(() => {
        fetch(
            "?ajax",
            {method: 'POST', body: b}
        );
    },800);
})();
