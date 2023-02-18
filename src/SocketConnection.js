class SocketConnection {
    constructor(host) {
        this.host = host;

        this.ws = new WebSocket("ws://" + host + "/ws");
        this.setup
    }
}

export default SocketConnection;
