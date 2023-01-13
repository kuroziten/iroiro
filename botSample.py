import requests
from bs4 import BeautifulSoup
import html
import time
import urllib.request
import random
import datetime

session = None
userIcon = "bm"
userName = "どうさかくにん"
roomId = "1a7d48f5c257ea014c30c8ad74ee999f"

## 【ログイン処理】
def login():
    global session
    global userIcon
    global userName
    global roomId
    session = requests.session()
    req = session.get("https://drrrkari.com/#")

    ## ログイン
    soup = BeautifulSoup(req.text, 'html.parser')
    token = soup.find('input', attrs={'name':'token'}).get('value')
    cookie = req.cookies
    info = {
        "language":"jp-JP",
        "icon":userIcon,
        "name":userName,
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
        "id":roomId,
    }
    res = session.post("https://drrrkari.com/room/", data=info, cookies=cookie, headers=header)

login()

id_bk = None
firstFlg = True

while True:
    res = session.post("https://drrrkari.com/room/")
    soup = BeautifulSoup(res.text, 'html.parser')
    talks = soup.find_all(attrs={'class':'talk'})
    talk_bk = None
    for talk in talks:
        if firstFlg:
            firstFlg = False
            id_bk = talk["id"]
            break
        else:
            if id_bk == talk["id"]:
                if talk_bk == None:
                    break
                else:
                    talk = talk_bk
                    id_bk = talk["id"]
                    if talk.find(attrs={'class':'body'}) != None:
                        text = talk.find(attrs={'class':'body'}).text
                        if text == "面白いこと言って":
                            session.post("https://drrrkari.com/room/?ajax=1#", data={"message":"おっぱい！","valid":1})
                    elif talk.find("a") == None:
                        text = talk.text
                        t = text
                        t = t[0:len(t) - 9]
                        t = t[3:len(t)]
                        if "入室" in talk.text[len(text) - 9:len(text)]:
                            session.post("https://drrrkari.com/room/?ajax=1#", data={"message":t + "さんようこそ！","valid":1})
                            time.sleep(5)
            talk_bk = talk
