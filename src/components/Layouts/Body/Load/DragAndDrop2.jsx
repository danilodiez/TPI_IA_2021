import React, { useState } from "react";

const DragAndDrop2 = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  if (selectedFile != null) {
    console.log('sadasd', selectedFile)
  }
  
  return (
    <div>
       <form>
        <div class="form-group">
          <label for="inputFile">
            Example file input
          </label>
          <input 
            type="file" 
            id="inputFile"
            className="input-file" 
            accept=".txt, .csv"
            onChange={(e) => setSelectedFile(e.dataTransfer.files[0])}
          />
        </div>
      </form>
    </div>
  )
}

export default DragAndDrop2;