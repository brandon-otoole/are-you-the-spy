import { createServer } from 'http';
import express from 'express';
import GameDB from "./GameDB.js";
import crypto from "crypto";

import cookieParser from "cookie-parser"

export default function HttpServer() {
    const expressApp = express();

    expressApp.disable("x-powered-by");

    expressApp.use(cookieParser());

    expressApp.use(function(req, res, next) {
        console.log("user cookie middleware");
        let userId = req.cookies['userId'];
        userId = userId || crypto.randomBytes(16).toString('hex');

        req.cookies['userId'] = userId;
        res.cookie("userId", userId, { httpOnly: true, maxAge: 34560000000, sameSite: "Strict" });

        next();
    });

    expressApp.post('/login', (req, res) => {
        res.json({ login: true });
    });

    expressApp.get('/test', (req, res) => {
        res.json({ test: true });
    });

    expressApp.put('/game/:id', (req, res) => {
        let gameId = req.params.id;

        // clean up any existing state for this user

        // close and remove all sockets for this user
        // OR send them all a MOVE command

        // join the user to the game

        res.json({ join: true });
    });

    expressApp.post('/game', (req, res) => {
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
