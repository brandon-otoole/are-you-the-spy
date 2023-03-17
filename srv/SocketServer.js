import { WebSocketServer } from "ws";
import GameDB from "./GameDB.js";
import SessionStore, { getUniqueId } from "./SessionStore.js";

let socketIds = {};

/*
 * The purpose of the socket server is to setup a connection, and do everything
 *
 * The connection process is a mix of standard websocket connection combined
 * with a service specific handshake. the client sends an establish session
 * message that includes a sessionId if the client has one.
 *
 * The server will then respond with a sync message that informs the client what
 * state they are in. either they are not subscribed to a game/room, or they
 * need a full state update regarding the game/room they are subscribed to.
 */

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

function heartbeat() {
    this.isAlive = true;
}

function onClientClose(e) {
}

/*
 * handle each new connection.
 *
 * set up a heartbeat
 * set up error handler
 * set up close cleanup handler
 * set up initial handshake handler on each message
 *
 * once the handshake is complete, it will replace onmessage with a handler
 */
function connectionHandler(ws, req, userId) {
    function _send(msg) {
        ws.send(JSON.stringify(msg));
    }

    let sessionId;

    // setup the heartbeat logic
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    // setup the error handler
    ws.on('error', () => {
        console.log("client connection error");
    });

    // setup the cleanup close handler
    ws.on('close', () => {
        // you will need to mark the session as disconnected
        console.log("client connection closed");

        // TODO: ocassionally cleanup stale sessions
    });

    ws.on('message', onMessageRouter);

    //ws.send(JSON.stringify({ type: "connection/identify" }));

    function onMessageRouter(e) {
        console.log('received: "%s"', e);

        let msg;
        try {
            msg = JSON.parse(e);
        } catch (e) {
            console.log("data not in json format: ", e);
            _send({ type: "error/jsonParseError"})

            return;
        }

        sessionId ? onMessage(msg) : onHandshake(msg);
    }

    /*
     * the handshake handler is responsible for session setup
     *
     * the server listens for a session/establish message
     * if a session id exists, it must be verified
     * if a session id does not exist, create a new session
     *
     * the server then responds with a sync message
     *
     * on success, the server resets the message handler to a real onmessage
     */
    // TODO I think that we should handle session mapping internally
    function onHandshake(msg) {
        console.log("handhsake", msg);
        switch (msg.type) {
            case "session/establish":
                let ids;

                // TODO what do we do if the sessionId does not exist?

                console.log("session/establish:", msg.sessionId);

                if (msg.sessionId) {
                    ids = SessionStore.update(msg.sessionId, ws, userId);
                    sessionId = ids.sessionId;

                    if (!sessionId) {
                        _send({ type: "error/invalidSessionId" });
                        return;
                    }
                } else {
                    // create an id and assign it to the client
                    ids = SessionStore.add(ws, userId);
                    sessionId = ids.sessionId;
                }

                // on success we need to send a sync message with current state
                _send({
                    type: "connection/sync",
                    data: {
                        ...SessionStore.getSyncState(sessionId),
                        sessionId: ids.clientSessionId,
                    },
                });

                return;
            default:
                console.log("connection session id response not valid");

                // respond with helpfull info about how to connect
                _send({ type: "error/sessionNotEstablished" });
                return;
        }
    }

    function onMessage(msg) {
        console.log("messagge");
        switch (msg.type) {
            case "join":
                // make sure that everything is present

                // join a user and session to a game
                GameDB.join(sessionId, msg?.data?.gameId, msg?.data?.name);
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

                GameDB.playerNotReady(sessionId);
                break;

            case "requestStartGame":
                // set a player to not ready
                GameDB.requestStartGame(sessionId);
                break;

            case "connection/sessionId":
                if (msg.data && msg.data.sessionId) {
                    // update the session information to match this connection
                    console.log("has id:", msg.data.sessionId);
                } else {
                    // create an id and assign it to the client
                    let willbesnsnid;
                    let sessionId = SessionStore.add(ws, userId);
                }

                break;
            default:
                break;
        }
    }
}









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

