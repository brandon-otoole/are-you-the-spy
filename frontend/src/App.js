import logo from './logo.svg';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Link to="/" style={{ color: '#FFF', textDecoration: 'none' }}>Are You The Spy?</Link>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
