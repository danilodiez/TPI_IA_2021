import React, { useState } from 'react';


const RangeInput = ({ handleThresholdChange, threshold }) => {
  return (
    <div className="col-8 mx-auto">
      <label htmlFor="customRange2" className="form-label d-flex justify-content-center">
        Seleccione el threshold para el cálculo:
      </label >
      <input
        id="customRange2"
        onChange={(e) => handleThresholdChange(e.target.value)}
        type="range"
        className="form-range"
        min="0.01"
        value={threshold}
        max="1"
        step="0.01"
      />
      <h5 className="d-flex justify-content-center">{threshold}</h5>
    </div >
  );
};

export default RangeInput;
