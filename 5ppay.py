import math

data = {
    "name": "",
    "points": {
        "国語": None,
        "算数": None,
        "社会": None,
        "理科": None,
        "英語": None,
        "保健体育": None
    }
}
dataList = []

def pointInput(txt):
    point = input(txt)
    if point == "":
        print("数字を入力してください。")
        return pointInput(txt)
    try:
        return int(point)
    except ValueError:
        print("数字を入力してください。")
        return pointInput(txt)

def nameInput(txt):
    name = input(txt)
    if len(name.split()) == 2:
        return ' '.join(name.split())
    else:
        print("名字と名前の間にスペースを入力してください。")
        return nameInput(txt)

def addData() :
    global data
    global dataList
    dt = data.copy()
    dt["name"] = nameInput("フルネーム：")
    for key in dt["points"]:
        dt["points"][key] = pointInput(f'{key}の点数：')    
    dataList.append(dt)
    if input("データを追加しますか？[y/n]") == "y":
        addData()

addData()
for dt in dataList:
    points = []
    for key in dt["points"]:
        points.append(dt["points"].get(key))
    print(f'{dt["name"]}さんの点数')
    print(f'合計：{sum(points)}')
    print(f'平均：{math.ceil(sum(points) * 10) / 10}')
    print(f'最高：{max(points)}')
    print(f'最低：{min(points)}')
