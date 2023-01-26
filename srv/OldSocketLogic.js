function createWSServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"],
        }
    });

    io.on('connection', (socket) => {
        let client = makeClient(socket);

        socket.on('subscribe', client.subscribe);
    });

    // initially we will just have one global history.
    function makeClient(socket) {
        let id = Math.floor(Math.random()*2147483647);
        let history;
        let room;
        let socketId = socket.id;

        let message = function(msg) {
            // log the messages into history;
            if (msg.action === 'fullStroke') {
                console.log("YOU DON'T NEED fullStroke");
            } else if (msg.action === 'newStroke') {
                if (msg.data._type !== 'pen') { return; }

                history.newStroke(msg.data);
            } else if (msg.action === 'addStroke') {
                if (!history.has(msg.data.id)) { return; }

                let [x, y] = msg.data.point;
                let [tiltX, tiltY] = msg.data.tilt || [undefined, undefined];

                history.addStroke(msg.data.id, x, y, tiltX, tiltY);
            } else if (msg.action === 'endStroke') {
                if (!history.has(msg.data.id)) { return; }
                history.endStroke(msg.data.id);
            } else if (msg.action === 'clear') {
                //history.add(msg);
                history.clearScreen();
            } else if (msg.action === 'undo') {
                history.undo();
            } else if (msg.action === 'redo') {
                history.redo();
            } else if (msg.action === 'tryErase') {
                return;
            } else if (msg.action === 'removeStroke') {
                history.remove(msg.data);
            } else if (msg.action === 'debug') {
                console.log("debug");
                console.log(history.readOnlyHistory);
            }

            // Debug for tracking room messages
            //console.log(room, socket.id, msg.action)
            socket.to(room).emit('message', msg);
        }

        let sync = function(msg) {
            if (msg.action === 'push') {
                // Debug for watching sync messages
                console.log("push");
            } else if (msg.action === 'pull') {
                socket.send({ action: 'push', data: history.pickled });
            }
        }

        let subscribe = function(rm) {
            let room = "test";
            //room = rm in historyHash ? rm : socket.id;
            //history = rm in historyHash ? historyHash[rm] : new History();

            // Debug for watching subscribe messages and flow
            //console.log("subscribe to:", room, socket.id);
            socket.join(room);
            socket.on('message', message.bind(this));
            socket.on('sync', sync.bind(this));

            sync({ action: 'pull' });
        }

        return {
            subscribe: subscribe,
            message: message,
            sync: sync,
        }
    }
}
