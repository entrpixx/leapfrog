import { WebSocketServer } from "ws";
import readline from "node:readline";

const wss = new WebSocketServer({ port: 2347 });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

rl.on("line", (line) => {
    const msg = line.trim();

    if (!msg) {
        return;
    }

    wss.clients.forEach((c) => {
        if (c.readyState === c.OPEN) {
            c.send(msg);
        }
    });
});
