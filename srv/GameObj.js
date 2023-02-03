import crypto from "crypto";

import PlayerObj from "./PlayerObj.js";
import SessionStore from "./SessionStore.js";

class GameObj {
    constructor(id) {
        // the gameId
        this.id = id;

        // this is strictly for state tracking
        this.players = {};
        // player.id
        // player.name
        // player.ready

        // this is so that we can loop through to send messages
        this.sessions = {};

        // on i'm ready messages, look up which player this is for
        // do not store user in the player hash/list
        // do not send player data on I'm Ready from the client
        this.userToPlayer = {};

        this.userToSessions = {};
    }

    removeUser(userId) {
        // look up the player from the user
        let playerId = this.userToPlayer[userId];
        delete this.userToPlayer[userId];

        delete this.players[playerId];
        // TODO: send a message to the game that the user has left the game

        for (const sessionId of this.userToSessions[userId]) {
            delete this.sessions[sessionId];
            // TODO: send a message to the sockets that they have been unjoined
        }
    }

    addSession(sessionId, name) {
        let userId = SessionStore.getUser(sessionId);

        // add the session to the sessions list
        this.sessions[sessionId] = sessionId;

        // add the session to user:sessions map
        this.userToSessions[userId] = this.userToSessions[userId] || [];
        this.userToSessions[userId].push(sessionId);

        // check to see if this user is already a player
        if ( !(userId in this.userToPlayer) ) {
            this.addPlayer(userId, name)
        }

    }

    addPlayer(userId, name) {
        let id = getUniquePlayerId(this.players);

        // add the player to the user map
        this.userToPlayer[userId] = id;

        // add the player to the players list
        this.players[id] = new PlayerObj(id, name);

        // this is a new user, send a join message to all sessions
        SessionStore.sendAll(
            Object.keys(this.sessions),
            "lobby/addPlayer",
            {
                //id: id,
                //name: this.players[id].name,
                //ready: false,
                id: this.players[id].id,
                name: this.players[id].name,
                ready: this.players[id].ready,
            }
        );
    }

    removePlayer(userId) {
        return;

        // first make sure to hold onto the playerId for now
        let playerId = this.userToPlayer[userId];

        // remove the player from the user map
        delete this.userToPlayer[userId];

        // remove the player from the players list
        delete this.players[playerId];

        // remove all the sessions for this user

        // this is a new user, send a join message to all sessions
        SessionStore.sendAll(
            Object.keys(this.sessions),
            "lobby/addPlayer",
            {
                //id: id,
                //name: this.players[id].name,
                //ready: false,
                id: this.players[id].id,
                name: this.players[id].name,
                ready: this.players[id].ready,
            }
        );

    }

}

function getUniquePlayerId(pool) {
    // create a short but unique playerId
    let id;
    do {
        id = crypto.randomBytes(3).toString('hex');
    } while (id && id in pool);

    return id;
}

export default GameObj;
