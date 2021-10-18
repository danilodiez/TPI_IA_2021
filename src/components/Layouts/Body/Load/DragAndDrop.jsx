import React, {useState} from 'react';
import { FileUploader } from "react-drag-drop-files";
import "bootstrap/dist/css/bootstrap.min.css";

const fileTypes = ["TXT", "CSV"];

const boxBody = () => {
  return(
    <div>
      Suba su archivo
    </div>
  )
}
const DragAndDrop = () => {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    console.log(file)

  };
  return (
    <div class="h-100 border border-danger justify-content-center d-flex">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        classes="border border-info rounded-10 h-100 w-100 d-flex justify-content-center"
      />
    </div>
  );
}
export default DragAndDrop
