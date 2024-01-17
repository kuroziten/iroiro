Object.values((await(await fetch("/ajax.php",{method:"post"})).json()).users).forEach(e=>e.encip.slice(0,3)=="lDi"&&fetch("ajax=1&ban_user="+e.id+"&block=1"));
