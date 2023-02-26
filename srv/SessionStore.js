import crypto from 'crypto';

class SessionStore {
    constructor() {
        this.sessions = {};
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

    update(sessionId, ws, userId) {
        // don't allow clients to specify their own session info
        if (!(sessionId in this.sessions) || !(sessionId in this.users)) {
            return;
        }

        // don't allow sessions to be taken over by different users
        if (userId !== this.users[sessionId]) {
            return;
        }

        // try to close the old websocket
        let oldSocket = this.sessions[sessionId];
        oldSocket.close();

        // update the session socket
        this.sessions[sessionId] = ws;

        // pass back the sessionId to indicate success
        return sessionId;
    }

    add(ws, userId) {
        let sessionId = getUniqueId(this.sessions);
        this.sessions[sessionId] = ws;
        this.users[sessionId] = userId;

        return sessionId;
    }

    remove(sessionId) {
        if (sessionId in this.sessions) {
            delete this.sessions[sessionId];

            return true
        }

        return false
    }

}

export function getUniqueId(pool) {
    let id;
    do {
        id = crypto.randomBytes(16).toString('hex');
    } while (id in pool);

    return id;
}

export default new SessionStore();
