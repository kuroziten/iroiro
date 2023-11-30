
/* listの中身を出力するコード */
// 対象のリスト
const list = [1, 2, 3, 4, 5];
// リストを {インデックス番号, {indexNumber: インデックス番号, value: 値, flg: 出力済み状態}} のオブジェクトに変換
const obj = Object.fromEntries(list.map((v, i) => [i, {indexNumber: i, value: v, flg: false }]));
// オブジェクトのキー情報を取得
const keys = Object.keys(obj);
// オブジェクトの値情報を取得
const values = Object.values(obj);
// キー情報をループ
for (let key of keys) {
	// 値情報をループ
	for (let value of values) {
		// 出力済み状態がfalse(未出力)の場合
		if (value.flg == false) {
			// キーと値情報の値が一致する場合
			if (Number(key) == value.indexNumber) {
				// 値情報の値を出力
				console.log(value.value);
				// 出力済み状態をtrue(出力済み)に更新
				value.flg = true;
				// 値情報ループに戻る
				continue;
			}
		}
	}
}
