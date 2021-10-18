import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Inicio from './components/Layouts/Body/Inicio';
import Tutorial from './components/Layouts/Body/Tutorial/Tutorial';
import Tree from './components/Layouts/Body/Tree/Tree';
import Samples from './components/Layouts/Body/Samples/Samples';
import DragAndDrop from './components/Layouts/Body/Load/DragAndDrop';

function App() {

  return (
    <Router>
      <div className="container-fluid m-0 p-0 row">
        <div className="col-3 p-0">
          <Menu />
        </div>
        <div className="col-9 p-0">
          <Switch>
            <Route path="/index">
              {/* <Inicio /> */}
              <DragAndDrop />
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
