process.stdin.resume();
process.stdin.setEncoding('utf8');
// 自分の得意な言語で
// Let's チャレンジ！！
var lines = [];
var reader = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
reader.on('line', (line) => {
	lines.push(line);
});
reader.on('close', () => {
	const size = lines[0];
	const tb = [];
	for (let i = 1; i <= size; i++) {
		tb.push(String(lines[i]).split(""));
	}
	const getVal = (r, c) => {
		return tb[r][c];
	};
	let maxCount = 0;
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const v = Number(getVal(r, c));
			let count;
			let isPlus;
			let isPlusStartFlg;
			let i;
			// 右
			  let oneHoukou = () => {
			      count = 0;
			      isPlusStartFlg = true;
			      isPlus = false;
			      i = 1;
			      for (let cc = c + 1; cc < size; cc++) {
			          const targetVal = Number(getVal(r, cc));
			          if (isPlusStartFlg) {
			              isPlusStartFlg = false;
			              if (targetVal != v-1 && targetVal != v+1) {
			                  break;
			              } else if (targetVal == v + 1) {
			                  isPlus = true;
			              } else {
			                  isPlus = false;
			              }
			              count++;
			              i++;
			          } else {
			              if (targetVal != v + (isPlus ? i : -i)) {
			                  break;
			              }
			              count++;
			              i++;
			          }
			      }
			      if (maxCount < count) maxCount = count;
			  };
			  oneHoukou();
			  // 下
			  let oneHoukou2 = () => {
			      count = 0;
			      isPlusStartFlg = true;
			      isPlus = false;
			      i = 1;
			      for (let rr = r + 1; rr < size; rr++) {
			          const targetVal = Number(getVal(rr, c));
			          if (isPlusStartFlg) {
			              isPlusStartFlg = false;
			              if (targetVal-1 != v && targetVal+1 != v) {
			                  break;
			              } else if (targetVal == v + 1) {
			                  isPlus = true;
			              } else {
			                  isPlus = false;
			              }
			              count++;
			              i++;
			          } else {
			              if (targetVal != Number(v) + Number(isPlus ? i : -i)) {
			                  break;
			              }
			              count++;
			              i++;
			          }
			      }
			      if (maxCount < count) maxCount = count;
			  };
   
			// 右下
			let rr;
			let cc;

            //  右下
			rr = r + 1;
			cc = c + 1;
			count = 0;
			isPlusStartFlg = true;
			isPlus = false;
			i = 1;
			while (rr < size && cc < size) {
				const targetVal = Number(getVal(rr, cc));
				if (isPlusStartFlg) {
					isPlusStartFlg = false;
					if (targetVal != v - 1 && targetVal != v + 1) {
						break;
					} else if (targetVal == v + 1) {
						isPlus = true;
					} else {
						isPlus = false;
					}
					count++;
					i++;
				} else {
					if (targetVal != Number(v) + Number(isPlus ? i : -i)) {
						break;
					}
					count++;
					i++;
				}
				rr++;
				cc++;
			}
			if (maxCount < count) maxCount = count;
			
			// 左下
			rr = r + 1;
			cc = c - 1;
			count = 0;
			isPlusStartFlg = true;
			isPlus = false;
			i = 1;
			while (rr < size && cc >= 0) {
				const targetVal = Number(getVal(rr, cc));
				if (isPlusStartFlg) {
					isPlusStartFlg = false;
					if (targetVal != v - 1 && targetVal != v + 1) {
						break;
					} else if (targetVal == v + 1) {
						isPlus = true;
					} else {
						isPlus = false;
					}
					count++;
					i++;
				} else {
					if (targetVal != Number(v) + Number(isPlus ? i : -i)) {
						break;
					}
					count++;
					i++;
				}
				rr++;
				cc--;
			}
			if (maxCount < count) maxCount = count;
			

			
			// 右
			// 右下
			// 下
			// 左下
			// 左
			// 左上
			// 上
			// 右上
		}
	}
	console.log(maxCount + 1);
});
