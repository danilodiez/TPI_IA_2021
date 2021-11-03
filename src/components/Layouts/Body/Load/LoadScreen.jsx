import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Table from './Table/Table';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../../../Basic/Button/Button';
import Spinner from './Spinner/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import './styles-load.css';
import * as XLSX from 'xlsx';
import * as dfd from 'danfojs/src/index';
import RangeInput from '../../../Basic/RangeInput/RangeInput';
import BaseModal from '../../../Basic/Modal/Modal';

const LoadScreen = () => {
  const history = useHistory();
  const [file, setFile] = useState(undefined);
  const [dataFrame, setDataFrame] = useState(null);
  const [threshold, setThreshold] = useState(0.01);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(undefined);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
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
  const accceptedFileTypes = ['text/csv', 'text/plain'];
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (accceptedFileTypes.includes(file.type)) {
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
    } else {
      setModalMessage('El archivo seleccionado no es de tipo .csv ni .txt');
      openModal();
    }
  };

  const showToast = (message) => toast.warn(message);

  const removeContinuesValues = (df) => {
    const columnTypes = df.col_types;
    const columnNames = df.columns;

    /* Danfo tiene 3 tipos de datos (string, int32 o float32),
    nos interesa eliminar aquellos del tipo float32 */

    columnTypes.forEach((type, index) => {
      if (type === 'float32') {
        df.drop({
          columns: [columnNames[index]],
          axis: 1,
          inplace: true,
        });
        showToast(
          'El Dataset seleccionado posee una columna con atributos continuos, la misma no se tendrá en cuenta en el proceso'
        );
      }
    });
    return df;
  };

  const removeIds = (df) => {
    const columnNames = df.columns;

    columnNames.forEach((column, index) => {
      const posibleIdsCases = ['id', 'ids', '"id"', '"ids"'];
      if (posibleIdsCases.includes(column.toLowerCase().trim())) {
        df.drop({
          columns: [columnNames[index]],
          axis: 1,
          inplace: true,
        });
        showToast(
          'El Dataset seleccionado posee un atributo del tipo ID, el mismo no se tendrá en cuenta en el proceso'
        );
      }
    });
    return df;
  };

  const removeSpecialCharacters = (df) => {
    const data = df.data;

    // los caracteres con los cuales no trabajamos son: ` ! @ # $ % ^ & * ( ) _ + \ = [ ] { } ; ' : " | , . / ? ~
    const specialCharacterRegex = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.\/?~]/;

    const indexesToRemove = [];

    data.forEach((row, rowIndex) => {
      let rowHasSpecialCharacter = row.some((value) =>
        specialCharacterRegex.test(value)
      );
      if (rowHasSpecialCharacter) {
        indexesToRemove.push(rowIndex);
      }
    });
    if (indexesToRemove.length > 0) {
      let newDf = df.drop({
        index: indexesToRemove,
        axis: 0,
        inplace: false,
      });
      showToast(
        "El Dataset seleccionado posee campos con caracteres especiales, la misma no se tendrá en cuenta en el proceso"
      );
      return newDf;
    }
    df.dropna({ axis: 0, inplace: true })

    return df;
  };

  const validateDataFrame = (df) => {
    let validDataFrame = removeContinuesValues(df);
    validDataFrame = removeIds(validDataFrame);
    validDataFrame = removeSpecialCharacters(validDataFrame);
    setDataFrame(validDataFrame);
  };

  useEffect(() => {
    if (file !== undefined) {
      setDataFrame(new dfd.DataFrame(file));
    }
  }, [file]);

  useEffect(() => {
    if (dataFrame) {
      validateDataFrame(dataFrame);
    }
  }, [dataFrame]);

  const redirect = (pathname) => {
    history.push({
      pathname,
      state: { dataFrame, threshold },
    });
  };
  const handleThresholdChange = (value) => {
    setThreshold(value);
  };

  return (
    <div className="container-load">
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={true}
        closeOnClick={false}
      />
      <h1 className="text-center p-4 mt-4">Decision Tree</h1>
      <div className="d-flex justify-content-center">
        <h5>Haga click en el recuadro y seleccione su archivo</h5>
      </div>
      <div className="p-2 d-flex justify-content-center">
        <div className="container-input-file d-flex justify-content-center">
          <input
            id="input-file"
            type="file"
            accept=".csv, .xlsx, .xls, .txt"
            onChange={handleFileUpload}
          />
          <label htmlFor="input-file" className="input-file"></label>
        </div>
      </div>
      <div className="p-4 d-flex justify-content-center">
        {dataFrame?.columns ? (
          <div className="col-12">
            <Table columns={dataFrame.columns} data={dataFrame?.data} />
            <RangeInput
              handleThresholdChange={handleThresholdChange}
              threshold={threshold}
            />
          </div>
        ) : (
          file && <Spinner />
        )}
      </div>

      <div className="p-4 d-flex justify-content-center">
        {dataFrame?.columns && dataFrame?.data && (
          <>
            <Button
              text="Generar árboles"
              type="info"
              size="lg"
              style={{ color: 'black' }}
              onClick={() => redirect('/tree')}
            />
            <Button
              text="Generar árboles paso a paso"
              type="info"
              size="lg"
              style={{ color: 'black', marginLeft: '1rem' }}
              onClick={() => redirect('/steps')}
            />
          </>
        )}
      </div>
      <BaseModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        message={modalMessage}
        showButtons
      />
    </div>
  );
};

export default LoadScreen;
