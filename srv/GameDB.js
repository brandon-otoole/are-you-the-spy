import game_records from "./game_records.js"
import crypto from "crypto"

import GameObj from "./GameObj.js"
import SessionStore from "./SessionStore.js"

import fs, { promises as fsPromises } from "fs";

class GameDB {
    constructor() {
        // there is a map of userId to user objects
        // key: userId
        // value: user object
        //this.users = {};
        // TODO: we may not need this

        // there is a map of gameId to game objects
        // key: gameId
        // value: game object
        this.games = {};
        this.games["1234"] = new GameObj("1234");
        this.games["asdf"] = new GameObj("asdf");
        // TODO: we need to find a better way to load in the game data
        for (const [id, game] of Object.entries(game_records)) {
            this.games[id] = new GameObj(id);
        }

        // a session is strictly tied to one user
        this.sessionToUser = {};

        // a session is strictly tied to one game
        this.sessionToGame = {};
    }

    create() {
        let id;
        do {
            id = crypto.randomBytes(3).toString('hex');
        } while (id && id in this.games);

        this.games[id] = new GameObj(id);

        return id;
    }

    contains(id) {
        return id in this.games;
    }

    find(id) {
        return this.games[id];
    }

    async close() {
        let data = "export default " + JSON.stringify(this.games, null, 4);

        console.log(data);

        // TODO: delete all session inormation and close all sockets

        await fsPromises.writeFile("./game_records.js", data);
    }

    sendToGame(gameId, msg) {
        // tell everyone that the player has joined
        for (let playerId of getPlayerIds(gameId)) {
            //let ws = getSession(playerId);

            ws.send(JSON.stringify(msg));
        }
    }

    join(sessionId, gameId, name) {
        if (!this.contains(gameId)) { return false; }

        //this.unjoin(sessionId);

        // update the session to gameId
        this.sessionToGame[sessionId] = gameId;


        const game = this.games[gameId];


        // update the game
        let newPlayer = game.addSession(sessionId, name);


        SessionStore.send(sessionId, "join/grant", true);

        return true;
    }

    unjoin(sessionId) {
        // find out what user this is for
        const userId = this.sessionToUser[sessionId];

        // find out what game this is for
        const gameId = this.sessionToGame[sessionId];
        const game = this.games[gameId];
        game.removePlayer(userId);

        // remove stuff
        const player = game.players[userId];
        delete game.players[userId];
    }

    imReady(sessionId) {
        // find the player from the userId
        // update the player state to ready
        // broadcast to all sockets
    }

    imNotReady(sessionId) {
        // find the player from the userId
        // update the player state to not ready
        // broadcast to all sockets
    }

    playerNotReady(sessionId, playerId) {
        // update the player state to not ready
        // broadcast to all sockets
    }

    getPlayer(sessionId) {
        // TODO: get player object for sessionId
        // 
        console.log("get player object for :", sessionId);
        return {};
    }

    getPlayer(id) {
        return this.players[id];
    }

    getPlayerIds(gameId) {
        let players = [];
        if (!this.contains(gameId)) { return players }

        // get the players
    }
}

export default new GameDB();
