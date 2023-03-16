import logo from './logo.svg';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      header image
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
