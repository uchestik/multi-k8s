import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Fib from './fib';
import OtherPage from './otherPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Fib calculator
          </p>
        </header>
        <Link to='/'>Home</Link>
        <Link to='/otherpage'>Other page</Link>
        <div>
            <Route exact path='/' component={Fib} />
            <Route exact path='/otherpage' component={OtherPage} />
          </div>
      </div>
    </Router>
  );
}

export default App;
