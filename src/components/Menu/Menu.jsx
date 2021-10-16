import React from 'react';
import "./styles.css";

const Menu = () => {
 
  return (
    <div className="container-menu">
      <div className="pt-4">
        <h4 className="text-center p-4">
          <button onClick={() => {history.push("/index")}}>
            Menu Principal
          </button>
        </h4>
      </div>
      <div className="p-4">
        <ul className="list-menu">
          <li class="m-2 color-white">
          <button onClick={() => {history.push("/tutorial")}}>
              Tutorial
            </button>
          </li>
          <li class="m-2">
          <button onClick={() => {history.push("/tree")}}>
              Arbol de decisión
            </button>
          </li>
          <li class="m-2">
          <button onClick={() => {history.push("/samples")}}>
              Muestras
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;