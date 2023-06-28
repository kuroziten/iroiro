import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

session = requests.session()
url = "https://pbs.twimg.com/media/FifnJb6aAAM3gBG?format=jpg"
response = requests.get(url)
img = Image.open(BytesIO(response.content))

# WebP画像をPNGに変換
if img.format == 'WEBP':
    img = img.convert('RGBA')
    buffer = BytesIO()
    img.save(buffer, 'PNG', optimize=True)
    buffer.seek(0)
else:
    buffer = BytesIO(response.content)
file = {
    'img_path': ('image.png', buffer)
}
info = {
    "upimg":"アップロード"
}
session.post("https://drrrkari.com/room/", data=info, files=file)
