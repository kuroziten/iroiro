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
	"ヌイカ2"
];
// kickする対象のencip
kickTargetName = [
	"CFT2i"
];

json = await (await fetch("/ajax.php", {method:"post"})).json();
users = Object.values(json.users).map(e => ({name: e.name, encip: e.encip.split("").slice(0, 5), id: e.id}));

for (u of users) {
	if (banTargetName.some(e => e.name === u.name) || banTargetEncip.some(e => e.encip === u.encip)) {
		$.post("https://drrrkari.com/room/?ajax=1", {'ban_user': u.id, block: 1},
					 function(result) {
		});		
	} else if (kickTargetName.some(e => e.name === u.name) || kickTargetEncip.some(e => e.encip === u.encip)) {
		$.post("https://drrrkari.com/room/?ajax=1", {'ban_user': u.id},
					 function(result) {
		});
	}
}
