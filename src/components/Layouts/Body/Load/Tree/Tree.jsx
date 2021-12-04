import React, { useEffect, useState } from 'react';
import main from '../../../../../scripts/tree.js';
// import Graph from "react-graph-vis";
import VisNetwork from '../../../../TreeGraph.jsx';
import Button from '../../../../Basic/Button/Button';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import './styles.css';
import BaseModal from '../../../../Basic/Modal/Modal.jsx';
import TreeModel from 'tree-model';

const TreeScreen = () => {
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
  let tree = new TreeModel();

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

  const generateRootForPrediction = (branches, nodes) => {
    const root = { id: '', children: [], branch: '' };
    const leaves = [];

    const rootId = branches[0].to;

    root.id = rootId;
    root.node = nodes[0].label;

    const generateChildren = (branches, father) => {
      const children = [];
      branches.forEach((branch) => {
        if (branch.from == father) {
          // let nextNode = nodes.filter((node) => {
          //   return node.id == branch.to;
          // });

          children.push({
            id: branch.to,
            children: generateChildren(branches, branch.to),
            branch: branch.label,
            // node: nextNode[0].label,
          });
        }
      });

      if (children.length === 0) leaves.push(father);
      // console.log('children');
      // console.log(children);

      return children;
    };

    root.children = generateChildren(branches, rootId);
    return { root, leaves };
  };

  useEffect(() => {
    if (dataFrame !== undefined) {
      const resultTree = main(dataFrame, 'gain', threshold);
      const resultTreeGainRatio = main(dataFrame, 'gainRatio', threshold);
      const nodesGain = generateNodes(resultTree);
      const branchesGain = generateBranches(resultTree);
      const nodesGainRatio = generateNodes(resultTreeGainRatio);
      const branchesGainRatio = generateBranches(resultTreeGainRatio);
      let { root: rootStructure, leaves } = generateRootForPrediction(
        branchesGain,
        nodesGain
      );

      const testSet = location.state.testSet;

      const root = tree.parse(rootStructure);

      const leavesPaths = [];

      leaves.forEach((leaf) => {
        const leafNode = root.first((node) => {
          return node.model.id === leaf;
        });

        leavesPaths.push(leafNode.getPath());
      });

      // leavesPaths tiene todos los caminos del arbol
      // lo que faltaria es: por cada registro de testSet.data comparar con cada camino y ver si la prediccion es correcta
      // y en base a eso determinar la precision

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

  return (
    <div className="container-tree">
      <h4 className="text-center">Generación con ganancia </h4>
      <VisNetwork nodes={treeNodesGain} edges={treeBranchesGain} />
      <h4 className="text-center mt-2">Generación con tasa de ganancia </h4>
      <VisNetwork nodes={treeNodesGainRatio} edges={treeBranchesGainRatio} />
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

export default TreeScreen;
