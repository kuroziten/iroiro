/* 大きさ */
const column = 3;
/* 処理で使用する配列 */
const list = [];
/* スペースを入れる関数 */
const sRep = n => " ".repeat(n);
/* 行作成関数 */
const createRow = i => `${sRep(i)}*${sRep((column - (i ? i : -1) - 1))}${i + 1 == column ? "" : "*"}`;
/* ループ */
for (let i = 0; i < column; i++) {
	/* 行追加処理 */
	if (list.length) list.unshift(createRow(i));
	list.push(createRow(i));
}
/* 文字列作成処理 */
let str = "";
list.forEach(s => str+=s+"\n");
/* 出力 */
console.log(str);

