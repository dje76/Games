import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import Snake from './components/Snake/Snake.js';
import Home from './components/Home.js';
import Minesweeper from './components/Minesweeper/Minesweeper.js';
import Checkers from './components/Checkers/Checkers.js';
import Onitama from './components/Onitama/Onitama.js';
import Othello from './components/Othello/Othello.js';
import HeyThatsMyFish from './components/HeyThatsMyFish/HeyThatsMyFish.js';
import LostCities from './components/LostCities/LostCities.js';
import RollingVillage from './components/RollingVillage/RollingVillage.js';

import {
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">Games</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/Snake">Snake</Nav.Link>
          <Nav.Link as={Link} to="/Minesweeper">Minesweeper</Nav.Link>
          <Nav.Link as={Link} to="/Checkers">Checkers</Nav.Link>
          <Nav.Link as={Link} to="/Onitama">Onitama</Nav.Link>
          <Nav.Link as={Link} to="/Othello">Othello</Nav.Link>
          <Nav.Link as={Link} to="/HeyThatsMyFish">Hey That's My Fish!</Nav.Link>
          <Nav.Link as={Link} to="/LostCities">Lost Cities</Nav.Link>
          <Nav.Link as={Link} to="/RollingVillage">Rolling Village</Nav.Link>
        </Nav>
      </Navbar>
      <Switch>
        <Route path="/Snake">
          <Snake />
        </Route>
        <Route path="/Minesweeper">
          <Minesweeper />
        </Route>
        <Route path="/Checkers">
          <Checkers />
        </Route>
        <Route path="/Onitama">
          <Onitama />
        </Route>
        <Route path="/Othello">
          <Othello />
        </Route>
        <Route path="/HeyThatsMyFish">
          <HeyThatsMyFish />
        </Route>
        <Route path="/LostCities">
          <LostCities />
        </Route>
        <Route path="/RollingVillage">
          <RollingVillage />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

    </div>
  );
}

export default App;
