(async () => {

    document.querySelector('option[label="東京都"]').selected = true;
    set_start_towns();
    await new Promise(resolve => setTimeout(resolve, 1000));

    let firstSkip = true;
    for (o of start_towns_pk.querySelectorAll("option")) {
        if (firstSkip) {
            firstSkip = false;
            continue;
        }

        /* 地区を選択 */
        o.selected = true;
        set_start_shops();
        await new Promise(resolve => setTimeout(resolve, 500));

        let firstSkip2 = true;
        for (o2 of start_shops_pk.querySelectorAll("option")) {
            if (firstSkip2) {
                firstSkip2 = false;
                continue;
            }

            /* 店舗を選択 */
            o2.selected = true;
            set_start_dates();
            await new Promise(resolve => setTimeout(resolve, 1000));

            /* 借りる日を選択 */
            start_date.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            document.querySelector('td[onclick="set_start_times(1715526000);"]').click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            let firstSkip3 = true;
            for (o3 of start_time.querySelectorAll("option")) {
                if (firstSkip3) {
                    firstSkip3 = false;
                    continue;
                }

                /* 借りる時間を選択 */
                o3.selected = true;
                set_return_dates();
                await new Promise(resolve => setTimeout(resolve, 1000));

                /* 返却する日を選択 */
                return_date.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                document.querySelector('td[onclick="set_return_times(1715612400);"]').click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                const rto = return_time.querySelectorAll("option");
                rto[rto.length - 1].selected = true;
                set_btn_submit();
                await new Promise(resolve => setTimeout(resolve, 1000));

                /* 禁煙 */
                document.querySelector('input[name="sop1"][value="2"]').click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                for (let i = 3; i <= 4; i++) {

                    /* クルマを選ぶ */
                    document.querySelector('input[onchange="submit_btn_active();"][value="' + i + '"]').click();
                    await new Promise(resolve => setTimeout(resolve, 1000));


                    const fd = new FormData(document.querySelector('form[action="https://car.orix.co.jp/order_chk_fm/"]'));
                    fd.append("order_car", "order_car");
                    const fd2 = new FormData();
                    for (const f of fd.entries()) {
                        if (f[0] == "token") {
                            const tokenRes = await (await fetch("https://car.orix.co.jp/")).text();
                            const tokenHtml = document.createElement("div");
                            tokenHtml.innerHTML = tokenRes;
                            const token = tokenHtml.querySelector('input[name="token"]').value;
                            fd2.append("token", token);
                            continue;
                        }
                        fd2.append(f[0], f[1]);
                    }

                    const res = await (await fetch("https://car.orix.co.jp/order_chk_fm/", { method: "post", body: fd2 })).text();
                    const html = document.createElement("div");
                    html.innerHTML = res;
                    const result = html.querySelector('p[class="txt-cmn-error-01 s-strong s-center"]')?.textContent;
                    console.log(
                        start_towns_pk.options[start_towns_pk.selectedIndex].textContent
                        , start_shops_pk.options[start_shops_pk.selectedIndex].textContent
                        , result);

                    await new Promise(resolve => setTimeout(resolve, 5000));

                }

                break;
            }
        }
    }

})();
