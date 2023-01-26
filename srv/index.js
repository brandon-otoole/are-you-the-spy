'use strict';

import config from "./config.js";

import HttpServer from "./HttpServer.js";
import SocketServer from "./SocketServer.js";

const httpServer = HttpServer();
SocketServer(httpServer);
