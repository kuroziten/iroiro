/* ↓ここはChatGPTに書かせた↓ */
function toKatakana(input) {
  var result = '';
  for (var i = 0; i < input.length; i++) {
    var code = input.charCodeAt(i);
    if (code >= 0x3041 && code <= 0x3096) {
      result += String.fromCharCode(code + 0x60);
    } else {
      result += input[i];
    };
  };
  return result;
};

function convertToKatakana(input) {
  return toKatakana(input);
};
/* ↑ここはChatGPTに書かせた↑ */

trList = Array.from(document.querySelectorAll("tr"));
trList = trList.filter(e => e.querySelector("td > b")?.textContent === "【大好物】");
obj = {};
for (const tr of trList) {
    const name = tr.querySelector("a").textContent;
    const tmp =
        tr
        .querySelectorAll("td")[1]
        .textContent.replace(/\s+/g, ",")
        .replace("【大好物】", "")
        .replace(/,,/g, ",")
        .split("【好物】")
        .map(e => e.replace(/(^,|,$)/g, "").split(","));
  tmp.unshift(name);
    obj[convertToKatakana(name)] = tmp;
};
(() => {
  let sName = prompt();
  if (!sName) return;
  sName = convertToKatakana(sName);
  o = obj[sName];
    if (!o) return;
  alert(
    o[0] + "\n" + "\n"
    + "【大好物】" + "\n"
    + o[1].join("\n") + "\n" + "\n"
    + "【好物】" + "\n"
    + o[2].join("\n")
  );
})();
