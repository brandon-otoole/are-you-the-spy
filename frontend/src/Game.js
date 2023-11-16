import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux'

//import SocketConnection from "./SocketConnection.js";
import * as Actions from "./Actions.js";

import PreGame from "./PreGame.js";
import InGame from "./InGame.js";
import NoGame from "./NoGame.js";
import LoadingGame from "./LoadingGame.js";

function Game(props) {
    const { gameId } = useParams();
    const { game, wsConnect, wsMessage, wsDisconnect } = props;

    useEffect(() => {
        wsConnect("SOCKET_URL_PLACEHOLDER/ws");
        wsMessage({
            type: "join",
            data: {
                gameId: gameId,
                name: localStorage.getItem("name")
            }
        });

        return wsDisconnect;
    }, [ gameId ]);

    if (game === null) {
        return <LoadingGame />;
    } else if (game === false) {
        return <NoGame />;
    }

    return game.started === true ? <InGame /> : <PreGame />
}

const S2P = (state) => {
    return {
        game: state.game,
    };
};

const D2P = (dispatch) => {
   return {
       //handleMessage: (msg) => dispatch(msg),
       wsConnect: (host, gameId) => dispatch(Actions.wsConnect(host, gameId)),
       wsMessage: (msg) => dispatch(Actions.wsMessage(msg)),
       wsDisconnect: () => dispatch(Actions.wsDisconnect()),
   };
};

export default connect(S2P, D2P)(Game);
