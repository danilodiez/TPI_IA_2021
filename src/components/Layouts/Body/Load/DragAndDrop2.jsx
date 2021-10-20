const DragAndDrop2 = () => {
  return (
    <div>
       <form>
        <div class="form-group">
          <label for="exampleFormControlFile1">
            Example file input
          </label>
          <input 
            type="file" 
            class="form-control-file" 
            id="exampleFormControlFile1" 
            accept=".txt, .csv"
          />
        </div>
      </form>
    </div>
  )
}

export default DragAndDrop2;