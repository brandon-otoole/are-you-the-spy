// react imports
import { useEffect, useState } from "react";
import { connect } from 'react-redux'

// UI imports
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function PlayerReady(props) {
    const { ready, handler } = props;

    const [ switchState, setSwitchState ] = useState(ready);

    useEffect(() => {
        setSwitchState(ready);
    }, [ ready ]);

    function toggle(e) {
        // update the switch state
        setSwitchState(e.target.checked);

        // call the handler and dispatch a new state
        handler(e.target.checked);
    };

    return (
        <FormGroup>
        <FormControlLabel control={
            <Switch checked={switchState} onClick={toggle}/>
        } label={ ready ? "I'm ready!" : "Are you ready?" }/>
        </FormGroup>
    );

}

const S2P = (state) => {
    const id = state.game.myPlayerId;
    const [player] = state.game.players.filter((x) => x.id === id);

    const ready = player ? player.ready : false;

    return {
        ready: ready,
    }
};

const D2P = (dispatch) => ({
    handler: (ready) => {
        return dispatch({
            type: "WS_MESSAGE",
            msg: { type: ready ? "imReady" : "imNotReady" },
        });
    }
});

export default connect(S2P, D2P)(PlayerReady);
