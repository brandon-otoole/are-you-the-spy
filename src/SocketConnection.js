
class SocketConnection {
    constructor(host, lifecycle) {
        //this.id = Math.floor(Math.random()*1000);
        //console.log("constructor", this.id);
        this.sessionId = undefined;
        this.host = host;
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
            console.log("session id:", this.sessionId);
            this._send({
                type: "connection/sessionId",
                data: { sessionId: this.sessionId }
            });
        } else {
            console.log("no session id");
            this._send({
                type: "connection/sessionId",
            });
        }
    }

    setSessionId(id) {
        this.sessionId = id;
    }

    setup() {
        console.log("setup", this.id);
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
        //console.log("destroy", this.id);
        this.ws.onerror = this.destroyed.bind(this);
        this.ws.onmessage = this.destroyed.bind(this);
        this.ws.onclose = this.destroyed.bind(this);
        this.ws.onopen = this.destroyed.bind(this);
    }

    testBreak() {
        console.log("testing a broken connectikon");
        this.ws.close();
    }

    destroyed(e) {
        console.log("destroyed", this.id);
    }

    onOpen(e) {
        console.log("onOpen -- sessionId:", this.sessionId);
        this._send({
            type: "session/establish",
            sessionId: this.sessionId,
        });
    }

    onUnauthenticated(e) {
        console.log("you should authenticate");
    }

    onSession(e) {
        const serverMessage = JSON.parse(e.data);

        if (serverMessage.type == "error/noUserError") {
            this.ws.onmessage = this.onUnauthenticated.bind(this);
            return;
        }

        console.log("onSession==msg:", serverMessage);
        this.sessionId = serverMessage?.data?.sessionId;
        console.log("onSession", this.sessionId);

        this.retryInterval = 1000;

        for (const msg of this.msgQueue) {
            console.log("delayed message:", msg);
            this._send(msg);
        }
        this.msgQueue.length = 0;

        this.userLifecycle.onOpen(e);

        console.log("switch message handler");
        this.ws.onmessage = this.onMessage.bind(this);
    }

    onMessage(e) {
        this.userLifecycle.onMessage(e);
    }

    onClose(e) {
        console.log("onClose", this.id);
        console.dir("onClose", this.id);
        this.userLifecycle.onClose(e);

        this.ws = null;

        // setup the reconnection
        //console.log("keepAlive:", this.keepAlive);
        if (this.keepAlive) {
            console.log("setting up a new connection in:", this.retryInterval, this.ws);
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
        //console.log("send", this.id);
        if (this.ws && this.ws.readyState === this.ws.OPEN) {
            this._send(msg);
        } else {
            //console.log("saving for later");
            this.msgQueue.push(msg);
        }
    }

    join(gameId) {
        this.gameId = gameId;

        console.log("join called:", gameId);

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
        //console.log("close", this.id);
        this.destroy();

        clearInterval(this.retryInterval);
        this.keepAlive = false;
        //console.log("reconnect turned off");

        if (this.ws === null) {
            // do nothing
        } else if (this.ws.readyState === this.ws.OPEN) {
            for (const msg of this.msgQueue) {
                this._send(msg);
            }
        }

        // the msg queue is lost
        this.msgQueue.length = 0;
        //console.log(this.ws.readyState);
        this.ws.close();

        this.ws = null;

        // you also might want to tear down the lifecycle methods?
        //TODO
    }

    myOnOpen() {
        //console.log("myOnOpen", this.id);
        for (const msg of this.msgQueue) {
            this._send(msg);
        }
    }
}

export default SocketConnection;
