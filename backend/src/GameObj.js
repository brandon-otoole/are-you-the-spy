import crypto from "crypto";

import PlayerObj from "./PlayerObj.js";
import SessionStore from "./SessionStore.js";

class GameObj {
    static factory(game) {
        let newGame = new GameObj(game.id);

        newGame.started = game.started;
        newGame.players = game.players;
        newGame.userToPlayer = game.userToPlayer;

        return newGame;
    }

    constructor(id) {
        // the gameId
        this.id = id;

        // flag to track if the game is started
        this.started = false;

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

    isStarted() {
        return this.started;
    }

    enableStart() {
        return this.getReadyCount() >= 2;
    }

    getReadyCount() {
        return Object.values(this.players).filter(p => p.ready).length;
    }

    /*
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
    */

    addSession(sessionId, name) {
        let userId = SessionStore.getUser(sessionId);

        // add the session to the sessions list
        this.sessions[sessionId] = sessionId;

        // add the session to user:sessions map
        this.userToSessions[userId] = this.userToSessions[userId] || [];
        this.userToSessions[userId].push(sessionId);

        if (!(userId in this.userToPlayer)) {
            // add the player to the user map
            this.addPlayer(userId, name);
        }

        let playerId = this.userToPlayer[userId];

        return this.players[playerId];
    }

    addPlayer(userId, name) {
        let id = getUniquePlayerId(this.players);

        // add the player to the user map
        this.userToPlayer[userId] = id;

        // add the player to the players list
        this.players[id] = new PlayerObj(id, name);

        // this is a new user, send a join message to all sessions
        this.broadcast( "lobby/addPlayer", {
            id: this.players[id].id,
            name: this.players[id].name,
            ready: this.players[id].ready,
        });

        return this.players[id];
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
        this.broadcast("lobby/removePlayer", { id: playerId });
    }

    setPlayerReady(playerId, ready) {
        console.log("OBJ set ready: ", playerId, ready);
        if (this.players[playerId].ready == ready) {
            return;
        }

        this.players[playerId].ready = ready;

        this.broadcast("lobby/playerReady", {
            id: this.players[playerId].id,
            ready: this.players[playerId].ready
        });

        // tell the clients if game start requirements have been met
        this.broadcast("lobby/enableStart", { enabled: this.enableStart() });
    }

    requestStartGame(userId, sessionId, playerId) {
        this.started = true;

        // check if the requesting user is subscribed to this game
        //TODO

        // check if the requesting player is ready
        //TODO

        // check if the game has enough people
        //TODO

        // run the logic on the new game

        // create a list of players who are marked as ready
        let characterIds = Object.values(this.players)
            .filter(x => x.ready)
            .map(x => x.id);

        // randomly pick a main character
        let theOne = Math.floor(Math.random() * characterIds.length);

        // randomly pick a different character from the remaining players
        let theOther;
        do {
            theOther = Math.floor(Math.random() * characterIds.length);
        } while (theOther == theOne)

        // randomly pick a player to be the spy
        let theSpy = Math.floor(Math.random() * characterIds.length);

        this.theOne = characterIds[theOne];
        this.theOther = characterIds[theOther];
        this.theSpy = characterIds[theSpy];

        // update the private player info
        for (const player of Object.values(this.players)) {
            if (player.id == this.theSpy) {
                player.role = this.players[this.theOne].name;
            } else {
                player.role = this.players[this.theOther].name;
            }
        }

        // let players know a game has started
        let type = 'game/start';
        for (const [userId, playerId] of Object.entries(this.userToPlayer)) {
            let player = this.players[playerId];
            for (let sessionId of this.userToSessions[userId]) {
                SessionStore.send(sessionId, 'game/start', {role: player.role});
            }
        }

        for (const id of Object.keys(this.sessions)) {
        }
    }

    requestSecret(userId, sessionId) {
        let data = { role: 'spectator' };

        let player = userToPlayer[userId];
        if (player.ready && player.id == this.theSpy) {
            data.role = this.theOther;
        } else if (player.ready) {
            data.role = this.theOne;
        }

        SessionStore.send(sessionId, "game/secret", data);
    }

    state() {
        return JSON.parse(JSON.stringify(this.players));
    }

    broadcast(type, data) {
        SessionStore.sendAll(Object.keys(this.sessions), type, data);
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
