import game_records from "./game_records.js"
import crypto from "crypto"

import fs, { promises as fsPromises } from "fs";

class GameDB {
    constructor() {
        this.sessions = {};
        this.users = {};
        this.players = {};
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

    sendToGame(gameId, msg) {
        // tell everyone that the player has joined
        for (let playerId of getPlayerIds(gameId)) {
            let ws = getSession(playerId);

            ws.send(JSON.stringify(msg));
        }
    }

    join(gameId, sessionId) {
        if (!this.contains(gameId)) { return false; }

        let game = game_records[gameId]

        return true;
        game.players = game.players || new Set();
        //game.players.add(sessionId);

        // get the player information
        let player = this.getPlayer(sessionId);

        // send the player information
        this.sendToGame(gameId, {
            type: "lobby/addPlayer",
            data: { id: player.id, name: player.name },
        });

        return true;
    }

    getPlayer(sessionId) {
        // TODO: get player object for sessionId
        // 
        console.log("get player object for :", sessionId);
        return {};
    }

    addSession(id, socket){
        this.sessions[id] = socket;
    }

    getSession(id){
        return this.sessions[id];
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
