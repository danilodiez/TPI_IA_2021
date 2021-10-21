import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Inicio from './components/Layouts/Body/Inicio';
import Tutorial from './components/Layouts/Body/Tutorial/Tutorial';
import Tree from './components/Layouts/Body/Tree/Tree';
import Samples from './components/Layouts/Body/Samples/Samples';
import LoadScreen from './components/Layouts/Body/Load/LoadScreen';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {


  return (
    <Router>
      <div className="container-fluid m-0 p-0 row">
        <div className="col-3 p-0">
          <Menu />
        </div>
        <div className="col-9 p-0 bg-light">
          <Switch>
            <Route path="/index">
              <Inicio />
            </Route>
            <Route path="/load">
              <LoadScreen />
            </Route>
            <Route path="/tutorial">
              <Tutorial />
            </Route>
            <Route path="/tree">
              <Tree />
            </Route>
            <Route path="/samples">
              <Samples />
            </Route>
            <Route path="/">
              <Redirect to="/index" />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
