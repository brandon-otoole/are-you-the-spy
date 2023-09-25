import { useState, setState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import { connect } from 'react-redux';

import InGameTable from "./InGameTable.js";
import PlayerRole from "./PlayerRole.js";

function createData(record) {
    const ready = record.ready ? "✔" : "";
    return { id: record.id, status:ready, name:record.name, remove:"x" };
}

const S2P = (state) => {
   return {
      players: state.game.players,
      //isAlive: state.game.isAlive,
   };
};

const D2P = (dispatch) => {
   return {
      //isAliveHandler: () => dispatch({type: "IS_ALIVE"}),
   };
};

function InGame(props) {
    const { players } = props;

    let rows = props.players.map(x => createData(x));

    //const [playerReady, setPlayerReady] = useState(false);
    const playerReady = props.ready;
    const setPlayerReady = props.handler;
    const startGameEnabled = props.startGameEnabled;

    return (
        <Box sx={{ minWidth: 275 }}>
          <Card variant="outlined">
            <CardContent>
              <div>
                <h2>Game in progress</h2>
              </div>
              <div>
                <h4>Are you the spy?</h4>
              </div>

              Players
              <div align="center">
                <InGameTable rows={rows} />
              </div>
            </CardContent>
            <CardActions>
              <PlayerRole />
            </CardActions>
          </Card>
        </Box>
    );
}

export default connect(S2P, D2P)(InGame);
