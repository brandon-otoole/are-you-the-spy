import { createServer } from 'http';
import express from 'express';
import GameDB from "./GameDB.js";
import cors from "cors";

import cookieParser from "cookie-parser"

export default function HttpServer() {
    const expressApp = express();

    expressApp.use(cookieParser());

    expressApp.use(cors({
        origin: 'http://localhost:8080'
    }));

    expressApp.post('/api/game', (req, res) => {
        let id = GameDB.create();
        console.log("create a new game: ", id);

        res.json({ id: id });
    });

    const server = createServer(expressApp);
    server.listen(process.env.PORT || 3000, '127.0.0.1',  () => {
        let host = server.address().address;
        let port = server.address().port;

        console.log('SpyGame Websocket listening: http://%s:%s', host, port);
    });

    return server;
}
