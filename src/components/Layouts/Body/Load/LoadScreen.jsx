import React from 'react';
import './styles-load.css';
import Table from './Table';

const LoadScreen = () => {
 
  return (
    <div className="container-load">
      <h1 className="text-center p-4 mt-4">
        Decision Tree
      </h1>
      <div className="d-flex justify-content-center">
        <Table />
      </div>
    </div>
  );
};

export default LoadScreen;