import config from "./config.js";

import * as Actions from "./Actions.js";

// TODO: implement reconnect
// TODO: manage how messages are passed from socket to store

const WSMiddleware = () => {
    let ws = null;
    const msgQueue = [];

    const onOpen = store => e => {
        store.dispatch(Actions.wsConnected(e.target.url));
    }

    const onClose = store => e => {
        store.dispatch(Actions.wsDisconnected());
    }

    const onMessage = store => e => {
        const msg = JSON.parse(e.data);

        store.dispatch(msg);
    }

    const onError = store => e => {
            // log the error in some way
            //console.log("error: ", e);
        };

    return store => next => action => {
        switch (action.type) {
            case 'WS_CONNECT':
                if (ws != null) {
                    ws.close();
                }

                ws = new WebSocket(action.host);

                ws.onerror = onError(store);
                ws.onmessage = onMessage(store);
                ws.onclose = onClose(store);
                ws.onopen = onOpen(store);
                break;

            case 'WS_CONNECTED':
                for (const msg of msgQueue) {
                    //console.log("delayed send:", msg);
                    ws.send(JSON.stringify(msg));
                }
                break;

            case 'WS_DISCONNECT':
                if (ws === null) {
                    // do nothing
                } else if (ws.readyState === ws.OPEN) {
                    for (const msg of msgQueue) {
                        ws.send(JSON.stringify(msg));
                    }
                }

                msgQueue.length = 0;
                ws.close();
                ws = null;
                break;

            case 'WS_DISCONNECTED':
                break;

            case 'WS_MESSAGE':
                if (ws.readyState === ws.CONNECTING) {
                    //console.log("ws is: ", "CONNECTING");
                    msgQueue.push(action.msg);
                } else if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify(action.msg));
                } else if (ws.readyState === ws.CLOSING) {
                    //console.log("ws is: ", "CLOSING");
                } else if (ws.readyState === ws.CLOSED) {
                    //console.log("ws is: ", "CLOSED");
                }
                break;

            default:
                //console.log("middleware fallthrough", action);
                // skip the middleware and forward the action to the next step
                return next(action);
        }
    }
}

export default WSMiddleware();
