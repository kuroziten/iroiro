// banする対象の名前
banTargetName = [
  "スカイ1"
];
// banする対象のencip
banTargetEncip = [
  "aaaaa"
];
// kickする対象の名前
kickTargetName = [
  "スカイ"
];
// kickする対象のencip
kickTargetEncip = [
  "CFT2i"
];

new MutationObserver(async e=>{
  json = await (await fetch("/ajax.php", {method:"post"})).json();
  users = Object.values(json.users).map(e => ({name: e.name, encip: e.encip?.split("").slice(0, 5), id: e.id}));

  for (u of users) {
    if (banTargetName.some(e => e === u.name) || banTargetEncip.some(e => e === u.encip)) {
      const formData = new FormData();
      formData.append("ban_user", u.id);
      formData.append("block", 1);
      fetch("/room/?ajax=1", {method: "post", body: formData});
    } else if (kickTargetName.some(e => e === u.name) || kickTargetEncip.some(e => e === u.encip)) {
      const formData = new FormData();
      formData.append("ban_user", u.id);
      fetch("/room/?ajax=1", {method: "post", body: formData});
    }
  }

}).observe(talks,{childList:true});
