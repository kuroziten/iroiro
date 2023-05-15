"""
まるばつげーむのやつ
"""
# ■■　メイン関数　■■
def main():
    tt = TicTacToe()
    player = 1
    for i in range(9):
        tt.display()
        tt.input(player)
        comp = tt.compCheck(player)
        if comp:
            break
        player *= -1
    tt.display()
    if comp:
        print(f"■■{tt.mark[player]}の勝ち！■■")
    else:
        print("■■　引き分けです！　■■")
    input("終了します！")

class TicTacToe:
    def __init__(self):
        self.board = [[0,0,0],[0,0,0],[0,0,0]]
        self.mark = {1:"◯", 0:"　",-1:"Ｘ"}
    
    def input(self, player):
        while True:
            print("¥n" + self.mark[player] + "の番")
            xy = self.comInput()
            if self.board[xy[1]][xy[0]] == 0:
                self.board[xy[1]][xy[0]] = player
                break
            print("既に埋まっているセルです。")

    def comInput(self):
        x, y = -1, -1
        while y < 0 or y > 2:
            try:
                y = int(input("行(0〜2)："))
            except:
                print("入力値が無効")
        while x < 0 or x > 2:
            try:
                x = int(input("列(0〜2)："))
            except:
                print("入力値が無効")
        return[x,y]
    
    # ■■　ゲームフィールドを表示するメソッド　■■
    def display(self):
        print("行列 0　1　2") # 見出し行
        self.dispSub(0) # 0行目の表示
        print("　　　ー＋ー＋ー") # 0行目と1行目の区切り
        self.dispSub(1) # 1行目の表示
        print("　　　ー＋ー＋ー") # 1行目と2行目の区切り
        self.dispSub(2) # 1行目の表示

    # ■■　駒を億行の表示メソッド　■■
    def dispSub(self, y):
        print(str(y) + "　　" + self.mark[self.board[y][0]] + "｜"
            + self.mark[self.board[y][1]] + "｜" + self.mark[self.board[y][2]])

    ## ここに処理を書く
    def compCheck(self, player):
        return True

if __name__ == "__main__":
    main()
