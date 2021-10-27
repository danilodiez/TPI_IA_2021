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
  const [treeNodes, setTreeNodes] = useState(undefined);
  const [treeBranches, setTreeBranches] = useState(undefined);

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
      const resultTree = main(dataFrame);
      setTreeNodes(generateNodes(resultTree));
      setTreeBranches(generateBranches(resultTree));
    }
  }, [dataFrame]);

  return (
    <div className="container-tree">
      <h1 className="text-center p-4 mt-4">Tree</h1>
      <VisNetwork nodes={treeNodes} edges={treeBranches}/>
      <div className="p-4 d-flex justify-content-center">
        {(treeNodes && treeBranches) &&
          <Button
            text="Volver a la carga"
            type="info"
            size="lg"
            style={{ color: 'black' }}
            onClick={redirect}
          />
        }
      </div>
    </div>
  );
};

export default TreeScreen;
