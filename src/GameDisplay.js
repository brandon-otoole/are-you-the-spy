import React from "react";

import PreGame from "./PreGame.js";
import NoGame from "./NoGame.js";
import LoadingGame from "./LoadingGame.js";

function GameDisplay(props) {
    const { status } = props;

    return status === null ? <LoadingGame /> :
        status ? <PreGame /> : <NoGame />
}

export default GameDisplay;
