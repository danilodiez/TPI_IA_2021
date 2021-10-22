import React from 'react';
import './styles-table.css';

const Table = ({columns,data}) => {
  /*
  const TEMP_DATASET = [
    ['Age', 'Sex', 'BP', 'Cholesterol', 'Drug'],
    [ 23, 'F', 'HIGH', 'HIGH', 'drugY' ],
    [ 47, 'M', 'LOW', 'HIGH', 'drugC' ],
    [ 47, 'M', 'LOW', 'HIGH', 'drugC' ],
    [ 28, 'F', 'NORMAL', 'HIGH', 'drugX' ],
    [ 61, 'F', 'LOW', 'HIGH', 'drugY' ],
    [ 22, 'F', 'NORMAL', 'HIGH', 'drugX' ],
    [ 49, 'F', 'NORMAL', 'HIGH', 'drugY' ],
    [ 41, 'M', 'LOW', 'HIGH', 'drugC' ],
    [ 60, 'M', 'NORMAL', 'HIGH', 'drugY' ],
    [ 43, 'M', 'LOW', 'NORMAL', 'drugY' ],
    [ 47, 'F', 'LOW', 'HIGH', 'drugC' ],
    [ 34, 'F', 'HIGH', 'NORMAL', 'drugY' ],
    [ 43, 'M', 'LOW', 'HIGH', 'drugY' ],
    [ 74, 'F', 'LOW', 'HIGH', 'drugY' ],
    [ 50, 'F', 'NORMAL', 'HIGH', 'drugX' ],
    [ 16, 'F', 'HIGH', 'NORMAL', 'drugY' ],
    [ 69, 'M', 'LOW', 'NORMAL', 'drugX' ],
    [ 43, 'M', 'HIGH', 'HIGH', 'drugA' ],
    [ 23, 'M', 'LOW', 'HIGH', 'drugC' ],
    [ 32, 'F', 'HIGH', 'NORMAL', 'drugY' ],
    [ 57, 'M', 'LOW', 'NORMAL', 'drugY' ],
    [ 63, 'M', 'NORMAL', 'HIGH', 'drugY' ],
    [ 47, 'M', 'LOW', 'NORMAL', 'drugY' ],
    [ 48, 'F', 'LOW', 'HIGH', 'drugY' ],
    [ 33, 'F', 'LOW', 'HIGH', 'drugY' ],
    [ 28, 'F', 'HIGH', 'NORMAL', 'drugY' ],
  ];  */
  return (
    <div className="container-table">
      <table className="table table-striped">
        <thead>
          <tr>
            {columns && columns.map((element, i) => {
              return <th key={`thead_${i}`}>{element}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {data && data.map((row, i) => {
            
            return <tr key={`tbody_${i}`}>
              {row.map((element, i) => {
                return <td key={`element_${i}`}>{element}</td>
              })}
            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;