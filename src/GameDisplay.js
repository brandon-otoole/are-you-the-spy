import React from "react";

function GameDisplay(props) {
    const { status } = props;
        return (
            <div className="App">
              { status === null ? "loading..." :
              status ? "game Exists" : "no game found" }
            </div>);
}

export default GameDisplay;
