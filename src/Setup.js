import NameForm from './NameForm';

import { useState } from 'react';

function Setup() {
    const [ name, setName ] = useState("");

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
}

async function nameChanged(name) {
    // save the name to local storage
    await localStorage.setItem('name', name);

    // load a new page
    await localStorage.setItem('isSetup', true);

    window.location.reload(false);
}

export default Setup;
