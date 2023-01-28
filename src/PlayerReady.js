import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function PlayerReady(props) {
    let ready = props.ready;
    let handler = props.handler;

    return (
        <FormGroup>
        <FormControlLabel control={
            <Switch checked={ready} onChange={(e) => handler(e.target.checked)}/>
        } label={ ready ? "I'm ready!" : "Are you ready?" }/>
        </FormGroup>
    );

}

export default PlayerReady;
