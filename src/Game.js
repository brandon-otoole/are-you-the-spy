import React, {useState, useEffect, componentState } from "react";
import { useParams, useLoaderData, useBeforeUnload } from 'react-router-dom';

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import PreGame from "./PreGame.js";
import NoGame from "./NoGame.js";
import LoadingGame from "./LoadingGame.js";

export function gameLoader(params) {
    let ws = new WebSocket("ws://spygame.lan/ws");

    return { ws: ws };
}

function Game(props) {
    const { gameId } = useParams();
    const { ws } = useLoaderData()

    const [ gameExists, updateGameExists ] = useState(null);

    const [ startGameState, setStartGameState ] = useState(false);
    const [ readyState, changeReady ] = useState(false);

    const [ myPlayerId, setMyId ] = useState("");
    const [ players, changePlayers ] = useState([]);

    wsSetup();

    // when the ready tic is changed
    useEffect(() => {
        let msg = { type: readyState ? "imready" : "imnotready", data: {} };

        if (ws.readyState === ws.OPEN) {
            ws.send( JSON.stringify(msg) );
        } else {
            // TODO: handle this more robustly
            //console.log("ws not ready:", ws.readyState);
        }

    }, [ readyState ]);

    useEffect(() => {
        if (!myPlayerId) { return; }

        for (let player of players) {
            if (player.id === myPlayerId) {
                if (player.ready !== readyState) {
                    changeReady(player.ready);
                }
            }
        }
    }, [ players ]);

    useBeforeUnload(wsCleanup);

    if (gameExists === null) {
        return <LoadingGame />;
    } else if (!gameExists) {
        return <NoGame />;
    }

    return <PreGame players={players} ready={readyState} handler={changeReady}
        startGameEnabled={startGameState} />;

    function openHandler(e) {
        //console.log("open: ", e);
        const msg = {
            "type": "join",
            "data": {
                gameId:gameId,
                name: localStorage.getItem("name")
            }
        };
        ws.send(JSON.stringify(msg));
    }

    let messageHandlers = {
        "join/grant": "handler",
        "join/deny": "handler",
        "lobby/addPlayer": "handler",
        "lobby/setPlayerReady": "handler",
        "lobby/setPlayerNotReady": "handler",
        "lobby/startGame": "handler",
        "game/eliminatePlayer": "handler",
    };

    function messageHandler(e) {
        //console.log("message: ", e.data);
        let msg = JSON.parse(e.data);
        switch (msg.type) {
            case 'join/grant':
                // TODO: we need to notify this player who they are

                setMyId(msg.data.myPlayerId);
                changePlayers(Object.values(msg.data.state));
                updateGameExists(true);
                break;

            case 'join/deny':
                updateGameExists(false);
                break;

            case 'lobby/addPlayer':
                let addCopy = JSON.parse(JSON.stringify(players));
                addCopy.push(msg.data);
                changePlayers(addCopy);
                break;

            case 'lobby/playerReady':
                let readyCopy = JSON.parse(JSON.stringify(players));

                for (let player of readyCopy) {
                    if (player.id === msg.data.id) {
                        player.ready = msg.data.ready;
                        //player.ready = true;
                    }
                }

                changePlayers(readyCopy);
                break;

            case 'lobby/playerNotReady':
                let notReadyCopy = JSON.parse(JSON.stringify(players));

                for (let player of notReadyCopy) {
                    if (player.name === msg.data.name) {
                        player.ready = false;
                    }
                }

                changePlayers(notReadyCopy);
                break;

            case 'lobby/enableStart':
                console.log("MESSAGE STUB: ", "lobby/enableStart");
                setStartGameState(msg.data.enabled);
                break;

            case 'game/start':
                console.log("MESSAGE STUB: ", "game/startGame");
                break;

            case 'game/eliminatePlayer':
                console.log("MESSAGE STUB: ", "game/eliminatePlayer");
                break;

        }
    }

    function closeHandler(e) {
        console.log("close: ", e);
    }

    function wsSetup() {
        ws.onopen = openHandler;
        ws.onmessage = messageHandler;
        ws.onclose = closeHandler;

        return ws;
    }

    function wsCleanup() {
        ws.close();
    }
}

export default Game;
