target = /ヌイカ/;
rem = () => talks.querySelectorAll("dt").forEach(e=>(target.test(e.textContent))&&e.parentNode.remove());
new MutationObserver(e=>rem()).observe(talks,{childList:true});
rem();
