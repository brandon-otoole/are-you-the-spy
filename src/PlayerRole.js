import { useState } from "react";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function PlayerRole(props) {
    let playerRole = props.playerRole;

    let [ready, setReadyState] = useState(false);

    return (
        <FormGroup>
        <FormControlLabel control={
            <Switch checked={ready} onChange={(e) => setReadyState(e.target.checked)}/>
        } label={ ready ? playerRole : "Show my secret info" }/>
        </FormGroup>
    );

}

export default PlayerRole;
