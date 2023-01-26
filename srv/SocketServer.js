import { WebSocketServer } from "ws";

export default function SocketServer(httpServer) {
    console.log("...setting up the socket server... ");
    const wss = new WebSocketServer({ server:httpServer })

    wss.on('connection', function connection(ws) {
        console.log("...connecting...");
        ws.on('message', function message(e) {
            console.log('received: "%s"', e);

            try {
                let msg = JSON.parse(e);

                if (msg.type === "join") {
                    let resp = { type: "", data: false };

                    if (msg.data === "asdf") {
                        console.log("access granted");
                        resp.data = true;
                    }

                    ws.send(JSON.stringify(resp));
                }
            } catch (e) {
                console.log(e);
                console.log("data not in json format: ", data);
            }

        });

        //ws.send('hello ws client');
    });
}
