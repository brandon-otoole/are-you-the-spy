import config from "./config.js";

import * as Actions from "./Actions.js";

// TODO: implement reconnect
// TODO: manage how messages are passed from socket to store

const WSMiddleware = () => {
    let ws = null;

    const onOpen = store => e => {
        const state = store.getState();
        console.log("on open:", state);

        ws.send(JSON.stringify({
            "type": "join",
            "data": {
                gameId:state.game.gameId,
                name: localStorage.getItem("name")
            }
        }));
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

            case 'WS_DISCONNECT':
                if (ws != null) {
                    ws.close();
                }

                ws = null;
                break;

            case 'WS_MESSAGE':
                ws.send(JSON.stringify(action.msg));
                break;

            case 'stuff':
                console.log("intercept some stuff");
                // TODO: here you can do web socket logicy things
                break;

            default:
                // skip the middleware and forward the action to the next step
                return next(action);
        }
    }
}

export default WSMiddleware();
