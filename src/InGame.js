import { useState, setState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import InGameTable from "./InGameTable.js";
import PlayerRole from "./PlayerRole.js";

function createData(record) {
    const ready = record.ready ? "✔" : "";
    return { id: record.id, status:ready, name:record.name, remove:"x" };
}

function InGame(props) {
    let players = props.players;
    let playerRole = props.playerRole;
    let isAlive = props.isAlive;
    let isAliveHandler = props.handler;

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
                <h2>In Game Table</h2>
              </div>

              Players
              <div align="center">
                <InGameTable rows={rows} />
              </div>
            </CardContent>
            <CardActions>
              <PlayerRole playerRole={playerRole} />
            </CardActions>
          </Card>
        </Box>
    );
}

export default InGame;
