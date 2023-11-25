const cssAction = () => {
    while (document.body.querySelectorAll("link").length > 0)
        document.body.querySelector("link").remove();
    while (document.body.querySelectorAll("style").length > 0)
        document.body.querySelector("style").remove();
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
            color: white;
            & body {
                & * {
                    font-size: min(15px, calc(2vw));
                    z-index: 0;
                    position: relative;
                    font-family: 'RocknRoll One', sans-serif;
                }
                margin: 0;
                background: linear-gradient(0deg, #1D3156, #2D4166);
                overflow:scroll;
                min-height: calc(100vh);
                scrollbar-width: none;
                -ms-overflow-style: none;
                padding-bottom: calc(2vw * 4 + 5vw + 2vw);
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
                    &:nth-of-type(4) font u {
                        animation: warningAnime 3s infinite;
                    }
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
                & input[type="text"] {
                    border-radius: 5px;
                    border: 0;
                    &:focus {
                        outline:1px solid pink;
                    }
                }
                & .tbl {
                    border: 2px solid white;
                    border-collapse: separate;
                    border-spacing: 0;
                    border-radius: 5px;
                    overflow: hidden;
                    & tr {
                        & th, td {
                            border: .5px solid white;
                            padding: 1vw;
                        }
                        &:first-child {
                            & th, td {
                                border-top: 0;
                                background-color: #eeedb8;
                                color: #2D4166;
                            }
                        }
                        &:last-child {
                            & th, td {
                                border-bottom: 0;
                            }
                        }
                        & th:first-child, td:first-child {
                            border-left: 0;
                        }
                        & th:last-child, td:last-child {
                            border-right: 0;
                        }
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
        .warning {
            animation: warningAnime 3s infinite;
        }
        @keyframes warningAnime {
            0% {
                color: red;
            }
            50% {
                color: black;
            }
            100% {
                color: red;
            }
        }
    `;
    document.body.append(style);
};
cssAction();
window.onload = () => cssAction();
