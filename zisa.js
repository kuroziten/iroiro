const div = document.createElement("div");
div.innerHTML = `
	<input type="text" class="zoneChangeMyZone" value="0900">
	<div class="zoneChangeRow">
		<input type="text" class="zoneChangeZone" value="0900">
		<input type="text" class="zoneChangeYear" value="2024">
		<input type="text" class="zoneChangeMonth" value="11">
		<input type="text" class="zoneChangeDay" value="13">
		<input type="text" class="zoneChangeHour" value="22">
		<input type="text" class="zoneChangeMinute" value="34">
		<span class="zoneChangeRes">test</span>
	</div>
	<style>
		#zoneChangeMain input {
			width: 5vw;
		}
	</style>
`;
div.style.position = "fixed";
div.style.inset = "0";
div.style.margin = "auto";
div.style.zIndex = "99999";
div.style.width = "90vw";
div.style.height = "90vh";
div.style.backgroundColor = "green";
div.id = "zoneChangeMain";
document.body.style = "position: fixed;inset: 0;margin: auto;";
document.body.append(div);
div.addEventListener("input", e => {
	const parent = e.target.parentNode;
	const zoneChangeMyZone = document.querySelector(".zoneChangeMyZone").value;
	const myZoneHour = zoneChangeMyZone.substr(0, 2);
	const myZoneMinute = zoneChangeMyZone.substr(2, 2);
	const zoneChangeZone = parent.querySelector(".zoneChangeZone").value;
	const zoneHour = zoneChangeZone.substr(0, 2);
	const zoneMinute = zoneChangeZone.substr(2, 2);
	const zoneChangeYear = parent.querySelector(".zoneChangeYear").value;
	const zoneChangeMonth = parent.querySelector(".zoneChangeMonth").value;
	const zoneChangeDay = parent.querySelector(".zoneChangeDay").value;
	const zoneChangeHour = parent.querySelector(".zoneChangeHour").value;
	const zoneChangeMinute = parent.querySelector(".zoneChangeMinute").value;

	const diffHour = String(Number(myZoneHour) + (Number(myZoneHour) - Number(zoneHour))).padStart(2, "0");
	const diffMinute = String(Number(myZoneMinute) + (Number(myZoneMinute) - Number(zoneMinute))).padStart(2, "0");

	const dt = new Date(
		`${zoneChangeYear}-${zoneChangeMonth}-${zoneChangeDay} ${zoneChangeHour}:${zoneChangeMinute} GMT+${diffHour}${diffMinute}`
	).toString();
	parent.querySelector(".zoneChangeRes").textContent = dt;

});
