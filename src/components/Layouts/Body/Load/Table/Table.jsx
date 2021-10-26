import React from 'react';
import './styles-table.css';

const Table = ({columns,data}) => {

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