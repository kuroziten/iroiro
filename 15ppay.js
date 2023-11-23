(() => {

    while (document.body.querySelectorAll("link").length > 0) {
        document.body.querySelector("link").remove();
    }
    while (document.body.querySelectorAll("style").length > 0) {
        document.body.querySelector("style").remove();
    }
  const link1 = document.createElement("link");
  const link2 = document.createElement("link");
  const link3 = document.createElement("link");
  link1.rel = "preconnect";
  link1.href = "https://fonts.googleapis.com";
  link2.rel = "preconnect";
  link2.href = "https://fonts.gstatic.com";
  link2.crossorigin = "";
  link3.rel = "stylesheet";
  link3.href = "https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap";
  document.body.append(link1);
  document.body.append(link2);
  document.body.append(link3);
	document.querySelector("table").border = "1";
  const style = document.createElement("style");
  style.textContent = `
    :root {
        font-family: 'RocknRoll One', sans-serif;
        --size: 1;
        
        color: white;
        & body {
            & * {
                font-size: min(15px, calc(2vw));
                z-index: 0;
                position: relative;
            }
            margin: 0;
            background: linear-gradient(0deg, #1D3156, #2D4166);
            overflow:scroll;
            min-height: calc(100vh);
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-bottom: calc(2vw * 4 + 5vw);
            &::-webkit-scrollbar{
                display: none;
            }
            & h1 {
                margin: 0;
                padding: min(15px, 2vw);
                background-color: green;
                text-align: center;
                color: red;
                font-size: min(30px, calc(4vw));
                -webkit-text-stroke: min(calc(30px / 60), calc(4vw / 60)) white;
                text-stroke: calc(.1vw * var(--size)) white;
            }
            & h1, h2, p {
                text-align: center;
            }
            & h2 {
                font-size: min(30px, calc(4vw));
            }
            & p {
                width: 100vw;
            }
            & div:nth-child(n + 3) {
                display: flex;
                align-content: center;
                justify-content: center;
            }
            & input[type="button"],input[type="submit"] {
                font-family: 'RocknRoll One', sans-serif;
                background-color: aqua;
                width: calc(100% - 1px);
                height: 100%;
                margin: 1px;
                border-radius: 5px;
                border: 1px solid black;
            }
            & .tbl {
                border: 0;
                border-collapse: collapse;
                border-radius: 5px;
                position: relative;
                overflow: hidden;
                & th {
                    border: 1px solid black;
                    background-color: #eeedb8;
                    color: #2D4166;
                }
                & th, td {
                    border: 1px solid white;
                    padding: 10px;
                }
                &:before {
                    content: "";
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: 5px;
                    border: 1px solid white;
                    box-sizing: border-box;
                    pointer-events: none;
                }
            }
            & a {
                color: aqua;
            }
            & footer {
                position: fixed;
                bottom: 0;
                background-color: #30424E;
                z-index: 1;
                & p:nth-of-type(1) {
                    margin: min(15px, 2vw) 0 min(15px, 2vw) 0;
                    & img {
                        height: min(50px, 5vw);
                        width: auto;
                    }
                }
                & p:nth-of-type(2) {
                    margin-bottom: min(15px, 2vw);
                    font-size: min(15px, calc(2vw));
                }
            }
        }
    }
  `;
  document.body.append(style);
})();
