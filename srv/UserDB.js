import records from "./datastore.js"
import crypto from "crypto"

import fs, { promises as fsPromises } from "fs";

// list of records needed
//  * map of { rooms: data }
//  * map of { serverId: data } --> includes clientId
//  * map of { clientId: serverId }
//  *
//  *
//  *
//  *

class Datastore {
    constructor() {
    }

    create() {
        let id = crypto.randomBytes(3).toString('hex');

        records[id] = {};

        return id;
    }

    contains(id) {
        return id in records;
    }

    find(id) {
        return records[id];
    }

    async close() {
        let data = "export default " + JSON.stringify(records, null, 4);

        console.log(data);

        await fsPromises.writeFile("./datastore.js", data);
    }
}

export default new Datastore();
