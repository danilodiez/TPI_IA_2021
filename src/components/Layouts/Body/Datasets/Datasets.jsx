// Vista donde es posible ejecutar el algoritmo con datasets pre-cargados
import React from 'react';
import './styles.css';
import { useHistory } from 'react-router';

const Datasets = () => {
  const history = useHistory();

  const redirect = (fileUrl) => {
    history.push({
      pathname: '/load',
      state: { method: 'preload', fileUrl },
    });
  };
  return (
    <div className="container-datasets">
      <div className="pt-4">
        <h1 className="text-center p-4 mt-4">Datasets de prueba</h1>
      </div>
      <div className="p-4 text-center">
        <h5>
          A continuación dejamos algunos datasets que pueden utilizar para
          realizar pruebas. Sólo basta con hacer click en algunos de los botones
          y la aplicación automáticamente los redireccionará a la sección de
          carga con los datos precargados.
        </h5>
        <h5>
          Los mismos poseen diferentes variantes, los cuales sirven para ver el
          comportamiento del algoritmo en diferentes casos.
        </h5>
      </div>
      <div className="col-12 row mt-4">
        <div className="col-4 text-center download">
          <button onClick={() => redirect('src/data/ej1.txt')}>
            Ej1 Cátedra
          </button>
        </div>
        <div className="col-4 text-center download">
          <button onClick={() => redirect('src/data/ej3.txt')}>
            Ej3 Cátedra
          </button>
        </div>
        <div className="col-4 text-center download">
          <button onClick={() => redirect('src/data/animals.txt')}>
            Animals
          </button>
        </div>
      </div>
      <div className="col-12 row mt-4 pt-4">
        <div className="col-4 text-center download">
          <button onClick={() => redirect('src/data/drug200.txt')}>
            Drugs
          </button>
        </div>
        <div className="col-4 text-center download">
          <button onClick={() => redirect('src/data/students.csv')}>
            Students
          </button>
        </div>
        <div className="col-4 text-center download">
          <button onClick={() => redirect('src/data/mushrooms.txt')}>
            Mushrooms
          </button>
        </div>
      </div>
    </div>
  );
};

export default Datasets;
