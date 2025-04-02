
currentTime = (new class {
    constructor() {
        this.now = new Date();
        this.dateSet();
    };
    dateSet() {
        this.currentYear = this.now.getFullYear();
        this.currentMonth = this.now.getMonth() + 1;
        this.currentDate = this.now.getDate();
        this.currentDay = this.now.getDay();
        this.currentHour = this.now.getHours();
        this.currentMinutes = this.now.getMinutes();
        this.lastDate = new Date(this.currentYear, this.currentMonth + 1, -1).getDate();
        this.currentNthDay = Math.ceil(this.currentDate / 7); // 現在は第何
    }
    next() {
        this.now.setDate(this.now.getDate() + 1);
        this.dateSet();
    }
});

yearFlg = 1;
yearList = [2024, 2025, 2026].sort();

monthFlg = 1;
monthList = [3, 4, 5].sort();

dayFlg = 2;
dateList = [1, 2, 3].sort();
weekDayList = [
    [1, 1] // 第１月曜日
];

hour = 0;
minutes = 30;

if (currentTime.currentHour > hour || currentTime.currentHour === hour && currentTime.currentMinutes > minutes) {
    currentTime.next();
    console.log(currentTime);
}

let resultDate = null;
if (dayFlg === 1) {
    for (const year of yearList) {

        if (year < currentTime.currentYear) continue;
        for (const month of monthList) {

            if (year === currentTime.currentYear && month < currentTime.currentMonth) continue;
            for (const date of dateList) {

                if (year === currentTime.currentYear && month === currentTime.currentMonth && date < currentTime.currentDate) continue;
                resultDate = {
                    year: year,
                    month: month,
                    date: date
                };
                if (resultDate !== null) break;
            }
            if (resultDate !== null) break;
        }
        if (resultDate !== null) break;
    }
} else if (dayFlg === 2) {
    for (const year of yearList) {

        if (year < currentTime.currentYear) continue;
        for (const month of monthList) {

            if (year === currentTime.currentYear && month < currentTime.currentMonth) continue;
            const weekDayObj = {};
            const lastDate = new Date(year, month + 1, -1).getDate();
            for (let i = 1; i <= lastDate; i++) {
                const dt = new Date(year, month, i);
                const nth = Math.ceil(dt.getDate() / 7);
                if (weekDayObj[nth] === undefined) {
                    weekDayObj[nth] = {};
                }
                weekDayObj[nth][dt.getDay()] = dt.getDate();
            }
            for (const weekDay of weekDayList) {

                const date = weekDayObj[weekDay[0]][weekDay[1]];
                if (
                    year === currentTime.currentYear
                    && month === currentTime.currentMonth
                    && date < currentTime.currentDate
                ) continue;
                resultDate = {
                    year: year,
                    month: month,
                    date: date
                };
                if (resultDate !== null) break;
            }
            if (resultDate !== null) break;
        }
        if (resultDate !== null) break;
    }
}
console.log(resultDate);
