import React, {useState} from 'react';


const RangeInput = ({handleThresholdChange, threshold}) => {
  return (
    <div>
      <label htmlFor="customRange2" className="form-label">
        Ingrese threshold para el cálculo
      </label>
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
      {threshold}
    </div>
  );
};

export default RangeInput;
