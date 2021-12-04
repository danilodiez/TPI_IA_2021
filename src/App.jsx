import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Inicio from './components/Layouts/Body/Inicio';
import Tutorial from './components/Layouts/Body/Tutorial/Tutorial';
import TreeScreen from './components/Layouts/Body/Load/Tree/Tree';
import Datasets from './components/Layouts/Body/Datasets/Datasets';
import LoadScreen from './components/Layouts/Body/Load/LoadScreen';
import Steps from './components/Layouts/Body/Load/Steps/Steps';

function App() {
  return (
    <Router>
      <div className="m-0 p-0 row">
        <div className="col-2 p-0">
          <Menu />
        </div>
        <div className="col-10 p-0">
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
              <TreeScreen />
            </Route>
            <Route path="/steps">
              <Steps />
            </Route>
            <Route path="/datasets">
              <Datasets />
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
