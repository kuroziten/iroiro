function timeCalc(time, reduceTime) {

    const timeS = time.split(":").map(e => Number(e));
    const timeMinute = timeS[0] * 60 + timeS[1];

    const reduceTimeS = reduceTime.split(":").map(e => Number(e));
    const reduceMinute = reduceTimeS[0] * 60 + reduceTimeS[1];

    let resTime = timeMinute - reduceMinute;
    if (resTime < 0) {
        resTime += 60 * 24;
    }
    const hh = String(Math.floor(resTime / 60)).padStart(2, "0");
    const mm = String(resTime % 60).padStart(2, "0");

    return hh + ":" + mm;
}

function timeCalcAction(time, list) {
    let res = time;
    const resList = [];
    for (const e of list.reverse()) {

        res = timeCalc(res, e[1]);
        resList.push([e[0], res]);
    }
    for (const e of resList.reverse()) {
        console.log(e[0], e[1]);
    }
};

timeCalcAction("21:00", [
    ["ご飯の準備", "03:00"],
    ["ご飯食べる", "05:00"],
    ["寝る", "08:00"],
    ["起きて準備", "01:00"],
    ["家を出る", "01:40"],
    ["仕事開始", "08:30"],
]);
