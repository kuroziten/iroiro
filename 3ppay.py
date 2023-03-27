# 画像生成AIの処理
def imgCreate(message, cmd):
    global gradio_path
    print("--------------------------------------------------------------------------------------------------------------------------------")
    prpt = message[len(cmd) : len(message)]
    print("画像生成開始:" + prpt)
    imgCreateSession = requests.session()
    req = imgCreateSession.get(gradio_path)
    i = randomname(11)
    task = "task(" + randomname(15) + ")"
    req = imgCreateSession.post(
        gradio_path + "run/predict/",
        headers = {
            "Content-Type": "application/json"
        },
        data = json.dumps(
            {
                "data": [],
                "fn_index": "191",
                "session_hash": i
            }
        )
    )
    # print("第一リクエストクリア")
    req = imgCreateSession.post(
        gradio_path + "run/predict/",
        headers = {
            "Content-Type": "application/json"
        },
        data = json.dumps(
            {
                "data": [],
                "fn_index": "199",
                "session_hash": i
            }
        )
    )
    # print("第二リクエストクリア")
    req = imgCreateSession.post(
        gradio_path + "run/predict/",
        headers = {
            "Content-Type": "application/json"
        },
        data = json.dumps(
            {
                "data": [],
                "fn_index": "204",
                "session_hash": i
            }
        )
    )
    # print("第三リクエストクリア")
    req = imgCreateSession.post(
        gradio_path + "run/predict/",
        headers = {
            "Content-Type": "application/json"
        },
        data = json.dumps(
            {
                "data": [
                    task,
                    prpt,
                    "",
                    [],
                    20,
                    "Euler a",
                    False,
                    False,
                    1,
                    1,
                    7,
                    -1,
                    -1,
                    0,
                    0,
                    0,
                    False,
                    512,
                    512,
                    False,
                    0.7,
                    2,
                    "Latent",
                    0,
                    0,
                    0,
                    [],
                    "None",
                    False,
                    False,
                    "positive",
                    "comma",
                    0,
                    False,
                    False,
                    "",
                    "Seed",
                    "",
                    "Nothing",
                    "",
                    "Nothing",
                    "",
                    True,
                    False,
                    False,
                    False,
                    0,
                    [],
                    "",
                    "",
                    ""
                ],
                "fn_index": "76",
                "session_hash": i
            }
        )
    )
    # print("第四リクエストクリア")
    # print(req.text)
    data = req.json().get("data")
    url = None
    for d in data:
        for d2 in d:
            url = gradio_path + "file=" + d2.get("name")
        break
    print(url)
    imgPost(url)
