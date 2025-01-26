// 変更を監視するノードを選択
const targetNode = document.querySelector("#talks");

// (変更を監視する) オブザーバーのオプション
const config = { attributes: true, childList: true, subtree: true };

// 変更が発見されたときに実行されるコールバック関数
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
		if (mutation.target.id === "talks") {
			mutation.target.querySelectorAll(".system").forEach(e => e.remove());
		}
  }
};

// コールバック関数に結びつけられたオブザーバーのインスタンスを生成
const observer = new MutationObserver(callback);

// 対象ノードの設定された変更の監視を開始
observer.observe(targetNode, config);
