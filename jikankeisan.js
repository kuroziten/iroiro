
function timeCalc(time, reqTime) {

	const ls = time.split(":").map(e => Number(e));
	const reqLs = reqTime.split(":").map(e => Number(e));;
	let timeNum = (ls[0] * 60 + ls[1] - (60 * reqLs[0] + reqLs[1])) / 60;
	if (timeNum < 0) {
		timeNum+=24;
	}
	const res = String(Math.floor(timeNum)).padStart(2, "0") + ":" + String(timeNum % 1 * 60).padStart(2, "0");
	return res;
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

timeCalcAction("22:00", [
	["ご飯の準備", "03:00"],
	["ご飯食べる", "05:00"],
	["寝る", "08:00"],
	["起きて準備", "01:00"],
	["家を出る", "02:00"],
	["仕事開始", "08:30"],
]);
