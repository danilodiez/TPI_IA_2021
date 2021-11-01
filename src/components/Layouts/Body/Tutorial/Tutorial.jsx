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
            <p>Ir a la sección <strong>"Arbol de decisión"</strong> o presionar el boton de <strong>"Iniciar"</strong> que se encuentra en el Menú Principal</p>
          </div>
        </div>
        <div className="items">
          <h6 className="d-flex justify-content-center">Paso 2</h6>
          <hr />
          <div className="col-12">
            <p>Seleccionar un archivo <strong>.csv</strong> o <strong>.txt</strong> que tenga los datos de entrenamiento</p>
          </div>
        </div>
      </div>
      <div className="container-items row d-flex justify-content-center">
        <div className="items">
          <h6 className="d-flex justify-content-center">Paso 3</h6>
          <hr />
          <div className="col-12">
            <p>Una vez seleccionado el archivo podrá visualizar una tabla con todos los datos subidos. Por último, deberá seleccionar el valor del <strong>threshold</strong> que se desea utilizar para este caso</p>
          </div>
        </div>
        <div className="items">
          <h6 className="d-flex justify-content-center">Paso 4</h6>
          <hr />
          <div className="col-12">
            <p>Luego podrá seleccionar entre 2 opciones:</p>
            <p>Si presionar el botón <strong>"Generar árbol"</strong> va a obtener los árboles generados completamente</p>
            <p>Si presiona el botón <strong>"Generar árbol paso a paso"</strong> podrá ir viendo como se generan cada uno de los niveles de los árboles</p>
          </div>
        </div>
      </div>
      <div className="p-2">
        <p><u><strong>Aclaración:</strong></u> Independientemente de cual sea el dataset seleccionado, en el último paso podrá observar tanto el arbol generado con <strong>GANANCIA</strong> y con <strong>TASA DE GANANCIA</strong></p>
      </div>
    </div>
  );
};

export default Tutorial;