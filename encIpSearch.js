json = JSON.parse(document.querySelector(".data").textContent)
searchName = "駆け抜ける熊"
json
.filter(o=>o.NAME==searchName)
.filter(o=>new Date(o.UPDT_DATE) >= new Date("2024-06-20 00:00:00.000"))
.sort((a, b) => new Date(b.UPDT_DATE) - new Date(a.UPDT_DATE))
.forEach(o=>{
	console.log(o.ENCIP_SHORT+": "+o.UPDT_DATE+": "+o.NAME)
	json
	.filter(
			o2 => o2.ENCIP_SHORT == o.ENCIP_SHORT 
			&& new Date(o2.UPDT_DATE) >= new Date("2024-06-20 00:00:00.000")
			&& o2.NAME != searchName
	)
	.forEach(o2=>{
		console.log(o2.ENCIP_SHORT+": "+o2.UPDT_DATE+": "+o2.NAME)
	});
})
