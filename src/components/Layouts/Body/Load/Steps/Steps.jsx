import React, { useEffect, useState } from 'react';
import main from '../../../../../scripts/tree.js';
import VisNetwork from '../../../../TreeGraph.jsx';
import Button from '../../../../Basic/Button/Button';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import BaseModal from '../../../../Basic/Modal/Modal.jsx';
const Steps = () => {
  const location = useLocation();
  const history = useHistory();
  const [dataFrame, setdataFrame] = useState(undefined);
  const [treeNodesGain, setTreeNodesGain] = useState(undefined);
  const [treeBranchesGain, setTreeBranchesGain] = useState(undefined);
  const [treeNodesGainRatio, setTreeNodesGainRatio] = useState(undefined);
  const [treeBranchesGainRatio, setTreeBranchesGainRatio] = useState(undefined);
  const [threshold, setThreshold] = useState(undefined);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(undefined);

  const [gainStep, setGainStep] = useState(0);
  const [gainTreeSteps, setGainTreeSteps] = useState([]);

  const [gainRatioStep, setGainRatioStep] = useState(0);
  const [gainRatioTreeSteps, setGainRatioTreeSteps] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const generateNodes = (tree) => {
    const nodes = [];
    if (tree) {
      tree.map((node) => {
        let tooltipInfo = '';
        //Se agrega la info del nodo dependiendo si es nodo de decision o nodo hoja
        if (node.isLeaf) {
          tooltipInfo = `Confidence: ${node.leafConfidence}`;
        } else {
          tooltipInfo =
            node.calcMethod === 'gainRatio'
              ? `GainRatio: ${node.gainRatio} \n Entropy: ${node.entropy}`
              : `Gain: ${node.gain} \n Entropy: ${node.entropy} `;
        }

        nodes.push({
          id: node.id,
          label: node.node === '' ? node.classValue : node.node,
          title: tooltipInfo,
        });
      });
    }
    return nodes;
  };
  const generateBranches = (tree) => {
    const branches = [];
    if (tree) {
      tree.map((node) => {
        if (node.father !== '') {
          let father = tree.filter((n, index) => n.id === node.father);
          const label = father[0]?.branches.shift();
          branches.push({
            from: node.father,
            to: node.id,
            label,
          });
        }
      });
    }
    return branches;
  };

  const redirect = () => {
    history.push('/load');
  };

  useEffect(() => {
    setdataFrame(location.state.dataFrame);
    setThreshold(location.state.threshold);
  }, [location.state.dataFrame]);

  const generateSteps = (nodes, branches) => {
    // por como estaba hecha la estructura antes, es necesario invertir los arreglos de nodos y ramas
    nodes.reverse();
    branches.reverse();

    const steps = [];
    let currentLevel = 0;
    let fathersOfNextLevelNodes = [];

    const rootBranch = branches[branches.length - 1];
    const rootNode = nodes.filter((node) => node.id === rootBranch.to)[0];

    // generar 1er paso
    steps.push({
      nodes: [rootNode],
      branches: [rootBranch],
    });

    // remuevo la rama que LLEGA a la root
    branches.splice(branches.length - 1, 1);

    while (branches.length > 0) {
      steps[currentLevel].branches.forEach((branch) => {
        fathersOfNextLevelNodes.push(branch.to);
      });

      // generar nuevo paso
      steps.push({
        nodes: [...steps[currentLevel].nodes],
        branches: [...steps[currentLevel].branches],
      });

      branches.forEach((branch, index) => {
        fathersOfNextLevelNodes.forEach((fatherId) => {
          if (fatherId === branch.from) {
            steps[currentLevel + 1].branches.push(branch);

            // remuevo la rama
            branches.splice(index, 1);

            steps[currentLevel + 1].nodes.push(
              nodes.filter((node) => node.id === branch.to)[0]
            );
          }
        });
      });

      fathersOfNextLevelNodes = [];
      currentLevel += 1;
    }

    return steps;
  };

  useEffect(() => {
    if (dataFrame !== undefined) {
      const resultTree = main(dataFrame, 'gain', threshold);
      const resultTreeGainRatio = main(dataFrame, 'gainRatio', threshold);
      const nodesGain = generateNodes(resultTree);
      const branchesGain = generateBranches(resultTree);
      const nodesGainRatio = generateNodes(resultTreeGainRatio);
      const branchesGainRatio = generateBranches(resultTreeGainRatio);

      setGainTreeSteps(generateSteps([...nodesGain], [...branchesGain]));
      setGainRatioTreeSteps(
        generateSteps([...nodesGainRatio], [...branchesGainRatio])
      );

      if (nodesGain.length > 0) {
        setTreeNodesGain(nodesGain);
        setTreeBranchesGain(branchesGain);
      } else {
        setModalMessage(
          `El Algoritmo no fue capaz de generar un arbol con un umbral de ${threshold}`
        );
        openModal();
      }
      if (nodesGainRatio.length > 0) {
        setTreeNodesGainRatio(nodesGainRatio);
        setTreeBranchesGainRatio(branchesGainRatio);
      } else {
        setModalMessage(
          `El Algoritmo no fue capaz de generar un arbol con un umbral de ${threshold}`
        );
        openModal();
      }
    }
  }, [dataFrame]);

  // ganancia
  const handleNextGainStep = () => {
    if (gainStep + 1 < gainTreeSteps.length) {
      setGainStep(gainStep + 1);
    }
  };
  const handlePreviousGainStep = () => {
    if (gainStep - 1 > -1) {
      setGainStep(gainStep - 1);
    }
  };

  // tasa de ganancia
  const handleNextGainRatioStep = () => {
    if (gainRatioStep + 1 < gainRatioTreeSteps.length) {
      setGainRatioStep(gainRatioStep + 1);
    }
  };
  const handlePreviousGainRatioStep = () => {
    if (gainRatioStep - 1 > -1) {
      setGainRatioStep(gainRatioStep - 1);
    }
  };

  return (
    <div className="container-tree">
      <h2 className="text-center">Árbol de decisión</h2>
      <h4 className="text-center">Generación con ganancia </h4>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        <Button
          text="Atras"
          size="sm"
          onClick={handlePreviousGainStep}
          disabled={gainStep === 0}
        />
        <Button
          text="Siguiente"
          size="sm"
          onClick={handleNextGainStep}
          disabled={gainStep === gainTreeSteps.length - 1}
        />
      </div>
      <VisNetwork
        nodes={gainTreeSteps[gainStep]?.nodes}
        edges={gainTreeSteps[gainStep]?.branches}
      />
      <h4 className="text-center mt-2">Generación con tasa de ganancia </h4>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        <Button
          text="Atras"
          size="sm"
          onClick={handlePreviousGainRatioStep}
          disabled={gainRatioStep === 0}
        />
        <Button
          text="Siguiente"
          size="sm"
          onClick={handleNextGainRatioStep}
          disabled={gainRatioStep === gainRatioTreeSteps.length - 1}
        />
      </div>
      <VisNetwork
        nodes={gainRatioTreeSteps[gainRatioStep]?.nodes}
        edges={gainRatioTreeSteps[gainRatioStep]?.branches}
      />
      <div className="p-4 d-flex justify-content-center">
        {treeNodesGain && treeBranchesGain && (
          <Button
            text="Volver a la carga"
            type="info"
            size="lg"
            style={{ color: 'black' }}
            onClick={redirect}
          />
        )}
      </div>
      <BaseModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        message={modalMessage}
        showButtons
      />
    </div>
  );
};

export default Steps;
