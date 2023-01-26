import logo from './logo.svg';

import { useRouteError } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    console.error(error);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Oops! There was an Error.
        </p>
      </header>
    </div>
  );
}

export default ErrorPage;
