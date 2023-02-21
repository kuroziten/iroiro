
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var debug = require('./Ls52e_debug').debug;
app.set("view engine", "ejs");
const cors = require('cors');
app.use(cors());//CROS許可
const fs = require('fs');

const multer = require('multer')
app.use(multer().none())

const body_parser = require('body-parser') ;
app.use(body_parser());
// Ajaxのやつ
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

app.all("/", (req, res, next) => {
    debug("だれかがhttp接続")
    res.render("chat_view");
})
app.all("/hb", (req, res) => {
    res.send("7082");
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.all("/hb/cc", (req,res) => {
    res.send(req.cookies.ans);
})

app.all("/hb/ansSet", (req, res) => {
    const rnd = () => Math.floor(Math.random() * 10);
    let ans = "";
    while (ans.length < 4) {
        const r = rnd();
        if (!ans.includes(r)) ans = `${ans}${r}`;
    }
    res.send(ans);
})

app.all("/f", (req, res) => {
    const ans = (String(req.body.ans)).split("");
    const inp = (String(req.body.inp));

    let hcount = 0;
    let bcount = 0;
    let flgList = [0,0,0,0];
    for (t of inp.split("")) {
        let countUpFlg = false;
        for (i = 0; i < 4; i++) {
            a = ans[i]
            if (!countUpFlg && t == a) {
                bcount++;
                countUpFlg = true;
                if (!flgList[i]) {
                    flgList[i] = true;
                    break;
                };
            } else if (t == a) {
                if (!flgList[i]) {
                    flgList[i] = true;
                    break;
                };
            }
        }
    }
    for (i = 0; i < 4; i++) {
        a = ans[i]
        t = inp.split("")[i];
        flg = flgList[i];
        if (a == t) {
            hcount++;
            if (flg) {
                bcount--;
            }
        }
    }
    res.send(`H:${hcount}, B:${bcount} :: ${inp}`);
});

io.on('connection', function(socket){
    debug("だれかがソケット接続" + socket)
    socket.on('chat', function(msg){
        debug("だれかがチャット接続")
        io.emit('chat', msg);
    });
});
server.listen(3000);
