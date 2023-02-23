let idBk = "";

setInterval(function () {
    const talk = document.querySelector(".talk");
    if (talk.id != idBk) {
        console.log(talk.id);
        console.log(talk.querySelector(".body") != undefined && talk.querySelector(".body").textContent.indexOf('$punch') != -1);
        idBk = talk.id;
        if (talk.querySelector(".body") != undefined && talk.querySelector(".body").textContent.indexOf('$punch') != -1) {
            callerFun();
        }
    }
},500);


async function callerFun(){
    await testAsync("translate: 5px;");
    await testAsync("translate: -5px;");
    await testAsync("translate: 4px;");
    await testAsync("translate: -4px;");
    await testAsync("translate: 3px;");
    await testAsync("translate: -3px;");
    await testAsync("translate: 2px;");
    await testAsync("translate: -2px;");
    await testAsync("translate: 0px;");
}



function testAsync(msg){
    return new Promise((resolve,reject)=>{
        //here our function should be implemented 
        setTimeout(()=>{
            document.querySelectorAll(".talk")[0].querySelector("dt").style = msg;
            resolve();
        ;} , 50
        );
    });
}
