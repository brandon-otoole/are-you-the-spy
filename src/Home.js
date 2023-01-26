import { useState } from 'react';
import JoinForm from './JoinForm';

function Home() {
    const [ id, setId ] = useState("");

  return (
    <div className="App">
    <div>
      <h2>Come play "Is it you?"</h2>

      <div>
      <button onClick={ () => startGame(id) }>
      { id === "" ? "Create Game" : "Enter Lobby" }
      </button>
      <JoinForm id={ id } updateId={setId} />
      </div>
    </div>
    <hr/>
    </div>
  );
}

function startGame(id) {
    !id ? createLobby() : joinGame(id);
}

function createLobby() {
    console.log("create a new lobby")

    fetch("http://localhost:8080/game/new")
    .then(res => res.json())
    .then(
        (result) => {
            console.log(result)
        },
        (error) => {
            console.log("There was an error")
            console.log(error)
        }
    );
}

function joinGame(id) {
    console.log("Join: " + id)

    fetch("http://localhost:8080/game/" + id)
    .then(res => res.json())
    .then(
        (result) => {
            console.log(result)
        },
        (error) => {
            console.log("There was an error")
            console.log(error)
        }
    );
}

export default Home;
