(async () => {

    let db;
    const request = indexedDB.open("myDatabase", 1);

    await new Promise(r => {

        request.onupgradeneeded = () => {
            let db = request.result;
            if (!db.objectStoreNames.contains("myStore")) {
                /** テーブルの作成 **/
                /* NO */
                const store = db.createObjectStore("myStore", { keyPath: "NO" });
                const keys = ["NO", "TITLE", "ZONE", "YEAR", "MONTH", "DAY", "HOUR", "MINUTE"];
                keys.forEach(key => store.createIndex(key, key));
            }
        };

        request.onsuccess = () => {
            db = request.result;
            r();
        };

        request.onerror = () => {
            console.error("Error opening database", request.error);
            r();
        };
    });

    const getAllData = async () => {

        const list = [];
        return await new Promise(r => {
            const transaction = db.transaction("myStore", "readwrite");
            const store = transaction.objectStore("myStore");
            const request = store.openCursor();
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    list.push(cursor.value)
                    cursor.continue();
                } else {
                    r(list);
                }
            };
            request.onerror = () => {
                r(request.error);
            };
        });
    };

    const getCount = async () => {
        return await new Promise(r => {
            const transaction = db.transaction("myStore", "readwrite");
            const store = transaction.objectStore("myStore");
            const request = store.count();
            request.onsuccess = () => {
                r(request.result);
            };
            request.onerror = () => {
                r(request.error);
            };
        });
    };

    /* noを揃える */
    const ref = async () => {
        return await new Promise(r => {
            const transaction = db.transaction("myStore", "readwrite");
            const store = transaction.objectStore("myStore");
            const request = store.openCursor();
            let no = 0;
			const zoneChangeRowList = document.querySelector("#zoneChangeMain")?.querySelectorAll(".zoneChangeRow");
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
					if (zoneChangeRowList !== undefined) {
						zoneChangeRowList[no].querySelector(".zoneChangeDelete").value = no;                        
                    }
                    const updateData = cursor.value;
					if (updateData.NO !== no) {
                        cursor.delete();
						updateData.NO = no;
						store.add(updateData);						
                    }
                    no++;
					
                    cursor.continue();
                } else {
                    r(null);
                }
            };
            request.onerror = () => {
                r(request.error);
            };
        });
    };

	/* 削除する */
	const del = async no => {

        const result = await new Promise(async r => {


            const transaction = db.transaction("myStore", "readwrite");
            const store = transaction.objectStore("myStore");
			const request = store.delete(no);

            request.onsuccess = async () => {
                r(null);
            };
            request.onerror = () => {
				console.log("削除失敗", request.error);
                r(request.error);
            };

        });

        await ref();

		return result;

	};

	const add = async val => {
		return await new Promise(r => {
            const transaction = db.transaction("myStore", "readwrite");
            const store = transaction.objectStore("myStore");
            const request = store.add(val);
            request.onsuccess = async () => {
                r(null);
            }
            request.onerror = () => {
				console.log("削除失敗", request.error);
                r(request.error);
            };
        });
	};

	const put = async val => {
		return await new Promise(r => {
            const transaction = db.transaction("myStore", "readwrite");
            const store = transaction.objectStore("myStore");
            const request = store.put(val);
            request.onsuccess = async () => {
                r(null);
            }
            request.onerror = () => {
				console.log("削除失敗", request.error);
                r(request.error);
            };
        });
	};


    const zoneChangeRowHtml = (await getAllData(db))
        .map(e => `
		<div class="zoneChangeRow">
			<button class="zoneChangeDelete" value="${e.NO}">削除</button>
			<input type="text" class="zoneChangeZone" value="${e.ZONE}">
			<input type="text" class="zoneChangeTitle" value="${e.TITLE}">
			<input type="text" class="zoneChangeYear" value="${e.YEAR}">
			<input type="text" class="zoneChangeMonth" value="${e.MONTH}">
			<input type="text" class="zoneChangeDay" value="${e.DAY}">
			<input type="text" class="zoneChangeHour" value="${e.HOUR}">
			<input type="text" class="zoneChangeMinute" value="${e.MINUTE}">
			<span class="zoneChangeRes"></span>
		</div>
	`.replace(/(>[\s\n]*)/g, ">").replace(/([\s\n]*<)/g, "<"))
        .join("");

	let myZone = localStorage.getItem('myZone');
	if (myZone === null) {
		localStorage.setItem('myZone', '0900');
		myZone = '0900';
	}

    const zoneChangeMain = document.createElement("div");
    zoneChangeMain.innerHTML = `
		<button class="zoneChangeClose">閉じる</button>
		<input type="text" class="zoneChangeMyZone" value="${myZone}">
		${zoneChangeRowHtml}
		<button class="zoneChangeAdd">追加</button>
		<style>
			#zoneChangeMain * {
				font-size: 16px;
			}
			#zoneChangeMain input {
				width: 64px;
				color: black;
				margin: 0;
			}
			#zoneChangeMain button {
				color: black;
			}
			#zoneChangeMain .zoneChangeTitle {
				width: 256px;
			}
			#zoneChangeMain .zoneChangeMonth
			, #zoneChangeMain .zoneChangeDay
			, #zoneChangeMain .zoneChangeHour
			, #zoneChangeMain .zoneChangeMinute {
				width: 32px;
			}
		</style>
	`.replace(/(>[\s\n]*)/g, ">").replace(/([\s\n]*<)/g, "<");
    zoneChangeMain.style.position = "fixed";
    zoneChangeMain.style.inset = "0";
    zoneChangeMain.style.margin = "auto";
    zoneChangeMain.style.zIndex = "99999";
    zoneChangeMain.style.width = "90vw";
    zoneChangeMain.style.height = "90vh";
    zoneChangeMain.style.backgroundColor = "green";
    zoneChangeMain.id = "zoneChangeMain";

    document.body.append(zoneChangeMain);

	const dateWrite = e => {
		const parent = e.parentNode;
        const zoneChangeMyZone = document.querySelector(".zoneChangeMyZone").value;
        const myZoneHour = zoneChangeMyZone.substr(0, 2);
        const myZoneMinute = zoneChangeMyZone.substr(2, 2);

        const zoneChangeZone = parent.querySelector(".zoneChangeZone").value;
        const zoneHour = zoneChangeZone.substr(0, 2);
        const zoneMinute = zoneChangeZone.substr(2, 2);

        const zoneChangeYear = parent.querySelector(".zoneChangeYear").value;
        const zoneChangeMonth = parent.querySelector(".zoneChangeMonth").value;
        const zoneChangeDay = parent.querySelector(".zoneChangeDay").value;
        const zoneChangeHour = parent.querySelector(".zoneChangeHour").value;
        const zoneChangeMinute = parent.querySelector(".zoneChangeMinute").value;

        let diffHour = String(Number(myZoneHour) + (Number(myZoneHour) - Number(zoneHour))).padStart(2, "0");
        let diffMinute = String(Number(myZoneMinute) + (Number(myZoneMinute) - Number(zoneMinute))).padStart(2, "0");
		if (Number(diffMinute) < 0) {
			diffHour = String(Number(diffHour) - 1).padStart(2, "0");
			diffMinute = String(Number(diffMinute) + 60).padStart(2, "0");
		}

		const dtStr = `${zoneChangeYear}-${zoneChangeMonth}-${zoneChangeDay} ${zoneChangeHour}:${zoneChangeMinute} GMT+${diffHour}${diffMinute}`;
		let dtDate = new Date(dtStr);
        let dt = dtDate.toString();
		if (dt !== "Invalid Date") {
			dt = "";
			dt += dtDate.getFullYear();
			dt += "-";
			dt += String(dtDate.getMonth() + 1).padStart(2, "0");
			dt += "-";
			dt += String(dtDate.getDate()).padStart(2, "0");
			dt += " ";
			dt += String(dtDate.getHours()).padStart(2, "0");
			dt += ":";
			dt += String(dtDate.getMinutes()).padStart(2, "0");
			dt += "_";
			console.log(dtDate.toString());
			dt += dtDate.toString().split(" ").slice(-2).join(" ");
		}
        parent.querySelector(".zoneChangeRes").textContent = dt;
	};

	if (await getCount() === 0) {
        const zoneChangeRow = document.createElement("div");
        zoneChangeRow.className = "zoneChangeRow";
        zoneChangeRow.innerHTML = `
                <button class="zoneChangeDelete" value="">削除</button>
                <input type="text" class="zoneChangeZone" value="0900">
                <input type="text" class="zoneChangeTitle" value="スイカのちんぽ期限">
                <input type="text" class="zoneChangeYear" value="2024">
                <input type="text" class="zoneChangeMonth" value="11">
                <input type="text" class="zoneChangeDay" value="09">
                <input type="text" class="zoneChangeHour" value="18">
                <input type="text" class="zoneChangeMinute" value="30">
                <span class="zoneChangeRes"></span>
			`.replace(/(>[\s\n]*)/g, ">").replace(/([\s\n]*<)/g, "<");
		document.querySelector(".zoneChangeAdd").before(zoneChangeRow);
        await add({
            NO: await getCount()
            , ZONE: "0900"
            , TITLE: "スイカのちんぽ期限"
            , YEAR: "2024"
            , MONTH: "11"
            , DAY: "09"
            , HOUR: "18"
            , MINUTE: "30"
        });
        await ref();
	}
	
	document.querySelectorAll(".zoneChangeZone").forEach(e => dateWrite(e));

    zoneChangeMain.addEventListener("input", async e => {
		if (e.target.className === "zoneChangeMyZone") {
			document.querySelectorAll(".zoneChangeZone").forEach(e => dateWrite(e));
            localStorage.setItem('myZone', document.querySelector(".zoneChangeMyZone").value);
            myZone = '0900';
		} else if (e.target.parentNode.className === "zoneChangeRow") {
			dateWrite(e.target);
			const parent = e.target.parentNode;
			console.log(parent);
			const val = {
                NO: Number(parent.querySelector(".zoneChangeDelete").value)
                , ZONE: parent.querySelector(".zoneChangeZone").value
                , TITLE: parent.querySelector(".zoneChangeTitle").value
                , YEAR: parent.querySelector(".zoneChangeYear").value
                , MONTH: parent.querySelector(".zoneChangeMonth").value
                , DAY: parent.querySelector(".zoneChangeDay").value
                , HOUR: parent.querySelector(".zoneChangeHour").value
                , MINUTE: parent.querySelector(".zoneChangeMinute").value
			};
			console.log(val);
			await put(val);
		}

    });

    zoneChangeMain.addEventListener("click", async e => {
		if (e.target.className === "zoneChangeClose") {
			document.querySelectorAll("#zoneChangeMain").forEach(e => e.remove());
		} else if (e.target.className === "zoneChangeDelete") {
			const no = Number(e.target.value);
			e.target.parentNode.remove();
			await del(no);
		} else if (e.target.className === "zoneChangeAdd") {
			const zoneChangeRow = document.createElement("div");
			zoneChangeRow.className = "zoneChangeRow";
			zoneChangeRow.innerHTML = `
                <button class="zoneChangeDelete" value="">削除</button>
                <input type="text" class="zoneChangeZone" value="">
                <input type="text" class="zoneChangeYear" value="">
                <input type="text" class="zoneChangeMonth" value="">
                <input type="text" class="zoneChangeDay" value="">
                <input type="text" class="zoneChangeHour" value="">
                <input type="text" class="zoneChangeMinute" value="">
                <span class="zoneChangeRes"></span>
			`.replace(/(>[\s\n]*)/g, ">").replace(/([\s\n]*<)/g, "<");
			e.target.before(zoneChangeRow);
            await add({
                NO: await getCount()
                , ZONE: ""
                , TITLE: ""
                , YEAR: ""
                , MONTH: ""
                , DAY: ""
                , HOUR: ""
                , MINUTE: ""
            });
			await ref();
			
		}
    });

})();
