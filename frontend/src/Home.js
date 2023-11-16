import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JoinForm from './JoinForm';

import debug from './debugLogger.js';

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";

function Home() {
    const [ id, setId ] = useState("");
    const navigate = useNavigate();

    return (
        <Box sx={{ minWidth: 275, maxWidth: 700, padding: "10px" }} display="inline-block">
          <Card variant="outlined">
            <CardContent>
              <div>
        <p>
                "Are You The Spy" is a game of social deduction. You can play with 
        as little as 3 people, but it is recommened that you play with at least
        5 people.

        </p>

        <p>
        If you have been given a game code, enter it below to join an existing game. Or if you are just getting started, create a game so that others can play.
        </p>
                <JoinForm id={ id } updateId={setId} />
              </div>
              <div>
              <Button variant="contained" onClick={ () => startGame(id) }>
                { id === "" ? "Create Game" : "Enter Lobby" }
              </Button>
              </div>
            </CardContent>
            <CardActions>
            </CardActions>
          </Card>
        </Box>
    );

    function startGame(id) {
        !id ? createLobby() : joinGame(id);
    }

    function createLobby() {
        debug.log("create a new lobby")

        let body = {};

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(body),
        };

        fetch("/api/game", options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not OK');
                }

                return res;
            })
            .then(res => res.json())
            //.then(res => res.text())
            .then( res => {
                debug.log(res);
                return res;
            })
            .then(
                (result) => {
                    debug.log(result)
                    navigate("/" + result.id);
                },
                (error) => {
                    debug.log("There was an error")
                    debug.log(error)
                }
            )
            .catch((error) => {
                console.error('there has been an error with fetch', error);
            });
    }

    function joinGame(id) {
        navigate("/" + id);
    }
}

export default Home;
