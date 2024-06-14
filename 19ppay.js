(() => {
    var data = "PPPP00149999A11234567890abcdefghijklmnopqrstuvwxyzPPPP00149999A11234567890abcdefghijklmnopqrstuvwxyzPPPP";
    var searchData = [
    	{
    		lvi: 20,
    		id: "9999A1",
    		dt: [
    			{
                    type: "bit",
                    pos: 6,
                    len: 2
    			},
    			// {
       //              type: "x",
       //              pos: 8,
       //              len: 2
    			// },
    			// {
       //              type: "comp-3",
       //              pos: 10,
       //              len: 1
    			// },
    			{
                    type: "bit",
                    pos: 11,
                    len: 1
    			},
    		]
    	},
    ];
var getLength = (type, len) => {
    switch (type) {
        case "bit": 
        case "x": 
            return len * 2;
        case "comp-3":
            return len % 2 === 0 ? len : len + 1;
    }
};
for (const sd of searchData) {
    const dtId = Number(sd.lvi).toString(16).padStart(4, "0") + sd.id;
    const rg = new RegExp(dtId + ".{" + (sd.lvi * 2 - dtId.length) + "}", "g");
    const match = data.match(rg);
    if (match === null) {
        return;
    }
    match.forEach(dt => {
        const setSpan = (v, s) => `<span c="${s}">${v}</span>`;
        let txt = "";
        const lvi = dt.substr(0, 4);
        txt += setSpan(lvi, "lvi");
        const id = dt.substr(4, 6);
        txt += setSpan(id, "id");
        for (let i = 0; i < sd.dt.length; i++) {
            const d = sd.dt[i];
            const v = dt.substr((d.pos - 1) * 2, getLength(d.type, d.len));
            if (i > 0) {
                const d2 = sd.dt[i - 1];
                const v2 = dt.substring((d2.pos - 1) * 2 + getLength(d2.type, d2.len), (d.pos - 1) * 2);
                txt += v2;
            }
            txt += setSpan(v, "v");
        }
        const lastD = sd.dt[sd.dt.length - 1];
        const last = dt.substring((lastD.pos - 1) * 2 + getLength(lastD.type, lastD.len), dt.length);
        txt += last;
        console.log("txt", setSpan(txt, "txt"));
    });
}    
})();
