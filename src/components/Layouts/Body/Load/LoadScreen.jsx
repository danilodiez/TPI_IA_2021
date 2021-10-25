import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './styles-load.css';
import Table from './Table';
import * as dfd from 'danfojs/src/index';

const LoadScreen = () => {
  const [file, setFile] = useState(undefined);
  const [dataFrame, setDataFrame] = useState(null);
  const [dataFrameHasIds, setDataFrameHasIds] = useState(false);
  const [dataFrameHasContinuesValues, setDataFrameHasContinuesValues] =
    useState(false);
  const [dataFrameHasSpecialCharacters, setDataFrameHasSpecialCharacters] =
    useState(false);

  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    setFile(list);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  const removeContinuesValues = (dataFrame) => {
    const columnTypes = dataFrame.col_types;
    const columnNames = dataFrame.columns;

    /* Danfo tiene 3 tipos de datos (string, int32 o float32),
    nos interesa eliminar aquellos del tipo float32 */

    columnTypes.forEach((type, index) => {
      if (type === 'float32') {
        dataFrame.drop({
          columns: [columnNames[index]],
          axis: 1,
          inplace: true,
        });
        setDataFrameHasContinuesValues(true);
      }
    });
    return dataFrame;
  };

  const removeIds = () => {
    const columnNames = dataFrame.columns;

    columnNames.forEach((column, index) => {
      console.log(column.toLowerCase());
      const posibleIdsCases = ['id', 'ids', '"id"', '"ids"'];
      if (posibleIdsCases.includes(column.toLowerCase().trim())) {
        dataFrame.drop({
          columns: [columnNames[index]],
          axis: 1,
          inplace: true,
        });
        setDataFrameHasIds(true);
      }
    });
    return dataFrame;
  };

  const removeSpecialCharacters = () => {
    const data = dataFrame.data;

    const specialCharacterRegex = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.\/?~]/;

    const indexesToRemove = [];

    data.forEach((row, rowIndex) => {
      let rowHasSpecialCharacter = row.some((value) =>
        specialCharacterRegex.test(value)
      );
      if (rowHasSpecialCharacter) {
        indexesToRemove.push(rowIndex);
      }
    });

    dataFrame.drop({
      index: indexesToRemove,
      axis: 0,
      inplace: true,
    });

    return dataFrame;
  };

  const validDataFrame = (dataFrame) => {
    let validDataFrame = removeContinuesValues(dataFrame);
    validDataFrame = removeIds(validDataFrame);
    validDataFrame = removeSpecialCharacters(validDataFrame);
    setDataFrame(validDataFrame);
  };

  useEffect(() => {
    if (file !== undefined) {
      setDataFrame(new dfd.DataFrame(file));
      dataFrame && validDataFrame(dataFrame);
    }
  }, [file, dataFrame]);

  return (
    <div className="container-load">
      <h1 className="text-center p-4 mt-4">Decision Tree</h1>
      <input
        type="file"
        accept=".csv,.xlsx,.xls, .txt"
        onChange={handleFileUpload}
      />
      <div className="d-flex justify-content-center">
        {dataFrame && (
          <Table columns={dataFrame.columns} data={dataFrame.data} />
        )}
      </div>
    </div>
  );
};

export default LoadScreen;
