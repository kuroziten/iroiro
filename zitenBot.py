import requests
from bs4 import BeautifulSoup
import html
import time
import urllib.request
import random
import schedule
import datetime
import imghdr

# 【そのURLがあるかどうかを調べる関数】
def UrlChecker(urlname00):
    try:
        res = urllib.request.urlopen(urlname00)
        un=res.geturl()
        res.close()
        if un == urlname00:
            imagedata = None
            with urllib.request.urlopen(urlname00) as fp:
                imagedata = fp.read()
            imagetype = imghdr.what(None, h=imagedata)
            if imagetype != None:
                return 1
            else:
                return 0
        else:
            return 0
        pass
    except:
        return 0
        pass

id_bk = None
firstFlg = True
# 直前のパス
path_bk = None

session = None

## 【ログイン処理】
def login():
    global session
    session = requests.session()
    req = session.get("https://drrrkari.com/#")

    ## ログイン
    soup = BeautifulSoup(req.text, 'html.parser')
    token = soup.find('input', attrs={'name':'token'}).get('value')
    cookie = req.cookies
    info = {
        "language":"jp-JP",
        "icon":"bm",
        "name":"ぼっと",
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
        "id":"1a7d48f5c257ea014c30c8ad74ee999f",
    }
    res = session.post("https://drrrkari.com/room/", data=info, cookies=cookie, headers=header)

login()

## 【時報】
def job():
    global session
    session.post("https://drrrkari.com/room/?ajax=1#", data={"message":datetime.datetime.now(),"valid":1})
    login()
schedule.every().hour.at(":00").do(job)
schedule.every().hour.at(":15").do(job)
schedule.every().hour.at(":30").do(job)
schedule.every().hour.at(":45").do(job)

while True:
    try:
        res = session.post("https://drrrkari.com/room/")
        soup = BeautifulSoup(res.text, 'html.parser')
        talks = soup.find_all(attrs={'class':'talk'})
        talk_bk = None
        for talk in talks:
            if firstFlg:
                # print(talk["id"])
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
                            t = talk.find(attrs={'class':'body'}).text
                            if "/room " == t[0:6]:
                                session.post("https://drrrkari.com/room/?ajax=1", data={
                                    "room_name":t[6:len(t)]
                                })
                                session.post("https://drrrkari.com/room/?ajax=1#", data={"message":"部屋名を変更しました：" + t[6:len(t)],"valid":1})
                                login()
                            elif "/url" == t:
                                session.post("https://drrrkari.com/room/?ajax=1#", data={"message":"直前の画像URL：" + path_bk,"valid":1})
                            elif "/remove http" == t[0:12]:
                                path = t[ t.find(" http") + 1 : len(t)]
                                print("削除します " + path)
                                session.post(
                                    "https://naughty-davinci.153-122-198-71.plesk.page/d/commandDel", 
                                    data={
                                        "path": path.strip()
                                    }
                                )
                                session.post("https://drrrkari.com/room/?ajax=1#", data={"message":"削除しました：" + path,"valid":1})

                            elif "/img " == t[0:5]:
                                if UrlChecker(t[5:len(t)]):
                                    file = {
                                        'img_path': urllib.request.urlopen(t[5:len(t)])
                                    }
                                    info = {
                                        "upimg":"アップロード" 
                                    }
                                    session.post("https://drrrkari.com/room/", data=info, files=file)
                                    login()
                            elif "/help" == t:
                                print("ヘルプ送信します")
                                res = session.post("https://drrrkari.com/room/?ajax=1#", data={"message":"[/help] [/img 画像URL] [/登録したい名前 登録したい画像URL]","valid":1})
                                print("ヘルプ送信完了！")
                                login()
                            else:
                                t = talk.find(attrs={'class':'body'}).text
                                if t[0:5] != "/img " and t[0:1] == "/" and " http" in t:
                                    # print("登録コマンドが行われたっぽい")
                                    command = t[ 0 : t.find(" ") ]
                                    path = t[ t.find(" http") + 1 : len(t)]
                                    if UrlChecker(path):
                                        print("登録します " + command + ":")
                                        session.post(
                                            "https://naughty-davinci.153-122-198-71.plesk.page/d/commandPost", 
                                            data={
                                                "command": command.strip(),
                                                "path": path.strip()
                                            }
                                        )
                                    else:
                                        print("エラー２します")
                                        session.post("https://drrrkari.com/room/?ajax=1#", data={"message" : "この画像は登録できません","valid":1})
                                        print("エラー２完了！")
                                        login()
                                elif t[0:1] == "/" and not " " in t:
                                    # print("画像送信開始：" + datetime.datetime.now())
                                    print("送信処理：「" + t.strip() + "」")
                                    req = session.post(
                                        "https://naughty-davinci.153-122-198-71.plesk.page/d/commandGet",
                                        data={
                                            "command": t.strip()
                                        }
                                    )
                                    print("送信処理：「" + req.text + "」")
                                    if req.text != "":
                                        print("送信処理：「空チェッククリア」")
                                        if UrlChecker(req.text):
                                            print("送信処理：「有効チェッククリア」")
                                            file = {
                                                'img_path': urllib.request.urlopen(req.text)
                                            }
                                            res = session.post("https://drrrkari.com/room/", data={"upimg":"アップロード"}, files=file)
                                            path_bk = req.text
                                            print("送信処理完了")
                                            login()
                                        else:
                                            print("エラー３します")
                                            session.post("https://drrrkari.com/room/?ajax=1#", data={"message" : "無効URL：" + req.text,"valid":1})
                                            print("エラー３完了！")
                                            login()

                                    else:
                                        print("エラー１します")
                                        session.post("https://drrrkari.com/room/?ajax=1#", data={"message" : "画像が登録されていません","valid":1})
                                        print("エラー１完了！")
                                        login()
                                elif t[0:1] == "/" and t[len(t)-4:len(t)] == " all":
                                    command = t[ 0 : t.find(" ") ]
                                    req = session.post(
                                        "https://naughty-davinci.153-122-198-71.plesk.page/d/commandGetAll",
                                        data={
                                            "command": command
                                        }
                                    )
                                    t = req.text
                                    output=eval(t)
                                    for o in output:
                                        if UrlChecker(o):
                                            file = {
                                                'img_path': urllib.request.urlopen(o)
                                            }
                                            session.post("https://drrrkari.com/room/", data={"upimg":"アップロード"}, files=file)
                                            path_bk = o
                                            time.sleep(.5)
                                            login()
                                elif t[0:1] == "/" and t[len(t)-6:len(t)] == " count":
                                    command = t[ 0 : t.find(" ") ]
                                    req = session.post(
                                        "https://naughty-davinci.153-122-198-71.plesk.page/d/commandGetCount",
                                        data={
                                            "command": command
                                        }
                                    )
                                    t = req.text
                                    session.post("https://drrrkari.com/room/?ajax=1#", data={"message" : command + " は " + t + " 件登録されています。","valid":1})
                        elif talk.find("a") != None:
                            print("画像")
                        else:
                            t = talk.text
                            t = t[0:len(t) - 9]
                            t = t[3:len(t)]
                            if "入室" in talk.text[len(talk.text) - 9:len(talk.text)]:
                                session.post("https://drrrkari.com/room/?ajax=1#", data={"message":t + "さんようこそ！","valid":1})
                                login()
                talk_bk = talk
        schedule.run_pending()
        time.sleep(1)
    except Exception as e:
        login()
