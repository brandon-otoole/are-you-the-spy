import game_records from "./game_records.js"
import crypto from "crypto"

import fs, { promises as fsPromises } from "fs";

class GameDB {
    constructor() {
        this.sessions = {};
        this.users = {};
    }

    create() {
        let id = crypto.randomBytes(3).toString('hex');
        // TODO: make sure that this id doesn't exist already

        game_records[id] = {};

        return id;
    }

    contains(id) {
        return id in game_records;
    }

    find(id) {
        return game_records[id];
    }

    async close() {
        let data = "export default " + JSON.stringify(game_records, null, 4);

        console.log(data);

        // TODO: delete all session inormation and close all sockets

        await fsPromises.writeFile("./game_records.js", data);
    }

    join(gameId, sessionId) {
        if (!this.contains(gameId)) { return false; }

        let game = game_records[gameId]

        game.players = game.players || new Set();
        game.players.add(sessionId);

        return true;
    }

    addSession(id, socket){
        this.sessions[id] = socket;
    }

    getSession(id){
        return this.sessions[id];
    }

    getPlayerIds(gameId) {
        let players = [];
        if (!this.contains(gameId)) { return players }

        // get the players
    }
}

export default new GameDB();
