import crypto from 'crypto';

class SessionStore {
    constructor() {
        this.sockets = {};
        this.users = {};
    }

    send(id, type, data) {
        if (id in this.sockets) {
            let payload = { type: type, data: data };

            this.sockets[id].send(JSON.stringify(payload));
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

    add(ws, userId) {
        let sessionId = getUniqueId(this.sockets);
        this.sockets[sessionId] = ws;
        this.users[sessionId] = userId;

        return sessionId;
    }

    remove(sessionId) {
        if (sessionId in this.sockets) {
            delete this.sockets[sessionId];

            return true
        }

        return false
    }

}

function getUniqueId(pool) {
    let id;
    do {
        id = crypto.randomBytes(16).toString('hex');
    } while (id in pool);

    return id;
}

export default new SessionStore();
