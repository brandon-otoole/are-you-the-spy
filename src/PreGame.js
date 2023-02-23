import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import { connect } from 'react-redux'

import PreGameTable from "./PreGameTable.js";
import PlayerReady from "./PlayerReady.js";

const mapStateToProps = (state) => {
   return {
      counter: state
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      //increment: () => dispatch(increment()),
      //decrement: () => dispatch(decrement()),
      //reset: () => dispatch(reset())
   };
};

function PreGame(props) {
    const { startGameEnabled, requestStartGame } = props;

    return (
        <Box sx={{ minWidth: 275 }}>
          <Card variant="outlined">
            <CardContent>
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

export default connect(mapStateToProps, mapDispatchToProps)(PreGame);
