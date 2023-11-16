import NameForm from './NameForm';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import debug from "./debugLogger.js";

function Setup() {
    const [ name, setName ] = useState("");
    const navigate = useNavigate();

  return (
    <div className="App">
      <header>
        Please Enter your name
      </header>
      <div className="App-body">
          <NameForm name={name} updateName={setName} submitHandler={ () => nameChanged(name) }/>
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

        fetch("/api/login", options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not OK');
                }

                return res;
            })
            .then(res => res.json())
            .then( res => {
                debug.log(res);
                return res;
            })
            .then(
                async (result) => {
                    // load a new page
                    debug.log();
                    await localStorage.setItem('isSetup', true);
                    window.location.reload(false);
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
}

export default Setup;
