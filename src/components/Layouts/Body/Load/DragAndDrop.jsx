import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import "bootstrap/dist/css/bootstrap.min.css";
import fileImage from "../../../../assets/images/fileImage.png";

const fileTypes = ["TXT", "CSV"];

const boxBody = () => {
  return (
    <div className="justify-content-center align-items-center d-flex flex-column">
      <span>Arrastre aqui sus archivos o haga click en el recuadro</span>
      <img
        src={fileImage}
        width="50"
        height="50"
        alt="Logo de archivo"
      />
    </div>
  );
};
const DragAndDrop = () => {
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false)
  const handleChange = (file) => {
    setFile(file);
    setSuccess(true)
  };
  return (
    <div className="h-100 justify-content-center d-flex align-items-center flex-column">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        children={boxBody()}
        maxSize={2}
        classes="border border-info rounded-10 h-25 w-100 d-flex justify-content-center"
        onSizeError={() => {
          //TODO ACA TRIGGEREAMOS EL MODAL
          setSuccess(false);
        }}
        onTypeError={() => {
          //TODO ACA TRIGGEREAMOS EL MODAL
          setSuccess(false);
        }}
      />
      {success ? <> ✅ El archivo se subio con exito</> : undefined}
    </div>
  );
};
export default DragAndDrop;
