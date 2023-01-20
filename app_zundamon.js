/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/

import { setTimeout } from "timers/promises";
import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import multer from "multer";
import bodyParser from "body-parser";
var app = express();
app.use(multer().none());
app.use(bodyParser.urlencoded({ extended: true }));
/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/

const m = multer({}).fields([{}]);
/* 3. 以後、アプリケーション固有の処理 */
app.all("", m, async function(req, res, next){

	console.log("わがらん");

	// 文字の整形
	var text = req.body.name == null || req.body.name == undefined || req.body.name == "" ? "ずんずんちゃ" : req.body.name; // TODO リクエストに差し替える

	if (text.indexOf('http') != -1) {
		text = "URL";
	}
	text = text.replace(/！/g, '!');
	text = text.replace(/？/g, '?');
	text = text.replace(/／/g, '/');
	text = text.replace(/'/g, "");
	text = text.replace(/"/g, "");
	text = text.replace(/’/g, "");
	text = text.replace(/”/g, "");
	text = text.replace(/;/g, "");
	text = text.replace(/\*/g, "");
	text = text.replace(/＊/g, "");
	text = text.replace(/\//g, "");

	while (text.indexOf('!!') != -1) {
		text = text.replace("!!","!");
	}

    var speaker = req.body.speaker == null || req.body.speaker == undefined || req.body.speaker == "" ? "3" : req.body.speaker; // TODO リクエストに差し替える
	var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var N=5
	var id = "stream" + (Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')) + ".wav";
	try {
		const response = await fetch(`http://0.0.0.0:50021/audio_query?text=${text}&speaker=${speaker}`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const query = await response.json();
		const sound_row = await fetch(`http://0.0.0.0:50021/synthesis?speaker=${speaker}&enable_interrogative_upspeak=true`, {
			method: "POST",
			headers: { 
				'Content-Type': 'application/json',
				'accept': 'audio/wav',
				'responseType': "stream"
			},
			body: JSON.stringify(query)
		});

		const dest = fs.createWriteStream(id);
		sound_row.body.pipe(dest);

		await existsSync(`${process.cwd()}/${id}`, id, res);

	} catch (error) {
		res.send(error);
	}
});
async function existsSync (path, id, res) {
	if( fs.existsSync(path) ){
		console.log("完了");
		res.send(id);
	}else{
		console.log(path);
		await setTimeout(100);
		console.log("うんこ");
		existsSync(path, id, res);
	}
}

app.all("/wav/:fileName", m, (req, res) => {
	res.sendFile(`${process.cwd()}/${req.params.fileName}`);
});

app.all("/TEST001", m, async function(req, res, next){
	res.send("TEST001da");
});

app.listen(3000);
