import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        ready: state.game.ready,
    };
};

const mapDispatchToProps = (dispatch) => {
   return {
       handler: (ready) => dispatch({
           type: "stuff",
           data: ready,
       }),
   };
};

function PlayerReady(props) {
    const { ready, handler } = props;

    return (
        <FormGroup>
        <FormControlLabel control={
            <Switch checked={ready} onClick={(e) => {
                handler(e.target.checked)
            }
            }/>
        } label={ ready ? "I'm ready!" : "Are you ready?" }/>
        </FormGroup>
    );

}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerReady);
