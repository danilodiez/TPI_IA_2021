import React, { useEffect, useState } from 'react';
import main from '../../../../../scripts/tree.js';
// import Graph from "react-graph-vis";
import VisNetwork from '../../../../TreeGraph.jsx';
import Spinner from '../Spinner/Spinner.jsx';
import Button from '../../../../Basic/Button/Button';
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router';
import './styles.css';

const TreeScreen = () => {
  const location = useLocation();
  const history = useHistory();
  const [dataFrame, setdataFrame] = useState(undefined);
  const [treeNodesGain, setTreeNodesGain] = useState(undefined);
  const [treeBranchesGain, setTreeBranchesGain] = useState(undefined);
    const [treeNodesGainRatio, setTreeNodesGainRatio] = useState(undefined);
    const [treeBranchesGainRatio, setTreeBranchesGainRatio] = useState(undefined);

  const generateNodes = (tree) => {
    const nodes = [];
    tree.map((node) => {
      nodes.push({
        id: node.id,
        label: node.node === '' ? node.classValue : node.node,
      });
    });
    return nodes;
  };
  const generateBranches = (tree) => {
    const branches = [];
    tree.reverse().map((node) => {
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
    return branches;
  };

  const redirect = () => {
    history.push("/load")
  }

  useEffect(() => {
    setdataFrame(location.state.dataFrame)
  }, [location.state.dataFrame]);

  useEffect(() => {
    if (dataFrame !== undefined) {
      const resultTreeGain = main(dataFrame);
      setTreeNodesGain(generateNodes(resultTreeGain));
      setTreeBranchesGain(generateBranches(resultTreeGain));
      const resultTreeGainRatio = main(dataFrame, "gainRatio");
      setTreeNodesGainRatio(generateNodes(resultTreeGainRatio));
      setTreeBranchesGainRatio(generateBranches(resultTreeGainRatio));
    }
  }, [dataFrame]);

  return (
    <div className="container-tree">
      <h1 className="text-center p-4 mt-4">Árbol de decisión</h1>
      <h2 className="text-center p-4 mt-4">Generación con ganancia </h2>
      <VisNetwork nodes={treeNodesGain} edges={treeBranchesGain} />
      <h2 className="text-center p-4 mt-4">Generación con tasa de ganancia </h2>
      <VisNetwork nodes={treeNodesGainRatio} edges={treeBranchesGainRatio} />
      <div className="p-4 d-flex justify-content-center">
        {treeNodesGain && treeBranchesGain && (
          <Button
            text="Volver a la carga"
            type="info"
            size="lg"
            style={{ color: "black" }}
            onClick={redirect}
          />
        )}
      </div>
    </div>
  );
};

export default TreeScreen;
