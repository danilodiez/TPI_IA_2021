import React, {useEffect, useState} from 'react';
import * as XLSX from "xlsx";
import main from '../../../../scripts/tree.js'
/*
TODO: FUNCION decisiontree(data, atributos, arbol)
TODO:  si data contiene un solo Cj, una sola clase a predecir
*:      hacer una hoja en T rotulada con Cj
TODO:  sino si atributos=vacio
*:      hacer una hoja en T rotulada con Cj
TODO:  sino si data tiene muestras de varias clases, seleccionamos un solo atributo para particionar data en subsets
TODO:
TODO:    po = evaluamos impureza de todo el conjunto (data)
TODO:    for cada atributo Ai de A
TODO:      pi = evaluar impureza de cada Ai (Ai, data)
TODO:
TODO:    seleccionamos Ag con la mejor ganancia
TODO:    if ganancia < threshold
*:        hacer una hoja en T rotulada con Cj
TODO:    sino
TODO:      Ag va a ser un nodo decision en T
TODO:      por cada valor de Ag particionamos D en m conjuntos
TODO:
TODO:      for each Dj particiones de data
TODO:        creamos una rama con nodo decision para Tj como hijo de T
TODO:
TODO:        return decisiontree(Dj, A sin Ag, Tj)
*/


const TreeScreen = () => {
  const [file, setFile] = useState(undefined);
  const [csvFile, setCsvFile] = useState(undefined)
  // process CSV data
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
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        processData(data);
      };
      reader.readAsBinaryString(file);
    };
    let resultTree
    file!==undefined ? resultTree = main(file) : undefined
    console.log(resultTree)
  return (
    <div>
      <h1>Tree</h1>
      <input type="file" accept=".csv,.xlsx,.xls, .txt" onChange={handleFileUpload} />
    </div>
  );
};

export default TreeScreen;
