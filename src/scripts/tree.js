import * as dfd from "danfojs/src/index"
const threshold = 0.1;
import lodash from "lodash"

// const csvFilePath = '../data/drug200.csv';
import Tree from '../classes/Tree.js'

var dataFrame;

// const getData = async (csvUrl) => {
//   let dataFrame = await dfd.read_csv(csvUrl);
//   return dataFrame;
// };

const log2 = (x) => {
  return Math.log(x) / Math.log(2);
};

const countValuesOcurrences = function (data, index) {
  var countValuesOcurrences = lodash.countBy(data, (data) => {
    return data[index];
  });
  return countValuesOcurrences;
};

const impurityEval1 = (dataframe) => {
  var entropy = 0;
  var classIndex = dataframe.data[0].length - 1;
  /* devuelve todas las clases con la cantidad de valores*/
  var occurrencesOfClasses = countValuesOcurrences(dataframe.data, classIndex);

  let classesNames = Object.keys(occurrencesOfClasses);

  classesNames.forEach((eachClass) => {
    let className = eachClass;
    let probability = occurrencesOfClasses[className] / dataframe.data.length;
    entropy += probability * log2(probability);
  });

  return -entropy;
};

const partition = (indexOfSelectedAttr, dataframe) => {
  let valuesOfAttr = Object.keys(countValuesOcurrences(dataframe.data,indexOfSelectedAttr))
  let subsets = [];
  //Comparo el valor del atributo con cada fila del dataframe y pusheo en un nuevo dataset las filas que tienen ese valor ( seria lo que hace en la linea 16 del algoritmo)
  valuesOfAttr.forEach( value => {

    let newSubset = [];

    dataframe.data.forEach ( row => {
      if (row[indexOfSelectedAttr] == value ){
        row.splice(indexOfSelectedAttr,1); //elimina el valor de ese atributo que al llamar recursivamente no se utiliza mas
        newSubset.push(row)
      };
    });
    subsets.push(newSubset);
  });
  return {subsets,valuesOfAttr};
};
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

//? Aca se deberia cambiar data por dataframe como hacemos en todas las funciones
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

const gainRatio = (gainValue, dataframe, indexOfAttribute) => {
  let splitInfo = 0;
  let occurrencesOfValues = countValuesOcurrences(dataframe.data, indexOfAttribute);
  let valuesNames = Object.keys(occurrencesOfValues);

  valuesNames.forEach( eachValue => {
    let valueName = eachValue;
    let allExamples = dataframe.data.length;
    let probability = occurrencesOfValues[valueName] / allExamples;
    splitInfo += probability * log2(probability);
  });

  return gainValue / Math.abs(splitInfo);
};

const uniqueClass = (data) => {
  //La ultima columna siempre sera la de decision
  // let decisionColumn = data[data.columns[data.columns.length - 1]];
  // si contiene una sola clase retornar true
  // return data.nunique() === 1;
  return data.every( (val, i, arr) => val === arr[0] )
};

const attributesEmpty = (attributes) => {

  return attributes.length === 1
}



const checkForContinuesValues = (dataFrame) => {
  const columnTypes = dataFrame.col_types;
  const columnNames = dataFrame.columns;

  /* Danfo tiene 3 tipos de datos (string, int32 o float32),
  nos interesa eliminar aquellos del tipo float32 */

  columnTypes.forEach( (type, index) => {
    if(type === 'float32') {
      dataFrame.drop({columns: [columnNames[index]], axis: 1, inplace: true})
    }
  })

  //Retornamos el dataFrame sin valores continuos
  return dataFrame;

};
var currentNodes = [];
var contId = 0;
const decisionTree = (dataFrame, attributes = [], tree) => {
  var bestGain = {};
  const gains = [];
  const gainsRatio = [];
  let fatherNode = tree.id;
  let calcMethod = tree.calcMethod
  var tree = new Tree();
  tree.calcMethod = calcMethod
  tree.father = fatherNode;
  console.log("calcMethod", calcMethod)
  let indexOfClasses = dataFrame.col_data.length - 1 == -1 ? dataFrame.columns.length - 1 : dataFrame.col_data.length - 1 ;

  const dataArray = dataFrame.col_data[indexOfClasses] || new Array(dataFrame.columns[indexOfClasses]); // Cuando llega al ultimo attributo , el segundo termino lo convierte a array

  if (uniqueClass(dataArray)) {
    //todo Hacer una leaf en treee
    let classes = countOccurrences(dataArray);

    classes = Object.entries(classes).map((e) => ( { [e[0]]: e[1] } ));
    tree.classValue= Object.keys(classes[0])[0];
    tree.leafConfidence = 1;
    tree.isLeaf = true;
    tree.id = contId;
    contId += 1;
    console.log("Hoja en condicion de salida 1",tree);
    currentNodes.push(tree);
    return
  } else if (attributesEmpty(attributes)) {
    let classes = countOccurrences(dataFrame.col_data[indexOfClasses]);

    classes = Object.entries(classes).map((e) => ( { [e[0]]: e[1] } ));

    classes.sort(function(a,b){
      return b.gain - a.gain
    })

    let mostCommonClass =Object.values(classes[0])[0];
    let totalOcurrences = 0

    classes.map( eachClass => {
      totalOcurrences += Object.values(eachClass)[0]

    });

    let confidence = `${mostCommonClass} / ${totalOcurrences}`;

    tree.classValue = Object.keys(classes[0])[0];
    tree.leafConfidence = confidence;
    tree.isLeaf = true;
    tree.id = contId;
    contId += 1;

    console.log("Hoja en condicion de salida 2",tree);
    /*console.log('Hacer hoja por atributos vacio');*/
    currentNodes.push(tree);
    return
    } else {
        //Entropia del conjunto
      let entropyD = impurityEval1(dataFrame);

      const indexOfClass = attributes.length - 1;
      // en c4.5, linea 8 sería
      attributes.forEach( (attribute, index) => {
        if (index != indexOfClass){
          const entropyAttribute = impurityEval2(attribute, dataFrame);
          tree.entropy = entropyAttribute
          //todas las ganancias
          gains.push({
              attribute: attribute,
              gain: gain(entropyD,entropyAttribute),
              index: index
            })

          let attributeGain = gains[index].gain;
          if(tree.calcMethod === "gain"){

              gains.sort(function(a,b){
                return b.gain - a.gain
              })
              bestGain = gains[0];
          } else if (tree.calcMethod === "gainRatio"){
          //todas las tasas de ganancia
            gainsRatio.push({
              index: index,
              attribute: attribute,
              gain: gainRatio(attributeGain, dataFrame, index)
            });
              gainsRatio.sort(function(a,b){
                return b.gain - a.gain
              })
              bestGain = gainsRatio[0];
              console.log("gainsRatio", gainsRatio)
          }
          else {
            console.log("Metodo de calculo incorrecto")
          }
        };
      });

      // Pongo en la primera posicion el atributo con la mejor ganancia o mejor reduccion de impureza

      // obtengo el atributo con la mejor ganancia
       // Esto cambie solo para probar con atributos discretos

      if (bestGain.gain < threshold) {
        let classes = countOccurrences(dataFrame.col_data[indexOfClasses]);

        classes = Object.entries(classes).map((e) => ( { [e[0]]: e[1] } ));

        tree.classValue= Object.keys(classes[0])[0];
        tree.leafConfidence = 1;
        tree.isLeaf = true;
        tree.id = contId;
        contId += 1;
        console.log("Genero una hoja de T rotulada con Cj")
        currentNodes.push(tree);
        return
      } else {
        tree.gain = bestGain.gain
        console.log("Genero un nodo decision rotulado con Cj");

        //valuesOfattr servira para la recursion
        const {subsets, valuesOfAttr} = partition(bestGain.index, dataFrame);

        //attributes.splice(bestGain.index, 1); // elimina el atributo elegido ( A - {Ag})

        let attributesWithoutSelected = attributes.filter( (att,index) => index != bestGain.index);

        tree.node = bestGain.attribute
        tree.branches = valuesOfAttr
        tree.id = contId;
        contId += 1;
        currentNodes.push(tree);
        console.log("Nodo",tree)
        //linea 17 del algoritmo
        subsets.forEach(subset => {
          if (subset != [] ){
            let df = new dfd.DataFrame(subset)
            df.columns = attributesWithoutSelected

            return decisionTree(df, attributesWithoutSelected, tree)
          };
        });

      };
        }
        return currentNodes
    };

const main = (csvData, method="gain") => {

  //Ya estan seteados los valores por defecto en la primer instanciacion
  var tree = new Tree()
  tree.calcMethod = method;
  let dataFrame = new dfd.DataFrame(csvData);
  const { columns: attributes } = dataFrame;
  return decisionTree(dataFrame, attributes, tree);

};

export default main
