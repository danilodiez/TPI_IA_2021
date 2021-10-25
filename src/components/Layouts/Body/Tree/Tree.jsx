import React, { useEffect, useState } from 'react';
import main from '../../../../scripts/tree.js';
// import Graph from "react-graph-vis";
import VisNetwork from '../../../TreeGraph.jsx';
import Spinner from '../Load/Spinner/Spinner.jsx';
import './styles.css';

const TreeScreen = ({ dataFrame }) => {
  console.log('esto recibeee', dataFrame)
  const [treeNodes, setTreeNodes] = useState(undefined);
  const [treeBranches, setTreeBranches] = useState(undefined);

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

  useEffect(() => {
    if (dataFrame !== undefined) {
      const resultTree = main(dataFrame);
      setTreeNodes(generateNodes(resultTree));
      setTreeBranches(generateBranches(resultTree));
    }
  }, [dataFrame]);

  return (
    <div className="container-tree">
      {(treeNodes && treeBranches) ? 
        <VisNetwork nodes={treeNodes} edges={treeBranches}/>
        :
        <div className="d-flex justify-content-center">
          <Spinner />
        </div>
      } 
    </div>
  );
};

export default TreeScreen;
