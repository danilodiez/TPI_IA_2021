import * as dfd from 'danfojs/src/index';
import lodash from 'lodash';
import Tree from '../classes/Tree.js';

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

  let indexOfClasses =
    data.col_data.length - 1 == -1
      ? data.columns.length - 1
      : data.col_data.length - 1;

  const indexOfAttribute =
    attributes.indexOf(attr) === -1 ? attr : attributes.indexOf(attr);
  // TODO: remove class attribute for this
  const AllValuesOfAttribute = data.col_data[indexOfAttribute];

  const possibleValuesOfAttr = [...new Set(AllValuesOfAttribute)];

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
      indexOfClasses
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

const uniqueClass = (data) => {
  //La ultima columna siempre sera la de decision
  // let decisionColumn = data[data.columns[data.columns.length - 1]];
  // si contiene una sola clase retornar true
  // return data.nunique() === 1;
  return data.every((val, i, arr) => val === arr[0]);
};

const attributesEmpty = (attributes) => {
  return attributes.length === 1;
};

var contId = 0;
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

  const dataArray =
    dataFrame.col_data[indexOfClasses] ||
    new Array(dataFrame.columns[indexOfClasses]); // Cuando llega al ultimo attributo , el segundo termino lo convierte a array

  if (uniqueClass(dataArray)) {
    //todo Hacer una leaf en treee
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
    let classes = countOccurrences(dataFrame.col_data[indexOfClasses]);

    classes = Object.entries(classes).map((e) => ({ [e[0]]: e[1] }));

    classes.sort(function (a, b) {
      return b.gain - a.gain;
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
    //Entropia del conjunto
    let entropyD = impurityEval1(dataFrame);

    let indexOfClass =
      dataFrame.col_data.length - 1 == -1
        ? dataFrame.columns.length - 1
        : dataFrame.col_data.length - 1;
    // en c4.5, linea 8 sería
    attributes.forEach((attribute, index) => {
      if (index !== indexOfClass) {
        const entropyAttribute = impurityEval2(index, dataFrame);
        tree.entropy = entropyAttribute;
        //todas las ganancias
        gains.push({
          attribute: attribute,
          gain: gain(entropyD, entropyAttribute),
          index: index,
        });

        let attributeGain = gains[index].gain;
        if (tree.calcMethod === 'gain') {
          gains.sort(function (a, b) {
            return b.gain - a.gain;
          });
          bestGain = gains[0];
        } else if (tree.calcMethod === 'gainRatio') {
          //todas las tasas de ganancia
          gainsRatio.push({
            index: index,
            attribute: attribute,
            gain: gainRatio(attributeGain, dataFrame, index),
          });
          gainsRatio.sort(function (a, b) {
            return b.gain - a.gain;
          });
          bestGain = gainsRatio[0];
        } else {
          console.log('Metodo de calculo incorrecto');
        }
      }
    });

    // Pongo en la primera posicion el atributo con la mejor ganancia o mejor reduccion de impureza

    // obtengo el atributo con la mejor ganancia
    // Esto cambie solo para probar con atributos discretos

    if (bestGain.gain < threshold) {
      let classes = countValuesOcurrences(dataFrame.data, indexOfClasses);

      classes = Object.entries(classes).map((e) => ({ [e[0]]: e[1] }));
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

      //valuesOfattr servira para la recursion
      const { subsets, valuesOfAttr } = partition(bestGain.index, dataFrame);

      //attributes.splice(bestGain.index, 1); // elimina el atributo elegido ( A - {Ag})

      let attributesWithoutSelected = attributes.filter(
        (att, index) => index != bestGain.index
      );

      tree.node = bestGain.attribute;
      tree.branches = valuesOfAttr;
      tree.id = contId;
      contId += 1;
      currentNodes.push(tree);
      //linea 17 del algoritmo
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
  return currentNodes;
};

const main = (dataFrame, method, thresholdCal = 0.1) => {
  //Ya estan seteados los valores por defecto en la primer instanciacion
  var tree = new Tree();
  tree.calcMethod = method;
  const { columns: attributes } = dataFrame;
  var currentNodes = [];
  return decisionTree(dataFrame, attributes, tree, currentNodes, thresholdCal);
};

export default main;
