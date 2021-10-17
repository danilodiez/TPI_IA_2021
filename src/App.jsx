import React from 'react';
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
import Tree from './components/Layouts/Body/Tree/Tree';
import Samples from './components/Layouts/Body/Samples/Samples';
import Button from './components/Basic/Button/Button';
import LoadScreen from './components/Layouts/Body/Load/LoadScreen';

function App() {
  return (
    <Router>
      <div className="container-fluid m-0 p-0 row">
        <div className="col-3 p-0">
          <Menu />
          <Button
            text="test text"
            type="success"
            size="lg"
            style={{ color: 'lightGray' }}
          />
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
