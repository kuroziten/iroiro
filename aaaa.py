## 【時報】
def job():
    global session
    t_delta = datetime.timedelta(hours=9)
    JST = datetime.timezone(t_delta, 'JST')
    now = datetime.datetime.now(JST)
    d = now.strftime('%H:%M')
    session.post("https://drrrkari.com/room/?ajax=1#", data={"message":d,"valid":1})
    login(False)

# メイン処理 ################################################################################################################################
schedule.every().hour.at(":00").do(job)
schedule.every().hour.at(":20").do(job)
schedule.every().hour.at(":40").do(job)

login(True)
while True:
    try:
        time.sleep(1)
        schedule.run_pending()

