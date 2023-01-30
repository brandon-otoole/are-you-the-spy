import React from "react";
import GameDisplay from './GameDisplay';

export function gameLoader(params) {
    return params
};

class GameClass {
    constructor() {
        console.log("HELLO WORLD")
    }

    render() {
        let ws;

        this.state = { gameExists: null };

        return <GameDisplay status={this.state.gameExists}/>
    }

    componentDidMount() {
        const gameId = useLoaderData();
        console.log("MOUNT");

        ws = new WebSocket("ws://127.0.0.1:3000");

        ws.onopen = openHandler;
        ws.onmessage = messageHandler;
        ws.onclose = closeHandler;
        function openHandler(e) {
            console.log("open: ", e);
            const data = { "type": "join", "data": gameId };
            ws.send(JSON.stringify(data));
        }

        function messageHandler(e) {
            console.log("message: ", e.data);
            let msg = JSON.parse(e.data);
            if (msg.type === "granted") {
                if (msg.data === true) {
                    updateGameExists(true);
                } else {
                    updateGameExists(false);
                }
            }
        }

        function closeHandler(e) {
            console.log("close: ", e);
        }
    }

    componentDidUpdate() {
        console.log("UPDATE");
    }

    componentWillUnmount() {
        console.log("CLEANUP");
        if (ws) {
            console.log("ws exists, so closing");
            ws.close();
            ws = null;
        }
    }
}

export default GameClass;