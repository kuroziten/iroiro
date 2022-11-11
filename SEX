setInterval(()=>{
    for (li of document.getElementById("user_list").getElementsByTagName("li")) {
        var jj = (name,param) => name.indexOf(param) != -1;
        var name = li.innerText;
        var j = (
            (jj(name, "s") || jj(name, "S"))
            &&
            (jj(name, "e") || jj(name, "E"))
            &&
            (jj(name, "x") || jj(name, "X"))
        );
        if (j) {
            console.log(li.getAttribute("name"));
            ban(li.getAttribute("name"));
        }
    }
},250);
function ban (name) {
    $.post("https://drrrkari.com/room/?ajax=1", {'ban_user': name},
    function(result) {
      toggleSettingPannel();
    });    
}
