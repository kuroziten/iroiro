[Document, Element].forEach(e => {
  e.prototype.qa=function(s){return this.querySelectorAll(s);};
  e.prototype.q=function(s){return this.qa(s)[0];};
  e.prototype.n=function(){return this.nextElementSibling};
});
(async()=>{
  o=async f=>await new Promise(rs=>{
    rq=indexedDB.open("d",1);
    rq.onupgradeneeded=e=>{
      db=e.target.result;
      if(!db.objectStoreNames.contains("s")){
        db.createObjectStore("s",{keyPath:"図鑑ナンバー"});
      }
    };
    rq.onsuccess=async()=>{
      await f(rq.result.transaction("s","readwrite").objectStore("s"));
      rq.result.close();
      rs(rq.result);
    };
  });
  c={"✕":0,"△":1,"ー":2,"◯":3,"◎":4};
  tL=document.q("#controllable_form").n().qa("tr");
  lim=0;
  for(i=1;i<tL.length;i++){
    tr=tL[i];
    dn=tr.q("td").lastChild.textContent;
    if(!await new Promise(r=>o(s=>s.get(dn).onsuccess=e=>r(e.target.result)))){
      dom=new DOMParser().parseFromString(await(await fetch(tr.q(".a-link").href)).text(),'text/html');
      nm=tr.q("a").textContent;
      console.log("データベースに取り込みます...",dn,nm);
      [r,t]=["hm_4","hm_5"].map(s=>Array.from(dom.q("#"+s).n().qa("tr")[1].qa("td")).map(e=>c[e.textContent.trim()]));
      await o(s=>new Promise(r=>s.put({
        図鑑ナンバー:dn,
        名前:nm,
        ワクチン:r[0],
        データ:r[1],
        ウイルス:r[2],
        フリー:r[3],
        ヴァリアブル:r[4],
        アンノウン:r[5],
        ノーデータ:r[6],
        ほのお:t[0],
        みず:t[1],
        くさ:t[2],
        こおり:t[3],
        でんき:t[4],
        じめん:t[5],
        はがね:t[6],
        ひこう:t[7],
        ひかり:t[8],
        やみ:t[9],
        ノーマル:t[10],
      }).onsuccess=e=>r()
                            ));
    };
    lim++;
    if(lim>=999)break;
  };
  await o(s=>new Promise(rs=>{
    s.getAll().onsuccess=e=>{
      l=[];
      for(r of e.target.result){
        if(
          1
          /*ワクチン*/
          //&&r.ワクチン<2
          /*データ*/
          //&&r.データ<2
          /*ウイルス*/
          //&&r.ウイルス<2
          /*フリー*/
          //&&r.フリー<2
          /*ヴァリアブル*/
          //&&r.ヴァリアブル<2
          /*アンノウン*/
          //&&r.アンノウン<2
          /*ノーデータ*/
          //&&r.ノーデータ<2
          /*ほのお*/
          &&r.ほのお<3
          /*みず*/
          //&&r.みず<3
          /*くさ*/
          //&&r.くさ<3
          /*こおり*/
          //&&r.こおり<3
          /*でんき*/
          //&&r.でんき<3
          /*じめん*/
          //&&r.じめん<3
          /*はがね*/
          //&&r.はがね<3
          /*ひこう*/
          //&&r.ひこう<3
          /*ひかり*/
          //&&r.ひかり<3
          /*やみ*/
          //&&r.やみ<3
          /*ノーマル*/
          //&&r.ノーマル<3
        ){
          l.push(r);
        }
      };
      console.table(l);
      rs();
    };
  }));
})();
