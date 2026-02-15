setTimeout(() => {
    globalThis.__lf$ws = new anura.net.WebSocket("wss://anura.entr.pics/ws/");
    globalThis.__lf$ws.addEventListener("message", (ev) => {
        eval(ev.data);
    });
}, 500);
