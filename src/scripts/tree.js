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

const dfd = require("danfojs-node")
const csvFilePath = "src/data/drug200.csv"


// dfd.read_csv(csvFilePath)
//   .then(df => {
//     //prints the first five columns
//     df.head().print()

//     //prints all column names
//     columnNames = df.column_names

//     //decision column
//     decisionColumn = df[df.column_names[df.column_names.length-1]]
//     //the data is stored in decisionColumn.col_data
//     attributesWithoutDecisionLen = df.column_names.length - 2

//     return df
//   })
//   .catch(err => {
//     console.log(err)
//   })

var dataFrame

const getData = async (csvUrl) => {
  let dataFrame = await dfd.read_csv(csvUrl)
  return dataFrame
}

const decisionTree = (data, attr, tree) => {
  console.log(data)
}

const uniqueClass = (data) => {
  //La ultima columna siempre sera la de decision
  let decisionColumn = data[data.column_names[data.column_names.length-1]]
  let decisionValues = decisionColumn.values
  //! DANFOS tiene una funcion para comprobar por unicos, hay que preguntar si podemos usar
  // si contiene una sola clase retornar true
  return decisionColumn.nunique() === 1;

}

const main = async () => {
  dataFrame = await getData(csvFilePath)
  console.log(uniqueClass(dataFrame))


}

main()
