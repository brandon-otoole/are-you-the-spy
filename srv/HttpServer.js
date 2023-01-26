import { createServer } from 'http';
import express from 'express';

export default function HttpServer() {
    const expressApp = express();

    expressApp.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    const server = createServer(expressApp);
    server.listen(process.env.PORT || 3000, '127.0.0.1',  () => {
        let host = server.address().address;
        let port = server.address().port;

        console.log('SpyGame Websocket listening: http://%s:%s', host, port);
    });

    return server;
}
