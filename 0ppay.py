# 年齢
age = 17

# 会員かどうか
iput_member = True

# 鑑賞回数
count = 20

# 値段
prime = 0

# 年齢制限
r18 = True
r15 = True

# 通貨
pay = "bucks"

# 映画の料金(16歳未満、18歳未満、60歳未満、60歳以上)
moviePrime = [500, 1000, 2500, 1000]
if pay == "yen":
    moviePrime = [500, 1000, 2500, 1000]
elif pay == "bucks":
    moviePrime = [5, 10, 25, 10]


if r18 and age < 18:
    prime = "18歳未満はこの映画を見ることが出来ません"
elif r15 and age < 15:
    prime = "15歳未満はこの映画を見ることが出来ません"
elif age < 3:
    prime = 0
else :
    if age < 16:
        prime = moviePrime[0]
    else:
        if age < 18:
            prime = moviePrime[1]
        elif age < 60:
            prime = moviePrime[2]
        else:
            prime = moviePrime[3]
        
        if iput_member and count == 5:
            prime = moviePrime[1]

        if iput_member:
            prime -= 300

        if count % 10 == 0:
            prime -= 500

print(prime)
