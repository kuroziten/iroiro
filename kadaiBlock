list = [
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
];

lastR = 3;
lastC = 3;
blockR = 2;
blockC = 2;

for (r = 0; r < lastR; r += blockR) {
	for (c = 0; c < lastC; c += blockC) {
		console.log(list.slice(r, r + blockR).map(e => e.slice(c, c + blockC)));
	}
}
