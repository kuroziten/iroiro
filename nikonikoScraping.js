(async () => {
    const form = document.querySelector('form[name="SearchForm"]');
    let firstSkip = true;
    for (const o of sMunicipality.options) {
        if (firstSkip) {
            firstSkip = false;
            continue;
        }
        o.selected = true;
        const formData = new FormData(form);
        const formData2 = new FormData();
        for (const f of formData.entries()) {
            formData2.append(f[0], f[1]);
        }
        const resText = await (await fetch("/empcar/", { method: "post", body: formData2 })).text();
        const resHtml = document.createElement("div");
        resHtml.innerHTML = resText;
        const result = resHtml.querySelector('p[class="align-center mb_20"]')?.textContent.trim();
        console.log(sMunicipality.options[sMunicipality.selectedIndex].textContent, result);
    }
})();
