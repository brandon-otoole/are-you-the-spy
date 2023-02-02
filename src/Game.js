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
    let ws = new WebSocket("ws://127.0.0.1:3000/ws");

    return { ws: ws };
}

const fakePlayers = [
    { name:"Brandon OToole", ready: false },
    { name:"Tsan Lee", ready: true },
    { name:"Don Nguyen", ready: false },
    { name:"Vanessa Hoy", ready: false },
];

function Game(props) {
    const { gameId } = useParams();
    const { ws } = useLoaderData()
    const [ gameExists, updateGameExists ] = useState(null);

    //const [ players, changePlayers ] = useState(fakePlayers);
    const [ players, changePlayers ] = useState([]);
    const [ ready, changeReady ] = useState(false);
    //const [ thing, handler ] = useState(default);
    //const [ thing, handler ] = useState(default);

    wsSetup();

    useEffect(() => {
        let msg = {
            type: ready ? "imready" : "imnotready",
            data: { name: localStorage.getItem("name")},
        };

        if (ws.readyState === ws.OPEN) {
            ws.send( JSON.stringify(msg) );
        } else {
            // TODO: handle this more robustly
            //console.log("ws not ready:", ws.readyState);
        }

    }, [ ready ]);

    useBeforeUnload(wsCleanup);

    if (gameExists === null) {
        return <LoadingGame />;
    } else if (!gameExists) {
        return <NoGame />;
    }

    return <PreGame players={players} ready={ready} handler={changeReady}/>;

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
                updateGameExists(true);
                break;

            case 'join/deny':
                updateGameExists(false);
                break;

            case 'lobby/addPlayer':
                players.push(msg.data);
                changePlayers(players);
                break;

            case 'lobby/setPlayerReady':
                let readyCopy = JSON.parse(JSON.stringify(players));

                for (let player of readyCopy) {
                    if (player.name === msg.data.name) {
                        player.ready = true;
                    }
                }

                changePlayers(readyCopy);
                break;

            case 'lobby/setPlayerNotReady':
                let notReadyCopy = JSON.parse(JSON.stringify(players));

                for (let player of notReadyCopy) {
                    if (player.name === msg.data.name) {
                        player.ready = false;
                    }
                }

                changePlayers(notReadyCopy);
                break;

            case 'lobby/startGame':
                console.log("MESSAGE STUB: ", "lobby/startGame");
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
        //console.log("close: ", e);
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
