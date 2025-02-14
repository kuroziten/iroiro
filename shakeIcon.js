new MutationObserver(e=>talks.querySelectorAll("dt").forEach(e=>(e.textContent=="鮭太郎")&&e.parentNode.setAttribute("class","talk bm"))).observe(talks,{childList:true});
