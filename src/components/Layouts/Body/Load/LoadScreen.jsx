import React,{useState,useEffect} from 'react';
import * as XLSX from "xlsx";
import './styles-load.css';
import Table from './Table';
import * as dfd from "danfojs/src/index"


const LoadScreen = () => {
  const [file, setFile] = useState(undefined);
  const [dataFrame, setDataFrame] = useState(null)

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
  
  useEffect(() => {
    if (file !== undefined) {
      setDataFrame(new dfd.DataFrame(file))

    }
  }, [file]);
  console.log(dataFrame)
  return (
    <div className="container-load">
      <h1 className="text-center p-4 mt-4">
        Decision Tree
      </h1>
      <input
          type="file"
          accept=".csv,.xlsx,.xls, .txt"
          onChange={handleFileUpload}
        />
      <div className="d-flex justify-content-center">
        {dataFrame && <Table columns={dataFrame.columns} data={dataFrame.data} />}
      </div>
    </div>
  );
};

export default LoadScreen;