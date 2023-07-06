const querystring = require('querystring');

(async () => {
    const userName = "node";
    const userIcon = "bm";
    const tripPsw = "ziten";

    const header = {cookie: ""};
    const headers = {headers: header};

    const cookie = await(await fetch("https://drrrkari.com")).headers.get('set-cookie')
        + `;profile=${querystring.escape(userName)}:${userIcon}:ja-JP:${tripPsw};`;
    header.cookie = cookie;

    const response = await fetch("https://drrrkari.com", headers);
    console.log(await response.text());
})();

