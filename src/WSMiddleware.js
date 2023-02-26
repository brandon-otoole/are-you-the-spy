import config from "./config.js";

import * as Actions from "./Actions.js";
import SocketConnection from "./SocketConnection.js";

// TODO: implement reconnect
// TODO: manage how messages are passed from socket to store

const WSMiddleware = () => {
    let connection = null;
    let special = "special";

    const wsLifecycle = store => ({
        onOpen: e => {
            //store.dispatch(Actions.wsConnected(e.target.url));
        },
        onClose: e => {
            //store.dispatch(Actions.wsDisconnected());
        },
        onMessage: e => {
            const msg = JSON.parse(e.data);

            store.dispatch(msg);
        },
        onError: e => {
                console.error(e);
        },
    });

    return store => next => action => {
        switch (action.type) {
            case 'WS_CONNECT':
                //console.log("ws connect");
                // create a websocket wrapper
                connection = new SocketConnection(action.host, wsLifecycle(store));
                break;

            case 'WS_CONNECTED':
                //console.log("ws connected");
                break;

            case 'WS_DISCONNECT':
                //console.log("ws disconnect");
                // destroy the websocket wrapper and tell it to close
                connection.close();
                connection = null;
                break;

            case 'WS_DISCONNECTED':
                //console.log("ws disconnected");
                // this is a pretty worthless event. set state on disconnect
                break;

            case 'WS_MESSAGE':
                //console.log("ws message");

                connection.send(action.msg);
                break;

            case 'connection/identify':
                //console.log("ws message");

                connection.identify();
                break;

            case 'connection/assignSessionId':
                console.log("assign session id", action);

                connection.setSessionId(action.data.sessionId);
                break;

            default:
                // skip the middleware and forward the action to the next step
                return next(action);
        }
    }
}

export default WSMiddleware();
