import http from 'http'
import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { WebSocketServer } from 'ws'

const host = 'localhost'
const port = 8000
const portws = 8080

class Server {

    constructor(host, port, portws) {
        let server = http.createServer(this.requestListener)
        this.http_server = server
        this.websocket_server = new WebSocketServer({ server })
        this.websocket_server.on('connection', this.websocket_server_onconnection)
        this.http_server.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        })
        /*this.websocket_server.listen(portws, host, () => {
            console.log(`WS-Server is running on wss://${host}:${port}`);
        })*/
    }

    websocket_server_onconnection(websocket) {
        let proc = spawn('./term-app')
        proc.stdout.setEncoding('utf8')
        proc.stdin.setEncoding('utf-8')
        proc.on('exit', event => {
            websocket.close()
        })

        proc.stdout.on('data', data => {
            websocket.send(JSON.stringify({'out': data}))
        });

        websocket.on('message', msg => {
            let data = JSON.parse(msg)
            console.log(data)
            //proc.stdin.cork()
            if ('key' in data) {
                proc.stdin.write(data.key)
            }
            if ('cols' in data && 'rows' in data) {

            }
            //proc.stdin.flush()
            //proc.stdin.uncork()
        })

        websocket.send(JSON.stringify({'out': 'Connected\n\r'}))
    }

    requestListener (req, res) {
        res.writeHead(200)
        if (req.url.match(/xterm\.js/ig)) {
            res.end(readFileSync("./node_modules/xterm/lib/xterm.js"))
        }
        else if (req.url.match(/xterm\.css/ig)) {
            res.end(readFileSync("./node_modules/xterm/css/xterm.css"))
        }
        else if (req.url.match(/string-width\.js/ig)) {
            res.end(readFileSync("./str-width.js"))
        }
        else if (req.url.match(/Mono\.woff/ig)) {
                res.end(readFileSync("./DejaVuSansMonoNerdFontCompleteMono.woff"))
        }
        else if (req.url.match(/fit-addon\.js/ig)) {
                res.end(readFileSync("./fit-addon.js"))
        }
        else {
            res.end(readFileSync("./index.html"))
        }
    }
}

const server = new Server(host, port, portws)
