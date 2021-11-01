import React from 'react';
import './styles.css';
import animals from '../../../../data/animals.txt'

const Datasets = () => {

  return (
    <div className="container-datasets">
      <div className="pt-4">
        <h1 className="text-center p-4 mt-4">
          Datasets de prueba
        </h1>
      </div>
      <div className="p-4 text-center">
        <h5>A continuacion dejaremos algunos datasets descargables que pueden utilizar para realizar pruebas.</h5>
        <h5>Los mismos poseen diferentes variantes, los cuales sirven para ver el comportamiento del algoritmo en diferentes casos.</h5>
      </div>
      <div className="col-12 row mt-4">
        <div className="col-4 text-center download">
          <a href="'../../../../data/ej1.txt'" download>
            Ej1 Cátedra
          </a>
        </div>
        <div className="col-4 text-center download">
          <a href="../../../../data/ej3.txt" download>
            Ej3 Cátedra
          </a>
        </div>
        <div className="col-4 text-center download">
          <a href="../../../../data/animals.txt" download>
            Animals
          </a>
        </div>
      </div>
      <div className="col-12 row mt-4 pt-4">
        <div className="col-4 text-center download">
          <a href="../../../../data/grud200.txt" download>
            Drug
          </a>
        </div>
        <div className="col-4 text-center download">
          <a href="../../../../data/students.txt" download>
            Students
          </a>
        </div>
        <div className="col-4 text-center download">
          <a href="../../../../data/mushrooms.txt" download>
            Mushrooms
          </a>
        </div>
      </div>
    </div >
  );
};

export default Datasets;