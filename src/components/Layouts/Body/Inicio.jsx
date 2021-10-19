import React from 'react';
import './styles.css';
import Button from '../../Basic/Button/Button';
import { useHistory } from 'react-router';

const Inicio = () => {
  const history = useHistory();

  const redirect = () => {
    history.push("/load")
  }
 
  return (
    <div className="container-index">
      <div className="pt-4">
        <h1 className="text-center p-4 mt-4">
          Decision Tree
        </h1>
      </div>
      <hr className="m-4"/>
      <div className="text-center p-4">
        <div className="pb-5">
          <h5 className="p-2">Trabajo Practico Integrador - Inteligencia Artificial.</h5>
          <h5 className="p-2">Desarrollado con: React, Vite, Vis-Network y DanfoJS.</h5>
        </div>
        <div className="pt-5">
          <h5 className="text-center m-0">INTEGRANTES:</h5>
          <ul class="nav justify-content-center">
            <li class="nav-item">
              Dias Duarte, Nicolas
            </li>
            <li class="nav-item">
              Diez, Danilo
            </li>
            <li class="nav-item">
              Rouvier, Selene
            </li>
            <li class="nav-item">
              Troncoso, Mariano
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center">
        <Button
          text="Iniciar"
          type="info"
          size="lg"
          style={{ color: 'black' }}
          onClick={redirect}
        />
      </div>
    </div>
  );
};

export default Inicio;