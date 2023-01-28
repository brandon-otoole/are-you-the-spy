import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JoinForm from './JoinForm';

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

function Home() {
    const [ id, setId ] = useState("");
    const navigate = useNavigate();

    return (
        <Box sx={{ minWidth: 275 }}>
          <Card variant="outlined">
            <CardContent>
              <div>
                <h2>Come play "Is it you?"</h2>
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
        console.log("create a new lobby")

        let body = {};

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(body),
        };

        fetch("http://localhost:3000/api/game", options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not OK');
                }

                return res;
            })
            .then(res => res.json())
            //.then(res => res.text())
            .then( res => {
                console.log(res);
                return res;
            })
            .then(
                (result) => {
                    console.log(result)
                    navigate("/" + result.id);
                },
                (error) => {
                    console.log("There was an error")
                    console.log(error)
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
