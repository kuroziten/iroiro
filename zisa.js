
myYeah = "2024";
myMonth = "11";
myDay = "09";
myHour = "03";
myMinute = "54";
myZone = "0900";
myH = myZone.substr(0, 2);
myM = myZone.substr(2, 2);


zone = "1000";
h = zone.substr(0, 2);
m = zone.substr(2, 2);

saH = String(Number(myH) + (Number(myH) - Number(h))).padStart(2, "0");
saM = String(Number(myM) + (Number(myM) - Number(m))).padStart(2, "0");

console.log(new Date(`${myYeah}-${myMonth}-${myDay} ${myHour}:${myMinute} GMT+${saH}${saM}`).toString());
