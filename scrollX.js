const smoothScroll = (element, target, duration) => {
	// スクロール開始時点の位置
	const start = element.scrollLeft;
	// スクロール距離と時間を計算
	const distance = element.scrollLeft + target - start;
	const startTime = performance.now();
	// スクロール関数
	const scroll = timestamp => {
		const elapsed = timestamp - startTime;
		const easing = easeInOutQuad(Math.min(elapsed / duration, 1));
		element.scrollLeft = start + distance * easing;
		if (elapsed < duration) window.requestAnimationFrame(scroll);
		else console.log("スクロールが完了しました");
	};
	// イージング関数
	const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	// スクロール開始
	window.requestAnimationFrame(scroll);
};
