var sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒

// await sleep(1000);
// console.log("test1");
// await sleep(1000);
// console.log("test2");

var pst = async (_yyyy, _MM, _dd, _s_HH, _s_mm, _e_HH, _e_mm) => {
    var saisouriyu = $("#inputsaisouriyu").val();
    if($("#inputsaisou:checked").val() != undefined　&& saisouriyu == ""){
        alert("再送する をチェックした場合は再送理由を記入して下さい。");
        return;
    }
    for (var num = 1;num < 30; num++) {
        if($("#for" + num).val() != undefined){
            var tmpval = $("#for" + num).val();
            if (!tmpval.match(/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/)){
                alert("e-mailアドレスをご確認ください。");
                $("#for" + num).focus();
                return false;
            }
        }
    }
    // 入力チェック
    if($("#inputBody").val()==""){
        alert("本文を入力してください。");
        return;
    }
    //未来保存

    //未来日
    var y = $("#inputYear").val();
    var m = $("#inputMonth").val();
    var d = $("#inputDate").val();
    //送信日

    var tomorrow = y + m + d;
    tomorrow.toString();

    if(tomorrow > 20240628){
		console.log(tomorrow);
        alert("未来日は送信できません。");
        return;
    }
    if($("#inputKisya:checked").val()!=undefined){
        if(($("#reasonWork:checked").val()!=undefined) && ($("#inputSinseiId").val()=="")
           ||($("#reasonWork:checked").val()!=undefined) && ($("#inputBiko").val()=="")){
            alert("帰社理由に業務が選択されています。\r\n申請コード、申請理由を入力してください。")
            return;
        }
    }
    // if(window.confirm('画面の内容で日報を送信します。\r\nよろしいですか？')){
	if(true){
        var frm_m = "#nippou";
        var year = $("#inputYear").val();
        var month = $("#inputMonth").val();
        var date = $("#inputDate").val();
        var kinmutaikei = $("#inputKinmutaikei").val();
        var start_hours = $("#inputStart_hours").val();
        var start_minute = $("#inputStart_minute").val();
        var end_hours = $("#inputEnd_hours").val();
        var end_minute = $("#inputEnd_minute").val();
        var saisou = 0;
        if($("#inputsaisou:checked").val()!=undefined){
            saisou = 1;
        }
        var body = $("#inputBody").val();
        var kisya = 1;
        var workFlg = null;
        if($("#inputKisya:checked").val()!=undefined){
            kisya = 0;
            workFlg = 0;
        }
        var hours = $("#inputHours").val();
        var minute = $("#inputMinute").val();
        var biko = $("#inputBiko").val();
        var strKbn = "";
        var strTo = "";
        for (var i = 0;i < 30; i++) {
            if ($("#kbn" + i.toString()).val() != undefined) {
                strKbn = strKbn + $("#kbn" + i.toString()).val() + ",";
            }
            if ($("#for" + i.toString()).val() != undefined) {
                strTo = strTo + $("#for" + i.toString()).val() + ",";
            }
        }
        if($("#reasonWork:checked").val()!=undefined){
            workFlg = 1;
        }
        var sinseiId = "";
        if($("#inputSinseiId").val()!=undefined){
            sinseiId = $("#inputSinseiId").val();
        }
        $("[name=year]").val(_yyyy);
        $("[name=month]").val(_MM);
        $("[name=date]").val(_dd);
        $("[name=kinmutaikei]").val(kinmutaikei);
        $("[name=start_hours]").val(_s_HH);
        $("[name=start_minute]").val(_s_mm);
        $("[name=end_hours]").val(_e_HH);
        $("[name=end_minute]").val(_e_mm);
        $("[name=saisou]").val(saisou);
        $("[name=saisouriyu]").val(saisouriyu);
        $("[name=body]").val(body);
        $("[name=kisya]").val(kisya);
        $("[name=hours]").val(hours);
        $("[name=minute]").val(minute);
        $("[name=biko]").val(biko);
        $("[name=strKbn]").val(strKbn);
        $("[name=strTo]").val(strTo);
        $("[name=workFlg]").val(workFlg);
        $("[name=sinseiId]").val(sinseiId);

        const data = new FormData(document.querySelector("#nippou"));
        console.log(await(await fetch("/syanai_page/nippou.do", {method: "POST", body: data})).text());
		console.log("送信完了")
        await sleep(5000);
        // $('#nippou').submit();
    }
};

// await pst("2024", "06", "03", "9", "0", "17", "30");
// await pst("2024", "06", "04", "9", "0", "17", "30");
// await pst("2024", "06", "05", "9", "0", "17", "30");
// await pst("2024", "06", "06", "9", "0", "17", "30");
// await pst("2024", "06", "07", "9", "0", "17", "30");

await pst("2024", "06", "10", "9", "0", "18", "0");
await pst("2024", "06", "11", "9", "0", "17", "30");
await pst("2024", "06", "12", "9", "0", "17", "30");
await pst("2024", "06", "13", "9", "0", "18", "0");
await pst("2024", "06", "14", "9", "0", "19", "30");

await pst("2024", "06", "17", "9", "0", "19", "0");
await pst("2024", "06", "18", "9", "0", "17", "30");
await pst("2024", "06", "19", "9", "0", "18", "0");
await pst("2024", "06", "20", "9", "0", "17", "30");
await pst("2024", "06", "21", "9", "0", "18", "0");

await pst("2024", "06", "24", "9", "0", "17", "30");
await pst("2024", "06", "25", "9", "0", "17", "30");
await pst("2024", "06", "26", "9", "0", "18", "0");
await pst("2024", "06", "27", "9", "0", "17", "30");
await pst("2024", "06", "28", "9", "0", "17", "30");
