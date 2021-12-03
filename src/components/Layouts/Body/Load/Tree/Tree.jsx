import React, { useEffect, useState } from 'react';
import main from '../../../../../scripts/tree.js';
// import Graph from "react-graph-vis";
import VisNetwork from '../../../../TreeGraph.jsx';
import Spinner from '../Spinner/Spinner.jsx';
import Button from '../../../../Basic/Button/Button';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import './styles.css';
import BaseModal from '../../../../Basic/Modal/Modal.jsx';
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

  const generateRootForPrediction = (branches) => {
    const root = { id: '', children: [] };

    const rootId = branches[0].to;

    root.id = rootId;

    const generateChildren = (branches, father) => {
      const children = [];
      branches.forEach((branch) => {
        if (branch.from == father) {
          children.push({
            id: branch.to,
            children: generateChildren(branches, branch.to),
          });
        }
      });
      return children;
    };

    root.children = generateChildren(branches, rootId);

    console.log({ root });
  };

  useEffect(() => {
    if (dataFrame !== undefined) {
      const resultTree = main(dataFrame, 'gain', threshold);
      const resultTreeGainRatio = main(dataFrame, 'gainRatio', threshold);
      const nodesGain = generateNodes(resultTree);
      const branchesGain = generateBranches(resultTree);
      const nodesGainRatio = generateNodes(resultTreeGainRatio);
      const branchesGainRatio = generateBranches(resultTreeGainRatio);
      generateRootForPrediction(branchesGain);

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
