import { useState, setState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import PreGameTable from "./PreGameTable.js";
import PlayerReady from "./PlayerReady.js";

function createData(record) {
    const ready = record.ready ? "✔" : "";
    return { id: record.id, status:ready, name:record.name, remove:"x" };
}

function PreGame(props) {
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
                <h2>Is it you?</h2>
              </div>

              Players
              <div align="center">
                <PreGameTable rows={rows} />
              </div>
            </CardContent>
            <CardActions>
              <PlayerReady ready={playerReady} handler={setPlayerReady}/>

              <Button variant="contained" disabled={!startGameEnabled}>
                Start Game
              </Button>
            </CardActions>
          </Card>
        </Box>
    );
}

export default PreGame;
