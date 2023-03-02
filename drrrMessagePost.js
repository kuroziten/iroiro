// 送信するメッセージ
const message = `おっぱいぺろぺろにゃり`

// メッセージ送信処理
fetch(
    "?ajax=1#",
    {
        method: 'POST', 
        body: setFormData({
            message: message,
            valid: 1
        })
    }
);

// FormData作成関数
function setFormData(hash) {
    const body = new FormData();
    for (let key in hash) body.append(key, hash[key]);
    return body;
}
