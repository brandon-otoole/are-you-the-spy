import debug from "./debugLogger.js";

function getSocketUrl(socketPath) {
    const loc = window.location;
    let uri = (loc.protocol === "https:") ? "wss:" : "ws:";

    uri += "//" + loc.host + socketPath;

    console.log(uri);

    return uri
}

class SocketConnection {
    constructor(socketPath, lifecycle) {
        //this.id = Math.floor(Math.random()*1000);
        //debug.log("constructor", this.id);
        this.sessionId = undefined;
        this.host = getSocketUrl(socketPath);
        this.userLifecycle = lifecycle;
        this.msgQueue = [];

        this.joined = false;

        this.keepAlive = true;
        this.retryInterval = 1000;
        this.reconnectTimer = null;

        this.ws = null;

        this.setup();
    }

    identify() {
        if (this.sessionId) {
            debug.log("session id:", this.sessionId);
            this._send({
                type: "connection/sessionId",
                data: { sessionId: this.sessionId }
            });
        } else {
            debug.log("no session id");
            this._send({
                type: "connection/sessionId",
            });
        }
    }

    setSessionId(id) {
        this.sessionId = id;
    }

    setup() {
        debug.log("setup", this.id);
        if (this.ws !== null) {
            console.error("double connecting a WS");
            return;
        }

        this.ws = new WebSocket(this.host);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onmessage = this.onSession.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onopen = this.onOpen.bind(this);
    }

    destroy() {
        //debug.log("destroy", this.id);
        this.ws.onerror = this.destroyed.bind(this);
        this.ws.onmessage = this.destroyed.bind(this);
        this.ws.onclose = this.destroyed.bind(this);
        this.ws.onopen = this.destroyed.bind(this);
    }

    testBreak() {
        debug.log("testing a broken connectikon");
        this.ws.close();
    }

    destroyed(e) {
        debug.log("destroyed", this.id);
    }

    onOpen(e) {
        debug.log("onOpen -- sessionId:", this.sessionId);
        this._send({
            type: "session/establish",
            sessionId: this.sessionId,
        });
    }

    onUnauthenticated(e) {
        debug.log("you should authenticate");
        // if you got here then you dont have a user name

        // clear and rerun the workflow for a new user.

        // if there is no name, redirect the user to setup

        // always make at least on server request
        window.location.href = '/setup';
    }

    onSession(e) {
        const serverMessage = JSON.parse(e.data);

        if (serverMessage.type == "error/noUserError") {
            this.ws.onmessage = this.onUnauthenticated.bind(this);
            return;
        }

        debug.log("onSession==msg:", serverMessage);
        this.sessionId = serverMessage?.data?.sessionId;
        debug.log("onSession", this.sessionId);

        this.retryInterval = 1000;

        for (const msg of this.msgQueue) {
            debug.log("delayed message:", msg);
            this._send(msg);
        }
        this.msgQueue.length = 0;

        this.userLifecycle.onOpen(e);

        debug.log("switch message handler");
        this.ws.onmessage = this.onMessage.bind(this);
    }

    onMessage(e) {
        this.userLifecycle.onMessage(e);
    }

    onClose(e) {
        debug.log("onClose", this.id);
        console.dir("onClose", this.id);
        this.userLifecycle.onClose(e);

        this.ws = null;

        // setup the reconnection
        //debug.log("keepAlive:", this.keepAlive);
        if (this.keepAlive) {
            debug.log("setting up a new connection in:", this.retryInterval, this.ws);
            this.reconnectTimer = setTimeout(this.setup.bind(this), this.retryInterval);
            this.retryInterval = Math.min(10000, 2*this.retryInterval);
        }
    }

    onError(e) {
        console.dir(e.target);
        this.userLifecycle.onError(e);
    }

    _send(msg) {
        this.ws.send(JSON.stringify(msg));
    }

    send(msg) {
        //debug.log("send", this.id);
        if (this.ws && this.ws.readyState === this.ws.OPEN) {
            this._send(msg);
        } else {
            //debug.log("saving for later");
            this.msgQueue.push(msg);
        }
    }

    join(gameId) {
        this.gameId = gameId;

        debug.log("join called:", gameId);

        if (this.ws && this.ws.readyState === this.ws.OPEN) {
            this._send({
                "type": "join",
                "data": {
                    gameId: gameId,
                    name: localStorage.getItem("name")
                }
            });
        } else {
            // joining will have to happen later
        }
    }

    unjoin() {
        this.gameId = null;
    }

    close() {
        //debug.log("close", this.id);
        this.destroy();

        clearInterval(this.retryInterval);
        this.keepAlive = false;
        //debug.log("reconnect turned off");

        if (this.ws === null) {
            // do nothing
        } else if (this.ws.readyState === this.ws.OPEN) {
            for (const msg of this.msgQueue) {
                this._send(msg);
            }
        }

        // the msg queue is lost
        this.msgQueue.length = 0;
        //debug.log(this.ws.readyState);
        this.ws.close();

        this.ws = null;

        // you also might want to tear down the lifecycle methods?
        //TODO
    }

    myOnOpen() {
        //debug.log("myOnOpen", this.id);
        for (const msg of this.msgQueue) {
            this._send(msg);
        }
    }
}

export default SocketConnection;
