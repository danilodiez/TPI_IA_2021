import React, { useEffect, useState } from 'react';
import main from '../../../../../scripts/tree.js';
// import Graph from "react-graph-vis";
import VisNetwork from '../../../../TreeGraph.jsx';
import Spinner from '../Spinner/Spinner.jsx';
import Button from '../../../../Basic/Button/Button';
import { useLocation } from 'react-router-dom';
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
      let tooltipInfo = '';
      //Se agrega la info del nodo dependiendo si es nodo de decision o nodo hoja
      if (node.isLeaf){
        tooltipInfo = `Confidence: ${node.leafConfidence}`;
      }else{
        tooltipInfo = node.calcMethod === 'gainRatio' ? `GainRatio: ${node.gainRatio} \n Entropy: ${node.entropy}` : `Gain: ${node.gain} \n Entropy: ${node.entropy} `
      };

      nodes.push({
        id: node.id,
        label: node.node === '' ? node.classValue : node.node,
        title: tooltipInfo
      });
    });
    return nodes;
  };
  const generateBranches = (tree) => {
    const branches = [];
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
    return branches;
  };

  const redirect = () => {
    history.push('/load');
  };

  useEffect(() => {
    setdataFrame(location.state.dataFrame);
  }, [location.state.dataFrame]);

  const generateSteps = (nodes, branches) => {
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
      // console.log(`NIVEL ACTUAL: ${currentLevel}`);

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
      const resultTree = main(dataFrame);
      const resultTreeGainRatio = main(dataFrame, 'gainRatio');
      const nodesGain = generateNodes(resultTree);
      const branchesGain = generateBranches(resultTree);
      const nodesGainRatio = generateNodes(resultTreeGainRatio);
      const branchesGainRatio = generateBranches(resultTreeGainRatio);
      setTreeNodesGain(nodesGain);
      setTreeBranchesGain(branchesGain);
      setTreeNodesGainRatio(nodesGainRatio);
      setTreeBranchesGainRatio(branchesGainRatio);
      // const steps = generateSteps([...nodes], [...branches]);
      // console.log(steps);
      // const newNodes = steps[3].nodes;
      // const newBranches = steps[3].branches;
      // console.log({ newNodes });
      // console.log({ newBranches });
      console.log('arbol de ganancia')
      console.log(resultTree)
      console.log("arbol de TASA de ganancia");
      console.log(resultTreeGainRatio);

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
