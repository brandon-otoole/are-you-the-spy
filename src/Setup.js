import NameForm from './NameForm';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from "./config.js";

function Setup() {
    const [ name, setName ] = useState("");
    const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-headerr">
        Please Enter your name
      </header>
      <div className="App-body">
          <NameForm name={name} updateName={setName} />
      </div>

      <button onClick={ () => nameChanged(name) }>
        Save
      </button>
    </div>
  );

async function nameChanged(name) {
        // save the name to local storage
        await localStorage.setItem('name', name);

        let options = {
            method: 'POST',
            headers: { 'Content-Type': "application/json", },
            body: JSON.stringify({}),
        };

        //fetch("http://spygame.lan/api/login", options)
        fetch("http://" + config.host + "/api/login", options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not OK');
                }

                return res;
            })
            .then(res => res.json())
            .then( res => {
                console.log(res);
                return res;
            })
            .then(
                async (result) => {
                    // load a new page
                    console.log();
                    await localStorage.setItem('isSetup', true);
                    window.location.reload(false);
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
}

export default Setup;

