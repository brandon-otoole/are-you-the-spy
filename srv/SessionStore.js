import crypto from 'crypto';

class SessionStore {
    constructor() {
        // TODO we need to track both sessions and connections
        // while both types of ids track sessions of the same lifetime, one
        // tracks the information shared with a client and one tracks the
        // private session identity within the server

        // a session is an internal facing id
        this.sessions = {};

        // a connection is an external facing id
        this.userAndClientToSession = {};

        // an instance is an external facing id

        this.users = {};
    }

    send(id, type, data) {
        if (id in this.sessions) {
            let payload = { type: type, data: data };

            this.sessions[id].send(JSON.stringify(payload));
        }
    }

    sendAll(ids, type, data) {
        for (const id of ids) {
            this.send(id, type, data);
        }
    }

    getUser(sessionId) {
        return this.users[sessionId];
    }

    getSyncState(sessionId) {
        console.log("you need to get sync state");
        return {};
    }

    // when a client would like to reconnect
    // TODO change sessionId to clientSessionId
    update(clientSessionId, ws, userId) {
        // combine the userId and sessionId and lookup a sessionId
        let userClientKey = userId + ":" + clientSessionId;

        // look up the user's active sessions for this clientSessionId
        let sessionId = this.userAndClientToSession[userClientKey];

        // stop if the user is not recognized
        if (!sessionId)  {
            console.log("there is no client session for this user");
            return {};
        }

        // assert: at this point sessionId is verified and exists

        // try to close the old websocket
        let oldSocket = this.sessions[sessionId];
        oldSocket.close();

        // update the session socket
        this.sessions[sessionId] = ws;

        // pass back the clientSession to indicate success
        return { clientSessionId, sessionId };
    }

    // when a new client is seen for the first time
    add(ws, userId) {
        // generate a unique client and session id
        let sessionId = getUniqueId(this.sessions);
        let clientSessionId = getUniqueId(this.userAndClientToSession, userId);

        // combine the userId and sessionId and lookup a sessionId
        let userClientKey = userId + ":" + clientSessionId;

        // map the sessionid to the ws
        this.sessions[sessionId] = ws;

        // map the client and session id for later reconnect attempts
        this.userAndClientToSession[clientSessionId] = sessionId;

        // store the user for this session in case it is needed later
        this.users[sessionId] = userId;

        // pass back the clientSession to indicate success
        console.log("add:", clientSessionId, sessionId);
        return { clientSessionId, sessionId };
    }

    remove(sessionId) {
        if (sessionId in this.sessions) {
            delete this.sessions[sessionId];

            return true
        }

        return false
    }

}

export function getUniqueId(pool, prefix, suffix) {
    let id, key;

    do {
        id = crypto.randomBytes(16).toString('hex');
        key = (prefix ? prefix + ":" : "") + id + (suffix ? ":" + suffix : "");
    } while (key in pool);

    return id;
}

export default new SessionStore();
