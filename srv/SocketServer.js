import { WebSocketServer } from "ws";
import GameDB from "./GameDB.js";
import crypto from "crypto";

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
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', function connection(ws, req, userId) {
        console.log("userId: ", userId);
        // on connection, create a sessionId. store it here and in the db
        let gameId;
        let sessionId = crypto.randomBytes(16).toString('hex');

        GameDB.addSession(sessionId, ws);

        ws.on('message', function message(e) {
            console.log('received: "%s"', e);

            try {
                let msg = JSON.parse(e);

                switch (msg.type) {
                    case "join":
                        gameId = msg.data.gameId;
                        const granted = GameDB.join(gameId, sessionId);

                        sendJoinResult(ws, granted);

                        if (granted) {
                            sendAddPlayer(ws, msg.data)
                        }

                        break;

                    case "imReady":
                        // do this to all players in a room/game
                        sendPlayerReadyStatus(ws, msg.data.name, true);
                        break;
                    case "imNotReady":
                        // do this to all players in a room/game
                        sendPlayerReadyStatus(ws, msg.data.name, false);
                        break;
                    case "playerNotReady":
                        // set a player to not ready
                        break;
                    case "asdf":
                        break;
                    case "qwerty":
                        break;
                    case "1234":
                        break;
                }
            } catch (e) {
                console.log(e);
                console.log("data not in json format: ", e);
            }

        });
    });

    httpServer.on('upgrade', function upgrade(req, socket, head) {
        let userId = getUserId(req.headers.cookie);

        wss.handleUpgrade(req, socket, head, function done(ws) {
            wss.emit('connection', ws, req, userId);
        });
    });

    function getUserId(cookieString){
        for (let cookie of cookieString.split(';')) {
            const [name, value] = cookie.split('=');
            if (name === 'userId') {
                return value;
            }
        }
    }
}
