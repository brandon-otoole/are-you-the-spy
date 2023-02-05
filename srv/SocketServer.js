import { WebSocketServer } from "ws";
import GameDB from "./GameDB.js";
import SessionStore from "./SessionStore.js";

// TODO: This needs to be upgraded to track connections per room, track who is
//       connected with which ws and who has joined which rooms

function sendJoinResult(ws, grant) {
    let msg = { type: grant ? "join/grant" : "join/deny" };

    ws.send(JSON.stringify(msg));
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

function joinGame(ws, gameId, sessionId, userId, name) {
    // you must try to unjoin from the last game if present
    GameDB.unjoin(sessionId);

    // try to join the requested game
    const granted = GameDB.join(userId, gameId, sessionId, name);

    // respond on the socket with the join results
    // TODO: make sure to send the full state
    sendJoinResult(ws, granted);

    // let everyone in the room know that you joined
    if (granted) {
        sendAddPlayer(ws, msg.data)
    }
}

export default function SocketServer(httpServer) {
    console.log("...setting up the socket server... ");
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', connectionHandler);

    const healthTimer = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) { return ws.terminate(); }

            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', function close() {
        clearInterval(healthTimer);
    });

    httpServer.on('upgrade', function upgrade(req, socket, head) {
        let userId = getUserId(req.headers.cookie);

        if (!userId) {
            console.log("NOT AUTHORIZED");
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }

        wss.handleUpgrade(req, socket, head, function done(ws) {
            console.log("upgrade" );
            wss.emit('connection', ws, req, userId);
        });
    });
}

function getUserId(cookieString){
    if (!cookieString) { return null; }

    for (let cookie of cookieString.split(';')) {
        const [name, value] = cookie.split('=');
        if (name === 'userId') {
            return value;
        }
    }
}

const typeMap = {
    'join': GameDB.join,
    'unjoin': GameDB.unjoin,
    'imReady': GameDB.imReady,
    'imNotReady': GameDB.imNotReady,
    'playerNotReady': GameDB.playerNotReady,
};

function heartbeat() {
    console.log("heartbeat - pong");
    this.isAlive = true;
}

function connectionHandler(ws, req, userId) {
    let sessionId = SessionStore.add(ws, userId);

    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function(e) {
        console.log('received: "%s"', e);

        let msg;
        try {
            msg = JSON.parse(e);
        } catch (e) {
            console.log("data not in json format: ", e);

            return;
        }

        switch (msg.type) {
            case "join":
                // join a user and session to a game
                GameDB.join(sessionId, msg.data.gameId, msg.data.name);
                break;

            case "unjoin":
                // remove a user and session to a game
                GameDB.unjoin(sessionId);
                break;

            case "imReady":
            case "imready":
                // do this to all players in a room/game
                GameDB.imReady(sessionId);
                break;

            case "imNotReady":
            case "imnotready":
                // do this to all players in a room/game
                GameDB.imNotReady(sessionId);
                break;

            case "playerNotReady":
                // set a player to not ready
                GameDB.playerNotReady(sessionId, playerId);
                break;
        }
    });
}
