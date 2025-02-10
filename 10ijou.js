new MutationObserver(e=>talks.querySelectorAll(".body").forEach(e=>e.textContent.length>10&&(p=e=>e.parentNode)&&p(p(p(e))).remove())).observe(talks,{childList:true});
