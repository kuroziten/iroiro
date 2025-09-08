漢字超大 = "万億兆";
漢字大 = "十百千";
漢字小 = "一二三四五六七八九十";
英数字 = 99999999;
英数字文字 = String(英数字);
四桁ごと = [];
四桁ごとSub = [];
len = 英数字文字.length - 1;
for (let i = len; i >= 0; i--) {
  四桁ごとSub.unshift(英数字文字[i]);
  if (四桁ごとSub.length == 4) {
    四桁ごと.unshift(四桁ごとSub);
    四桁ごとSub = [];
  }
}
if (四桁ごとSub.length > 0) {
  四桁ごと.unshift(四桁ごとSub);
  四桁ごとSub = [];
}
s = "";
for (let i = 0; i < 四桁ごと.length; i++) {
  四桁ごとSub = 四桁ごと[i];
  for (let j = 0; j < 四桁ごとSub.length; j++) {
    if (四桁ごとSub[j] != 0) {
      if (四桁ごとSub[j] != 1 || 四桁ごとSub.length - j == 1) {
          s += 漢字小[四桁ごとSub[j] - 1];
      }
      if (漢字大[四桁ごとSub.length - j - 2]) {
        s += 漢字大[四桁ごとSub.length - j - 2];
      }
    }
  }
  if (漢字超大[四桁ごと.length - i - 2]) {
    s += 漢字超大[四桁ごと.length - i - 2];
  }
}
console.log("result", s);
