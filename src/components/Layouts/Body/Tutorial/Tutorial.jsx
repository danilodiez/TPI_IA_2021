import React from "react";
import "./styles.css";

const Tutorial = () => {
 
  return (
    <div className="container-tutorial">
      <div className="pt-4">
        <h1 className="text-center p-4 mt-4">
          Tutorial - Decision Tree
        </h1>
      </div>
      <h5 className="m-3 text-center">En este tutorial te mostraremos como utilizar la aplicación para generar un árbol de decisión calculado con ganancia o tasa de ganancia.</h5>
      <h5 className="m-3 text-center">Los pasos a seguir deben ser los siguientes:</h5>
      <div className="container-items row d-flex justify-content-center">
        <div className="items">
          <h6 className="d-flex justify-content-center">Paso 1</h6>
          <hr />
          <div className="col-12">
            <p>Ir a la sección <strong>"Arbol de decisión"</strong></p>
          </div>
        </div>
        <div className="items">
          <h6 className="d-flex justify-content-center">Paso 2</h6>
          <hr />
          <div className="col-12">
            <p>Seleccionar un archivo <strong>.csv</strong> o <strong>txt</strong> con datos de entrenamiento</p>
          </div>
        </div>
      </div>
      <div className="container-items row d-flex justify-content-center">
        <div className="items">
          <h6 className="d-flex justify-content-center">Paso 3</h6>
          <hr />
          <div className="col-12">
            <p>Una vez cargados los datos de entrenamiento, seleccionar los <strong>parámetros para el cálculo</strong> (threshold, % de separación, método de cálculo)</p>
          </div>
        </div>
        <div className="items">
          <h6 className="d-flex justify-content-center">Paso 4</h6>
          <hr />
          <div className="col-12">
            <p>Presionar el botón <strong>"Generar Árbol"</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;