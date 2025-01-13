// 終わり時間
time = "10:00";
// 必要時間
reqTime = "08:30";


ls = time.split(":").map(e => Number(e));
reqLs = reqTime.split(":").map(e => Number(e));;
timeNum = (ls[0] * 60 + ls[1] - (60 * reqLs[0] + reqLs[1])) / 60;
if (timeNum < 0) {
	timeNum+=24;
}
res = String(Math.floor(timeNum)).padStart(2, "0") + ":" + String(timeNum % 1 * 60).padStart(2, "0");
console.log(time, "に終了する場合は", res, "に出社してください");
