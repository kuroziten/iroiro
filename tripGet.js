const querystring = require('querystring');
const cheerio = require('cheerio');
const fs = require('fs');

const filePath = 'memo07.txt';

(async () => {

    for (let i = 65; i <= 90; i++) {
        for (let ii = 65; ii <= 70; ii++) {
            for (let iii = 67; iii <= 67; iii++) {
                const userName = "node";
                const userIcon = "bm";
                const tripPsw = `0${String.fromCharCode(i)}${String.fromCharCode(ii)}${String.fromCharCode(iii)}`;
                const header = {cookie: ""};
                const headers = {headers: header};
                fetch("https://drrrkari.com").then(e => {
                    const cookie = e.headers.get("set-cookie")
                    + `;profile=${querystring.escape(userName)}:${userIcon}:ja-JP:${tripPsw};`;
                    header.cookie = cookie;
                    fetch("https://drrrkari.com", headers)
                    .then(e => e.text())
                    .then(e => {
                        const $ = cheerio.load(e);
                        const elements = $('.name');
                        const thirdElementText = elements.eq(elements.length - 1).text();
                        fs.appendFile(filePath, tripPsw + " → " + thirdElementText + "\n", function (err) {
                            if (err) {
                              console.error('ファイルの追記中にエラーが発生しました:', err);
                              return;
                            }
                        });
                    });
                });
            }
        }
    }

})();
