'use strict';

import GameDB from "./GameDB.js"

import HttpServer from "./HttpServer.js";
import SocketServer from "./SocketServer.js";

async function cleanUp() {
    console.log('shutting down...');
    await GameDB.close();
    process.exit()
}

process.on('SIGTERM', cleanUp);
process.on('SIGINT', cleanUp);

//console.log(GameDB.create());

const httpServer = HttpServer();
SocketServer(httpServer);
