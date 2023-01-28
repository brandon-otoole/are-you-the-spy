import { WebSocketServer } from "ws";
import GameDB from "./GameDB.js";

// TODO: This needs to be upgraded to track connections per room, track who is
//       connected with which ws and who has joined which rooms

function sendJoinResult(ws, grant) {
    let msg = { type: grant ? "join/grant" : "join/deny" };

    ws.send(JSON.stringify(msg));

    let resp = { type: "granted", data: false };

}

function sendAddPlayer(ws, player) {
    ws.send(JSON.stringify({
        type: "lobby/addPlayer",
        data: { name: player.name, ready: player.ready }
    }));
}

function sendPlayerReadyStatus(ws, playerId, ready) {
    ws.send(JSON.stringify({
        type: ready ? "lobby/setPlayerReady" : "lobby/setPlayerNotReady",
        data: { name: playerId }
    }));
}

function sendStartGame(ws) {
}

function sendEliminatePlayer(ws, playerId) {
}

export default function SocketServer(httpServer) {
    console.log("...setting up the socket server... ");
    const wss = new WebSocketServer({ server:httpServer })

    wss.on('connection', function connection(ws) {
        console.log("...connecting...");

        const playerAddEvent = {
            type: "addPlayer",
            data: {
                name: "Jerry Jager"
            },
        };
        //ws.send(JSON.stringify(playerAddEvent));


        ws.on('message', function message(e) {
            console.log('received: "%s"', e);

            try {
                let msg = JSON.parse(e);

                switch (msg.type) {
                    case "join":
                        const granted = GameDB.contains(msg.data.gameId);

                        sendJoinResult(ws, granted);

                        if (granted) {
                            sendAddPlayer(ws, msg.data)
                        }

                        break;

                    case "imready":
                        sendPlayerReadyStatus(ws, msg.data.name, true);
                        break;
                    case "imnotready":
                        sendPlayerReadyStatus(ws, msg.data.name, false);
                        break;
                    case "asdf":
                        break;
                    case "qwerty":
                        break;
                    case "1234":
                        break;
                }

                if (msg.type === "join") {
                } else if (msg.type === "setReady") {
                } else if (msg.type === "setNotReady") {
                }
            } catch (e) {
                console.log(e);
                console.log("data not in json format: ", e);
            }

        });
    });
}
