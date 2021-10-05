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
const csvFilePath = "../data/drug200.csv";
const threshold = 3;
const lodash = require("lodash")
var dataFrame;

const getData = async (csvUrl) => {
  let dataFrame = await dfd.read_csv(csvUrl);
  return dataFrame;
};

const log2 = (x) => {
  return Math.log(x) / Math.log(2);
};

const countValuesOcurrences = function(data,index){
  var countValuesOcurrences = lodash.countBy(data,(data) => {
    return  data[index]
  });
  return countValuesOcurrences
}

const ImpurityEval1 = (dataframe) => {
  var entropy = 0 ;
  var classIndex = dataframe.data[0].length - 1;
  /* devuelve todas las clases con la cantidad de valores*/
  var occurrencesOfClasses = countValuesOcurrences(dataframe.data,classIndex)
  
  let classesNames = Object.keys(occurrencesOfClasses);
  
  classesNames.forEach(eachClass => {
    let className = eachClass;
    let probability = occurrencesOfClasses[className] / dataframe.data.length;
    entropy += probability * log2(probability);
  });
  
  return -entropy
}

// dado un arreglo, retorna un objeto formado con cada valor posible del arreglo y la cantidad de veces que aparece en el mismo
const countOccurrences = (array) =>
  array.reduce(
    (previous, current) => (
      (previous[current] = ++previous[current] || 1), previous
    ),
    {}
  );

// dado un arreglo de 2 dimensiones, retorna un nuevo arreglo con todos los valores de una columna
// hasta ahora lo uso unicamente para obtener los valores de una clase de un subset
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
  
  return entropy
};

// dada la entropia del conjunto y las entropias de los diferentes atributos se calcula la ganancia
const gain = (entropyD,entropyOfAttr) =>  {
  return (entropyD - entropyOfAttr)
};

const uniqueClass = (data) => {
  //La ultima columna siempre sera la de decision
  let decisionColumn = data[data.column_names[data.column_names.length - 1]];
  let decisionValues = decisionColumn.values;
  //! DANFOS tiene una funcion para comprobar por unicos, hay que preguntar si podemos usar
  // si contiene una sola clase retornar true
  return decisionColumn.nunique() === 1;
};

const atrributesEmpty = (attributes) => {
  return attributes == null;
};

const decisionTree = (dataFrame, attr, tree) => {
  if (uniqueClass(dataFrame)) {
    console.log('Hacer hoja');
  } else if (atrributesEmpty(attr)) {
    console.log('Hacer hoja por atributos vacio');
    } else {
      console.log("Empieza la magia del abrolito");
    }
};

const recursion = (data, attr) => {
  array.forEach(element => {
    if ('distinto de vacio') {
      console.log('creo una rama desde el nodo origen a cada nodo hijo')
      decisionTree(dataFrame, attr, tree)
    }
  });
}

//TO DO Tratar atributos continuos ???
const main = async () => {
  const gains = [];
  var bestGain = {};

  dataFrame = await getData(csvFilePath);

  //Entropia del conjunto
  let entropyD = ImpurityEval1(dataFrame);
  const { columns: attributes } = dataFrame;

  // en c4.5, linea 8 sería
  attributes.forEach((attribute) => {
    const entropyAttribute = impurityEval2(attribute, dataFrame);
    gains.push({
      attribute: attribute, 
      gain: gain(entropyD,entropyAttribute)
    })
  });
  
  // Pongo en la primera posicion el atributo con la mejor ganancia o mejor reduccion de impureza
  gains.sort(function(a,b){
    return b.gain - a.gain
  })

  // obtengo el atributo con la mejor ganancia
  bestGain = gains[0];
  console.log('el atributo', bestGain.attribute, 'tiene la mejor ganancia', bestGain.gain)

  if (bestGain.gain < threshold) {
    console.log("Genero una hoja de T rotulada con Cj")
  } else {
    console.log("Genero un nodo decision rotulado con Cj");
    recursion(dataFrame, attributes);
  }
};

main();
