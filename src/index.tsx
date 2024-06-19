import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Search from './components/Search';
import CharactersList from './components/CharactersList';

import './styles/App.scss';
import './styles/Search.scss';
import './styles/CharactersList.scss';

function App(): JSX.Element {
  return (
    <Router>
      <div className="App">
        <nav className='App__navigation-container'>
          <Link to="/">Search</Link>
          <Link to="/characters">Characters</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/characters" element={<CharactersList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

render(<App />, document.getElementById('root'));
