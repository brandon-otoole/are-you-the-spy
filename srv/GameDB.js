import game_records from "./game_records.js"
import crypto from "crypto"

import fs, { promises as fsPromises } from "fs";

class GameDB {
    constructor() {
    }

    create() {
        let id = crypto.randomBytes(3).toString('hex');

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

        await fsPromises.writeFile("./game_records.js", data);
    }
}

export default new GameDB();
