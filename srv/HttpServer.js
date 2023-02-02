import { createServer } from 'http';
import express from 'express';
import GameDB from "./GameDB.js";
import cors from "cors";
import crypto from "crypto";

import cookieParser from "cookie-parser"

export default function HttpServer() {
    const expressApp = express();

    expressApp.use(cookieParser());

    expressApp.use(cors({
        origin: 'http://localhost:8080'
    }));

    expressApp.use(function(req, res, next) {
        let userId = req.cookies['userId'];
        if (!userId) {
            userId = crypto.randomBytes(16).toString('hex');
            req.cookies['userId'] = userId;
            res.cookie("userId", userId, { httpOnly: true });
        }

        next();
    });

    expressApp.get('/login', (req, res) => {
        res.json({ login: true });
    });

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
