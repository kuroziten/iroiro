let s = "";
const diffTime = (t1, diffType, t2) => 
    diffType == ">" ? new Date(`2000-01-01T${t1}:00`) > new Date(`2000-01-01T${t2}:00`)
    : diffType == ">=" ? new Date(`2000-01-01T${t1}:00`) >= new Date(`2000-01-01T${t2}:00`)
    : diffType == "<" ? new Date(`2000-01-01T${t1}:00`) < new Date(`2000-01-01T${t2}:00`)
    : diffType == "<=" ? new Date(`2000-01-01T${t1}:00`) <= new Date(`2000-01-01T${t2}:00`)
    : undefined
    ;
document.querySelectorAll(".start").forEach(e => {
    if (diffTime(e.textContent, ">=", "19:00")) {
        s += e.closest('.schedule-body-section-item').querySelector('.schedule-body-title').textContent + "\n\t" + e.textContent + "\n";
    }
});
console.log(s);
