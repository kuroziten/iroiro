import requests
import urllib.parse
user_icon = "bear"
user_name = "駆け抜ける熊(偽物)"
room_id = "3762bf77fb8249d3d9b69f6bcda036d4"
session = requests.session()
session.cookies.set("profile", urllib.parse.quote(user_name) + ":" + user_icon + ":ja-JP:ziten")
req = session.get("https://drrrkari.com")
header = {'User-Agent':'w3m'}
info = {
    "login":"login",
    "id":room_id,
}
req = session.post("https://drrrkari.com/room/", data=info, headers=header)
req = session.post("https://drrrkari.com/ajax.php")
