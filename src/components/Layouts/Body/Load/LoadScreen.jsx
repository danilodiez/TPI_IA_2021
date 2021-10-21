import React from 'react';
import DragAndDrop2 from './DragAndDrop2';
import './styles-load.css';
import Table from './Table';

const LoadScreen = () => {
 
  return (
    <div className="container-load">
      <h1 className="text-center p-4 mt-4">
        Decision Tree
      </h1>
      <div>
        <div className="d-flex justify-content-center p-2">
          <DragAndDrop2/>
        </div>
        <div  className="d-flex justify-content-center p-2">
          <Table />
        </div>
      </div>
    </div>
  );
};

export default LoadScreen;