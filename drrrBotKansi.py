import os
import time
import subprocess
import urllib.parse
import requests
from bs4 import BeautifulSoup

BASE_DIR = "/var/www/vhosts/sub0000550078.hmk-temp.com/kirihiro.com"
ROOM_ID_FILE = BASE_DIR + "/drrrBot/drrrBotRoomId.txt"

USER_NAME = "centBK"
USER_ICON = "bm"
ROOM_ID = ""

session = None


def is_bot_running():
  result = subprocess.run(
    "ps aux | grep drrrBot.py | grep -v grep",
    shell=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    universal_newlines=True
  )

  return "python3 /var/www/vhosts/sub0000550078.hmk-temp.com/kirihiro.com/drrrBot/drrrBot.py" in result.stdout


def login():

  session = requests.Session()

  profile = (
    urllib.parse.quote(USER_NAME)
    + ":"
    + USER_ICON
    + ":ja-JP:ziten"
  )

  session.cookies.set("profile", profile)

  res = session.get("https://drrrkari.com")
  res.encoding = "utf-8"

  print(res.text)

  return session

def login2():
  session = requests.Session()

  res = session.get("https://drrrkari.com")
  res.encoding = "utf-8"

  soup = BeautifulSoup(res.text, "html.parser")
  token = soup.select_one("[name='token']")["value"]

  headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded",
    "Sec-GPC": "1",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Priority": "u=0, i",
    "Referer": "https://drrrkari.com/"
  }

  data = {
      "language": "ja-JP",
      "icon": "girl",
      "name": "",
      "login": "login",
      "token": token
  }

  res = session.post(
      "https://drrrkari.com/",
      headers=headers,
      data=data
  )

  res.encoding = "utf-8"

  soup = BeautifulSoup(res.text, "html.parser")
  rooms = soup.select(".rooms")

  for room in rooms:
    name_elem = room.select_one(".name")

    if not name_elem:
      continue

    if name_elem.text.strip() == "憩いの場":


      input_elem = room.select_one("input")

      if input_elem:
        save_room_id(input_elem.get("value"))
        start_bot()
        print("bot起動しました")
        return

  session.close()

def create_room(session):
  headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded"
  }

  data = {
    "name": "憩いの場",
    "type": "zatsu",
    "limit": "15",
    "knock": "0",
    "password": "",
    "image": "1",
    "language": "ja-JP",
    "submit": "submit"
  }

  session.post(
    "https://drrrkari.com/create_room/",
    headers=headers,
    data=data
  )

def save_room_id(room_id):
  with open(ROOM_ID_FILE, "w", encoding="utf-8") as f:
    f.write(room_id)


def start_bot():
  cmd = (
    "nohup python3 "
    "/var/www/vhosts/sub0000550078.hmk-temp.com/"
    "kirihiro.com/drrrBot/drrrBot.py "
    "> drrr.log 2>&1 &"
  )

  subprocess.run(cmd, shell=True)


# 作業ディレクトリを移動
os.chdir(BASE_DIR)

while True:

  # drrrBot.py が起動していない場合のみ処理を実行
  if not is_bot_running():
    print("bot起動してないので起動")

    # # 部屋作成用にログイン
    s = login()

    # # 「憩いの場」を作成
    create_room(s)

    s.close()

    login2()
  else:
    print("bot起動中")

  time.sleep(60)
