import { useState } from "react";

import { connect } from 'react-redux';

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function PlayerRole(props) {
    let { playerRole } = props;

    let [ready, setReadyState] = useState(false);

    return (
        <FormGroup>
        <FormControlLabel control={
            <Switch checked={ready} onChange={(e) => setReadyState(e.target.checked)}/>
        } label={ ready ? playerRole : "Show my secret info" }/>
        </FormGroup>
    );

}

const S2P = (state) => {
   return {
      playerRole: state.game.playerRole,
   };
};

const D2P = (dispatch) => {
   return {
       requestSecret: () => dispatch({
           type: "WS_MESSAGE",
           msg: { type: "requestSecret" },
       }),
   };
};

export default connect(S2P, D2P)(PlayerRole);
