import * as dfd from 'danfojs/src/index';
import lodash from 'lodash';
import Tree from '../classes/Tree.js';

const log2 = (x) => {
  return Math.log(x) / Math.log(2);
};

// retorna la cantidad de ocurrencias de cada clase
const countValuesOcurrences = function (data, index) {
  var countValuesOcurrences = lodash.countBy(data, (data) => {
    return data[index];
  });
  return countValuesOcurrences;
};

// retorna la entropia del conjunto de datos
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

// retorna la particion en subconjuntos de los valores del atributo elegido para implementar la recursion
const partition = (indexOfSelectedAttr, dataframe) => {
  let valuesOfAttr = Object.keys(
    countValuesOcurrences(dataframe.data, indexOfSelectedAttr)
  );
  let subsets = [];
  //Comparo el valor del atributo con cada fila del dataframe y pusheo en un nuevo dataset las filas que tienen ese valor ( seria lo que hace en la linea 16 del algoritmo)
  valuesOfAttr.forEach((value) => {
    let newSubset = [];

    dataframe.data.forEach((row, index) => {
      let newRow = row;

      if (row[indexOfSelectedAttr] === value) {
        newRow = row.filter((value, index) => index !== indexOfSelectedAttr);
        newSubset.push(newRow);
      }
    });
    subsets.push(newSubset);
  });
  return { subsets, valuesOfAttr };
};

// dado un arreglo, retorna un objeto formado con cada valor posible del arreglo y la cantidad de veces que aparece en el mismo
// es similar a countValuesOcurrences, pero esta se usa solamente para los atributos (y no las clases)
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

// calcula la entropia del conjunto "data" con respecto a cada atributo "attr"
const impurityEval2 = (attr, data) => {
  const { columns: attributes } = data;

  let indexOfClasses =
    data.col_data.length - 1 == -1
      ? data.columns.length - 1
      : data.col_data.length - 1;

  const indexOfAttribute =
    attributes.indexOf(attr) === -1 ? attr : attributes.indexOf(attr);

  const AllValuesOfAttribute = data.col_data[indexOfAttribute];

  const possibleValuesOfAttr = [...new Set(AllValuesOfAttribute)];

  const occurrences = countOccurrences(AllValuesOfAttribute);

  const { data: allExamples } = data;

  const n = allExamples.length;

  const subsets = [];

  possibleValuesOfAttr.forEach((value) => {
    subsets.push({
      value,
      occurrences: occurrences[value],
      examples: allExamples.filter(
        (example) => example[indexOfAttribute] === value
      ),
      entropy: 0,
    });
  });

  // para cada subset se calcula la entropia
  subsets.forEach((subset) => {
    const classValuesOfSubset = getValuesOfColumn(
      subset.examples,
      indexOfClasses
    );

    const occurrencesOfClassesForSubset = countOccurrences(classValuesOfSubset);

    let subsetEntropy = 0;

    Object.values(occurrencesOfClassesForSubset).forEach(
      (occurrencesOfClass) => {
        const Pcj = occurrencesOfClass / subset.occurrences;
        subsetEntropy += -(Pcj * log2(Pcj));
      }
    );

    subset.entropy = subsetEntropy;
  });

  // entropia del conjunto

  let entropy = 0;

  subsets.forEach((subset) => {
    const { entropy: subsetEntropy, occurrences } = subset;

    entropy += (occurrences / n) * subsetEntropy;
  });

  return entropy;
};

// ganancia de informacion
const gain = (entropyD, entropyOfAttr) => entropyD - entropyOfAttr;

// tasa de ganancia
const gainRatio = (gainValue, dataframe, indexOfAttribute) => {
  // denominador en la formula para el calculo
  let splitInfo = 0;

  let occurrencesOfValues = countValuesOcurrences(
    dataframe.data,
    indexOfAttribute
  );

  let valuesNames = Object.keys(occurrencesOfValues);

  valuesNames.forEach((eachValue) => {
    let valueName = eachValue;
    let allExamples = dataframe.data.length;
    let probability = occurrencesOfValues[valueName] / allExamples;
    splitInfo += probability * log2(probability);
  });

  return gainValue / Math.abs(splitInfo);
};

// control por 1er caso base: todos los ejemplos percetenecen a la misma clase
const uniqueClass = (data) => {
  // La ultima columna siempre sera la clase
  return data.every((val, i, arr) => val === arr[0]);
};

// control por 2do caso base: el conjunto de atributos es vacio
const attributesEmpty = (attributes) => {
  return attributes.length === 1;
};

// id de cada nodo
var contId = 0;

// Algoritmo C4.5
/**
 *
 * @param {*} dataFrame: conjunto de datos en cada llamada de la recursion
 * @param {*} attributes: conjunto de atributos en cada llamada de la recursion
 * @param {*} tree: arbol de decision generado hasta el momento
 * @param {*} currentNodes: arreglo de nodos para generar la estructura (grafica) del arbol
 * @param {*} threshold: valor de umbral
 * @returns
 */
const decisionTree = (
  dataFrame,
  attributes = [],
  tree,
  currentNodes,
  threshold
) => {
  var bestGain = {};
  const gains = [];
  const gainsRatio = [];
  let fatherNode = tree.id;
  let calcMethod = tree.calcMethod;
  var tree = new Tree();
  tree.calcMethod = calcMethod;
  tree.father = fatherNode;

  let indexOfClasses =
    dataFrame.col_data.length - 1 == -1
      ? dataFrame.columns.length - 1
      : dataFrame.col_data.length - 1;

  // Cuando llega al ultimo attributo , el segundo termino lo convierte a array
  // valores de las clases
  const dataArray =
    dataFrame.col_data[indexOfClasses] ||
    new Array(dataFrame.columns[indexOfClasses]);

  if (uniqueClass(dataArray)) {
    // 1er caso base del algoritmo C4.5
    let classes = countValuesOcurrences(dataFrame.data, indexOfClasses);
    let ocurrences = Object.values(classes)[0];
    classes = Object.entries(classes).map((e) => ({ [e[0]]: e[1] }));
    tree.classValue = Object.keys(classes[0])[0];
    tree.leafConfidence = `${ocurrences}/${ocurrences}`;
    tree.isLeaf = true;
    tree.id = contId;
    contId += 1;
    currentNodes.push(tree);
    return;
  } else if (attributesEmpty(attributes)) {
    // 2do caso base del algoritmo C4.5
    let classes = countOccurrences(dataFrame.col_data[indexOfClasses]);

    classes = Object.entries(classes).map((e) => ({ [e[0]]: e[1] }));

    // se ordenan las clases segun ganancia en forma descendente
    classes.sort(function (a, b) {
      // return b.gain - a.gain;
      return Object.values(b) - Object.values(a)
    });

    let mostCommonClass = Object.values(classes[0])[0];
    let totalOcurrences = 0;

    classes.map((eachClass) => {
      totalOcurrences += Object.values(eachClass)[0];
    });

    let confidence = `${mostCommonClass} / ${totalOcurrences}`;

    tree.classValue = Object.keys(classes[0])[0];
    tree.leafConfidence = confidence;
    tree.isLeaf = true;
    tree.id = contId;
    contId += 1;
    currentNodes.push(tree);
    return;
  } else {
    // Entropia del conjunto
    let entropyD = impurityEval1(dataFrame);

    let indexOfClass =
      dataFrame.col_data.length - 1 == -1
        ? dataFrame.columns.length - 1
        : dataFrame.col_data.length - 1;

    // Iteracion para calcular la entropia de cada atributo
    attributes.forEach((attribute, index) => {
      if (index !== indexOfClass) {
        const entropyAttribute = impurityEval2(index, dataFrame);
        tree.entropy = entropyAttribute;

        // se setean todas las ganancias
        gains.push({
          attribute: attribute,
          gain: gain(entropyD, entropyAttribute),
          index: index,
        });

        let attributeGain = gains[index].gain;

        if (tree.calcMethod === 'gain') {
          // ganancia de informacion

          // se ordenan las ganancias en forma descendente
          gains.sort(function (a, b) {
            return b.gain - a.gain;
          });

          bestGain = gains[0];
        } else if (tree.calcMethod === 'gainRatio') {
          // tasa de ganancia

          gainsRatio.push({
            index: index,
            attribute: attribute,
            gain: gainRatio(attributeGain, dataFrame, index),
          });

          // se ordenan las tasas de ganancia en forma descendente
          gainsRatio.sort(function (a, b) {
            return b.gain - a.gain;
          });

          bestGain = gainsRatio[0];
        } else {
          console.log('Metodo de calculo incorrecto');
        }
      }
    });

    if (bestGain.gain < threshold) {
      // 3er caso base del algoritmo C4.5
      // la mejor ganancia no supera el valor threshold
      let classes = countValuesOcurrences(dataFrame.data, indexOfClasses);
      
      classes = Object.entries(classes).map((e) => ({ [e[0]]: e[1] }));

      // se ordenan las clases segun valores para obtener la mas frecuente
      classes.sort(function (a, b) {
        // return b.gain - a.gain;
        return Object.values(b) - Object.values(a)
      });
      
      let ocurrences = Object.values(classes[0])[0];
      tree.classValue = Object.keys(classes[0])[0];
      tree.leafConfidence = `${ocurrences}/${ocurrences}`;
      tree.isLeaf = true;
      tree.id = contId;
      contId += 1;
      currentNodes.push(tree);
      return;
    } else {
      calcMethod == 'gain'
        ? (tree.gain = bestGain.gain)
        : (tree.gainRatio = bestGain.gain);

      const { subsets, valuesOfAttr } = partition(bestGain.index, dataFrame);

      // se obtienen las particiones y se elimina el atributo con la mejor ganancia/tasa de ganancia
      let attributesWithoutSelected = attributes.filter(
        (att, index) => index != bestGain.index
      );

      tree.node = bestGain.attribute;
      tree.branches = valuesOfAttr;
      tree.id = contId;
      contId += 1;
      currentNodes.push(tree);

      // se iteran las particiones de los subconjuntos para llamar a la recursion
      subsets.forEach((subset) => {
        if (subset.length > 0 && subset[0].length > 0) {
          let df = new dfd.DataFrame(subset);
          df.columns = attributesWithoutSelected;
          return decisionTree(
            df,
            attributesWithoutSelected,
            tree,
            currentNodes,
            threshold
          );
        }
      });
    }
  }
  // array con todos los nodos del arbol
  return currentNodes;
};

/**
 *
 * @param {*} dataFrame: dataset que se obtiene desde el frontend
 * @param {*} method: metodo de calculo, el cual puede ser "gain" o "gainRatio"
 * @param {*} thresholdCal: valor de umbral o threshold [0.01; 1]
 * @returns el array currentNodes que se obtiene desde decisionTree() cuando finaliza la recursion
 */
const main = (dataFrame, method, thresholdCal = 0.1) => {
  var tree = new Tree();
  tree.calcMethod = method;
  const { columns: attributes } = dataFrame;
  var currentNodes = [];
  return decisionTree(dataFrame, attributes, tree, currentNodes, thresholdCal);
};

export default main;
