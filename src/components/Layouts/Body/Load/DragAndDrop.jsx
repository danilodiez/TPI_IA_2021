import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import "bootstrap/dist/css/bootstrap.min.css";
import fileImage from "../../../../assets/images/fileImage.png";
import Modal from "../../../Basic/Modal/Modal";
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
  const [modalIsOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false)
  const [modalMessage, setModalMessage] = useState(undefined)
  const handleChange = (file) => {
    setFile(file);
    setSuccess(true)
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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
          setModalMessage('El archivo posee un tamaño muy grande')
          openModal()
          setSuccess(false);
        }}
        onTypeError={() => {
          setModalMessage("El archivo no es de tipo csv ni txt");
          openModal()
          setSuccess(false);
        }}
      />
      <Modal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        message={modalMessage}
        showButtons
      />
      {success ? <> ✅ El archivo se subio con exito</> : undefined}
    </div>
  );
};
export default DragAndDrop;
