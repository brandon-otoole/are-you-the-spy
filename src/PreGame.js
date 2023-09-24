import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import { connect } from 'react-redux'

import Disconnect from "./Disconnect.js";

import PreGameTable from "./PreGameTable.js";
import PlayerReady from "./PlayerReady.js";

const S2P = (state) => {
   return {
      startGameEnabled: state.game.enabled,
   };
};

const D2P = (dispatch) => {
   return {
       requestStartGame: () => dispatch({
           type: "WS_MESSAGE",
           msg:{ type: "requestStartGame" }
       }),
   };
};

function PreGame(props) {
    const { startGameEnabled, requestStartGame } = props;

    return (
        <Box sx={{ minWidth: 275 }}>
          <Card variant="outlined">
            <CardContent>
                <Disconnect />
              <div>
                <h2>Is it you?</h2>
              </div>

              Players
              <div align="center">
                <PreGameTable />
              </div>
            </CardContent>
            <CardActions>
              <PlayerReady />

              <Button variant="contained" disabled={!startGameEnabled}
                      onClick={requestStartGame}>
                Start Game
              </Button>
            </CardActions>
          </Card>
        </Box>
    );
}

export default connect(S2P, D2P)(PreGame);
