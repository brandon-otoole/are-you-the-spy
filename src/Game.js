import config from "./config.js";

import { useEffect } from 'react';
import { useParams, useLoaderData, useBeforeUnload } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux'
//import { increment, decrement, reset } from './actions';

//import SocketConnection from "./SocketConnection.js";
import * as Actions from "./Actions.js";

import PreGame from "./PreGame.js";
import InGame from "./InGame.js";
import NoGame from "./NoGame.js";
import LoadingGame from "./LoadingGame.js";

function Game(props) {
    const { gameId } = useParams();
    const { game, setGameId, wsConnect, wsJoin, wsDisconnect } = props;

    wsSetup();
    function wsSetup() {
        // TODO: connect and join
    }

    useEffect(() => {
        setGameId(gameId);
        wsConnect("ws://" + config.host + "/ws");

        return () => {
            wsDisconnect();
        };
    }, [ ]);

    useBeforeUnload(wsCleanup);
    function wsCleanup() {
        // TODO: not totally sure what should happen.
        // probably close the socket for real
    }

    if (game === null) {
        return <LoadingGame />;
    } else if (game === false) {
        return <NoGame />;
    }

    return game.started === true ? <InGame /> : <PreGame />
}

export function gameLoader(params) {
    // TODO: connect the socket

    //return { gameId: params.gameId };
    return {};
}

const S2P = (state) => {
    return {
        game: state.game,
    };
};

const D2P = (dispatch) => {
   return {
       //handleMessage: (msg) => dispatch(msg),
       setGameId: (gameId) => dispatch(Actions.setGameId(gameId)),
       wsConnect: (host, gameId) => dispatch(Actions.wsConnect(host, gameId)),
       wsJoin: () => dispatch(Actions.wsJoin()),
       wsDisconnect: () => dispatch(Actions.wsDisconnect()),
   };
};

export default connect(S2P, D2P)(Game);
