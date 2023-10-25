

const 条件 = (リンゴ, キウイ, モモ) => {
	if (リンゴ > 0 && キウイ > 0 && モモ > 0 && キウイ < リンゴ) {
		console.log("正しい！");
		return true;
	} else {
		console.log("間違っている！");
		return false;
	}
};

let リンゴ, キウイ, モモ, j;

// 推論ア
console.log("推論ア");
モモ = 2;
j = 0;
for (let i = 1; i <= 9 - モモ; i++) {
	キウイ = i;
	リンゴ = 9 - モモ - キウイ;
	console.log("モモ", モモ, "キウイ", キウイ, "リンゴ", リンゴ);
	if (条件(リンゴ, キウイ, モモ)) j++;
}
console.log("正解パターン", j);

// 推論イ
console.log("推論イ");
モモ = 4;
j = 0;
for (let i = 1; i <= 9 - モモ; i++) {
	キウイ = i;
	リンゴ = 9 - モモ - キウイ;
	console.log("モモ", モモ, "キウイ", キウイ, "リンゴ", リンゴ);
	if (条件(リンゴ, キウイ, モモ)) j++;
}
console.log("正解パターン", j);

// 推論ウ
console.log("推論ウ");
モモ = 5;
j = 0;
for (let i = 1; i <= 9 - モモ; i++) {
	キウイ = i;
	リンゴ = 9 - モモ - キウイ;
	console.log("モモ", モモ, "キウイ", キウイ, "リンゴ", リンゴ);
	if (条件(リンゴ, キウイ, モモ)) j++;
}
console.log("正解パターン", j);
