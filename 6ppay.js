process.stdin.resume();
process.stdin.setEncoding('utf8');
// 自分の得意な言語で
// Let's チャレンジ！！
var lines = [];
var reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
reader.on('line', (line) => {
    lines.push(line);
});
reader.on('close', () => {
    const size = lines[0];
    const tb = [];
    for (let i = 1; i <= size; i++) {
        tb.push(String(lines[i]).split(""));
    }
    const getVal = (r, c) => {
        return tb[r][c];
    };
    let maxCount = 0;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const v = Number(getVal(r, c));
            let count;
            let isPlus;
            let isPlusStartFlg;
            let i;
            let func1 = (isX) => {
                count = 0;
                isPlusStartFlg = true;
                isPlus = false;
                i = 1;
                for (let ii = (isX ? c : r) + 1; ii < size; ii++) {
                    const targetVal = isX ? Number(getVal(r, ii)) : Number(getVal(ii, c));
                    if (isPlusStartFlg) {
                        isPlusStartFlg = false;
                        if (targetVal != v - 1 && targetVal != v + 1) {
                            break;
                        } else if (targetVal == v + 1) {
                            isPlus = true;
                        } else {
                            isPlus = false;
                        }
                        count++;
                        i++;
                    } else {
                        if (targetVal != v + (isPlus ? i : -i)) {
                            break;
                        }
                        count++;
                        i++;
                    }
                }
                if (maxCount < count) maxCount = count;
            };
            func1(true);
            func1(false);


            // 右下
            const func2 = (isMigisita) => {
                let rr;
                let cc;
                //  右下
                rr = r + 1;
                cc = c + (isMigisita ? 1 : -1);
                count = 0;
                isPlusStartFlg = true;
                isPlus = false;
                i = 1;
                while (rr < size && (isMigisita ? (cc < size) : (cc >= 0))) {
                    const targetVal = Number(getVal(rr, cc));
                    if (isPlusStartFlg) {
                        isPlusStartFlg = false;
                        if (targetVal != v - 1 && targetVal != v + 1) {
                            break;
                        } else if (targetVal == v + 1) {
                            isPlus = true;
                        } else {
                            isPlus = false;
                        }
                        count++;
                        i++;
                    } else {
                        if (targetVal != Number(v) + Number(isPlus ? i : -i)) {
                            break;
                        }
                        count++;
                        i++;
                    }
                    rr++;
                    cc += isMigisita ? 1 : -1;
                }
                if (maxCount < count) maxCount = count;
            }
            func2(true);
            func2(false);

        }
    }
    console.log(maxCount + 1);
});
