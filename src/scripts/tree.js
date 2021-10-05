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

//! quizá conviene poner el algoritmo anterior en otro archivo, como un .md :)

const dfd = require('danfojs-node');
const csvFilePath = '../data/drug200.csv';
const lodash = require('lodash');

//! no usemos var, siempre const y si no es constante usemos let
var dataFrame;

const getData = async (csvUrl) => {
  let dataFrame = await dfd.read_csv(csvUrl);
  return dataFrame;
};

const log2 = (x) => {
  return Math.log(x) / Math.log(2);
};

//! usemos arrow functions! =>
//! capaz aca nos conviene devolver un array, lo cual es mas adecuado para iterar
// retorna 1 objeto del tipo: { class1: 12, class2: 43, class3: 4}
const countValuesOcurrences = function (data, index) {
  //! no usemos var, siempre const y si no es constante usemos let
  var countValuesOcurrences = lodash.countBy(data, (data) => {
    return data[index];
  });
  return countValuesOcurrences;
};

//! cambiar nombre a impurityEval1, seamos consistentes con las convenciones para las funciones :D
const ImpurityEval1 = (dataframe) => {
  //! no usemos var, siempre const y si no es constante usemos let
  var entropy = 0;
  var classIndex = dataframe.data[0].length - 1;

  // devuelve todas las clases con la cantidad de valores
  var occurrencesOfClasses = countValuesOcurrences(dataframe.data, classIndex);

  let classesNames = Object.keys(occurrencesOfClasses);

  classesNames.forEach((eachClass) => {
    //! por que hacemos esa asinacion? usemos className directamente en el parametro del callback del forEach
    let className = eachClass;
    //! pongamos: dataframe.data.length en una variable aparte mas descriptiva
    let probability = occurrencesOfClasses[className] / dataframe.data.length;
    entropy += probability * log2(probability);
  });

  return -entropy;
};

//! countOccurrences no hace lo mismo que countValuesOcurrences ? (linea 47)
// dado un arreglo, retorna un objeto formado con cada valor posible del arreglo y la cantidad de veces que aparece en el mismo
const countOccurrences = (array) =>
  array.reduce(
    (previous, current) => (
      (previous[current] = ++previous[current] || 1), previous
    ),
    {}
  );

// dado un arreglo de 2 dimensiones, retorna un nuevo arreglo con todos los valores de una columna
// hasta ahora se usa unicamente para obtener los valores de una clase de un subset
const getValuesOfColumn = (array, index) =>
  array.map((element) => element[index]);

const impurityEval2 = (attr, data) => {
  const { columns: attributes } = data;

  const indexOfClass = attributes.length - 1;
  const indexOfAttribute = attributes.indexOf(attr);
  // TODO: remove class attribute for this
  const AllValuesOfAttribute = data.col_data[indexOfAttribute];

  const possibleValuesOfAttr = [...new Set(AllValuesOfAttribute)].sort();

  // obtener la cantidad de ejemplos de cada subcojunto
  // retorna algo asi: { HIGH: 90, LOW: 81 }
  const occurrences = countOccurrences(AllValuesOfAttribute);

  const { data: allExamples } = data;

  const n = allExamples.length;

  // formar los subconjuntos
  const subsets = [];

  possibleValuesOfAttr.forEach((value) => {
    subsets.push({
      value,
      // cantidad de elementos del subconjunto
      occurrences: occurrences[value],
      examples: allExamples.filter(
        (example) => example[indexOfAttribute] === value
      ),
      entropy: 0,
    });
  });

  // para cada subset calculo la entropia
  subsets.forEach((subset) => {
    // arreglo, cuyos elementos son todos los valores de la clase de cada ejemplo en el subset
    const classValuesOfSubset = getValuesOfColumn(
      subset.examples,
      indexOfClass
    );

    // mismo metodo que uso antes
    const occurrencesOfClassesForSubset = countOccurrences(classValuesOfSubset);

    let subsetEntropy = 0;

    Object.values(occurrencesOfClassesForSubset).forEach(
      (occurrencesOfClass) => {
        // TODO: replace for entropy() function
        // Pcj: misma "nomenclatura" que usa c4.5
        const Pcj = occurrencesOfClass / subset.occurrences;
        subsetEntropy += -(Pcj * log2(Pcj));
      }
    );
    subset.entropy = subsetEntropy;
  });

  // entropia de data, si tomamos el atributo attr (data y attr son parametros)
  let entropy = 0;
  subsets.forEach((subset) => {
    const { entropy: subsetEntropy, occurrences } = subset;

    entropy += (occurrences / n) * subsetEntropy;
  });

  return entropy;
};

// dada la entropia del conjunto y las entropias de los diferentes atributos se calcula la ganancia
const gain = (entropyD, entropyOfAttr) => entropyD - entropyOfAttr;

//! cambiar nombre a isUniqueClass, porque retorna un booleano
const uniqueClass = (data) => {
  //! usar mas variables para esto: data[data.column_names[data.column_names.length - 1]], asi no queda un one line tan grande y complejo
  //La ultima columna siempre sera la de decision
  let decisionColumn = data[data.column_names[data.column_names.length - 1]];

  //! DANFOS tiene una funcion para comprobar por unicos, hay que preguntar si podemos usar
  // si contiene una sola clase retornar true
  return decisionColumn.nunique() === 1;
};

//! cambiar nombre a isAttributesEmpty, porque retorna un booleano
const atrributesEmpty = (attributes) => {
  return attributes == null;
};

const selectAttrWithBestGain = (attr, gain) => {
  console.log('Seleccionando atributo MAS OPTIMO ndea');
};

const decisionTree = (data, attr, tree) => {
  if (uniqueClass(data)) {
    console.log('Hacer hoja');
  } else if (atrributesEmpty(attr)) {
    console.log('Hacer hoja por atributos vacio');
  } else {
    console.log('Empieza la magia del abrolito');
  }
};

const main = async () => {
  dataFrame = await getData(csvFilePath);
  // console.log(uniqueClass(dataFrame))
  //Entropia del conjunto
  let entropyD = ImpurityEval1(dataFrame);
  const { columns: attributes } = dataFrame;
  // en c4.5, linea 8 sería
  attributes.forEach((attribute) => {
    const entropyAttribute = impurityEval2(attribute, dataFrame);
    console.log('ganancia', gain(entropyD, entropyAttribute));
  });
};

main();
