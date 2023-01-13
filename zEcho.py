import requests
from bs4 import BeautifulSoup
import html
import time

# 設定項目
user_name = "黒護辞典エコー"
icon = "bm"
room_id = "4c8d323fdd22a89172d220ca453f66e5"

session = None
currentId = None

## 【ログイン処理】
def login():
    global session
    global user_name
    global currentId
    session = requests.session()
    req = session.get("https://drrrkari.com/#")

    ## ログイン
    soup = BeautifulSoup(req.text, 'html.parser')
    token = soup.find('input', attrs={'name':'token'}).get('value')
    cookie = req.cookies
    info = {
        "language":"jp-JP",
        "icon":icon,
        "name":user_name,
        "login":"login",
        "token":token
    }
    header = {
        'User-Agent':'w3m'
    }
    res = session.post("https://drrrkari.com/#", data=info, cookies=cookie, headers=header)

    ## 入室
    info = {
        "login":"login",
        "id":"4c8d323fdd22a89172d220ca453f66e5",
    }
    res = session.post("https://drrrkari.com/room/", data=info, cookies=cookie, headers=header)

    ## 最新id取得
    res = session.post("https://drrrkari.com/ajax.php")
    talks = res.json().get("talks")
    currentId = None
    for talk in talks:
        currentId = talk.get("id")

## メイン処理 ##
def main(talk):
    id = talk.get("id")
    type = talk.get("type")
    uid = talk.get("uid")
    encip = talk.get("encip")
    name = talk.get("name")
    message = talk.get("message")
    icon = talk.get("icon")
    time = talk.get("time")

    cmd = "#echo "
    if message[0:len(cmd)] == cmd:
        echo_message = message[len(cmd):len(message)]
        session.post("https://drrrkari.com/room/?ajax=1#", data={"message" : echo_message, "valid" : 1})

while True:
    time.sleep(1)
    try:
        res = session.post("https://drrrkari.com/ajax.php")
        talks = res.json().get("talks")
        hitFlg = 0
        for talk in talks:
            id = talk.get("id")
            if id == currentId:
                hitFlg = True
            elif hitFlg:
                currentId = id
                main(talk)
                break
        if not hitFlg:
            login()
    except Exception as e:
        login()
