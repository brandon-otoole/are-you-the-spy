import React, {useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import GameDisplay from './GameDisplay';

function Game(props) {
    let ws;
    const { gameId } = useParams();

    const [ gameExists, updateGameExists ] = useState(null);

    useEffect(effectHandler(ws));

    return <GameDisplay status={gameExists}/>

    function effectHandler() {
        if (!ws) { wsSetup() }
        return wsCleanup;
    }

    function openHandler(e) {
        console.log("open: ", e);
        const data = { "type": "join", "data": "asdf" };
        ws.send(JSON.stringify(data));
    }

    function messageHandler(e) {
        console.log("message: ", e);
        let msg = JSON.parse(e);
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

    function wsSetup() {
        ws = new WebSocket("ws://127.0.0.1:3000");

        ws.onopen = openHandler;
        ws.onmessage = messageHandler;
        ws.onclose = closeHandler;
    }

    function wsCleanup() {
        if (ws) {
            ws.close();
            ws = null;
        }
    }
}

export default Game;
