import React, {useState, useEffect, useRef, componentState } from "react";
import { useParams, useLoaderData, useBeforeUnload } from 'react-router-dom';
import { connect } from 'react-redux'
import { increment, decrement, reset } from './actions';

import config from "./config.js";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import SocketConnection from "./SocketConnection.js";
import PreGame from "./PreGame.js";
import InGame from "./InGame.js";
import NoGame from "./NoGame.js";
import LoadingGame from "./LoadingGame.js";

const mapStateToProps = (state) => {
    return {
        myPlayerId: state.myPlayerId,
        game: state.game,
    };
};

const mapDispatchToProps = (dispatch) => {
   return {
       handleMessage: (msg) => dispatch(msg),
   };
};

function Game(props) {
    const { gameId } = useParams();
    const { myPlayerId, game, handleMessage } = props;
    const { ws } = useLoaderData();

    let reconnectDelay = 0;
    let reconnectTimer;

    wsSetup();

    function requestStartGame() {
        ws.send(JSON.stringify({ type: "requestStartGame" }));
    }

    function socketReconnect() {
        console.log("reconnecting ...");
        reconnectDelay = Math.max(reconnectDelay, 1000);
        //reconnectDelay = Math.max(2*reconnectDelay, 1);

        clearTimeout(reconnectTimer);
        reconnectTimer = null;

        ws = new WebSocket("ws://" + config.host + "/ws");
        wsSetup();
    }

    useBeforeUnload(wsCleanup);

    if (game === null) {
        return <LoadingGame />;
    } else if (game === false) {
        return <NoGame />;
    }

    return game.started === true ? <InGame /> : <PreGame />

    function wsSetup() {
        ws.onopen = (e) => {
            ws.send(JSON.stringify({
                "type": "join",
                "data": { gameId:gameId, name: localStorage.getItem("name") }
            }));
        };

        ws.onmessage = (e) => {
            let msg = JSON.parse(e.data);

            // actually you just need to dispatch the action to redux
            handleMessage(msg);
        };

        ws.onclose = (e) => {
            // here you should trigger some reconnect or other cleanup
        };

        ws.onerror = (e) => {
            // log the error in some way
            console.log("error: ", e);
        };

        return ws;
    }

    function wsCleanup() {
        // TODO: not totally sure what should happen.
        // probably close the socket for real
        ws.close();
        //ws = null;
    }
}

export function gameLoader(params) {
    let ws = new WebSocket("ws://" + config.host + "/ws");
    //let wsc = new SocketConnection(config.host);

    return { ws: ws };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);

/*
    // when the ready tic is changed
    useEffect(() => {
        let msg = { type: readyState ? "imready" : "imnotready", data: {} };

        console.log("imready state effect");

        if (!ws) {
            console.log("ws does not exist yet for imready");
        } else if (ws.readyState === ws.OPEN) {
            console.log("imready state effect");
            //ws.send( JSON.stringify(msg) );
        } else {
            // TODO: handle this more robustly
            //console.log("ws not ready:", ws.readyState);
            console.log("ws is not ready yet for imready");
        }

    }, [ readyState, ws ]);

    useEffect(() => {
        console.log("players have changed:", players);

        if (!myPlayerId) { return; }

        for (let player of players) {
            if (player.id === myPlayerId) {
                if (player.ready !== readyState) {
                    changeReady(player.ready);
                }
            }
        }
    }, [ players ]);
*/
