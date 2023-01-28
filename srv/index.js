'use strict';

import config from "./config.js";
import GameDB from "./GameDB.js"

import HttpServer from "./HttpServer.js";
import SocketServer from "./SocketServer.js";

process.on('SIGINT', async function() {
    console.log("WE ARE GOING DOWN!!!");

    await GameDB.close();

    process.exit();
});


//console.log(GameDB.create());

const httpServer = HttpServer();
SocketServer(httpServer);
