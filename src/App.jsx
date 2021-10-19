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
import Tree from './components/Layouts/Body/Tree/Tree';
import Samples from './components/Layouts/Body/Samples/Samples';

import Button from './components/Basic/Button/Button';
import Modal from './components/Basic/Modal/Modal';

function App() {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Router>
      <div className="container-fluid m-0 p-0 row">
        <div className="col-3 p-0">
          <Menu />
          <Button text="open modal" onClick={openModal} />
          <Modal
            isOpen={modalIsOpen}
            closeModal={closeModal}
            message="ERROR AL INTENTAR SUBIR EL ARCHIVO"
          />
        </div>
        <div className="col-9 p-0">
          <Switch>
            <Route path="/index">
              <Inicio />
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
