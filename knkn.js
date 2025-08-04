(() => {
  document.querySelector("textarea").value = (()=>{
    let txt = ["こ", "ん", "こ", "ん", "k"];
    for (i = 0; i < 1000; i++) {
      const t = ["k", "o", "n"][Math.floor(Math.random() * 3)];
      switch (t) {
        case "k" : {
          if (txt[txt.length - 1] === "k") {
            txt[txt.length - 1] = "っ";
          }
          txt.push("k");
          break;
        };
        case "o" : {
          if (txt[txt.length - 1] === "k") {
            txt[txt.length - 1] = "こ";
          } else {
            txt.push("お");
          }
          break;
        };
        case "n" : {
          if (txt[txt.length - 1] === "n") {
            txt[txt.length - 1] = "ん";
          } else {
            txt.push("n");
          }
          break;
        };
      };
    }
    return txt.join("");
  })();
  document.querySelector('input[name="post"]').click();
})();
