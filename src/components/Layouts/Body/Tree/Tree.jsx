import React, { useEffect, useState } from 'react';
import main from '../../../../scripts/tree.js';
// import Graph from "react-graph-vis";
import VisNetwork from '../../../TreeGraph.jsx';

const TreeScreen = ({ dataframe }) => {
  const [treeNodes, setTreeNodes] = useState(undefined);
  const [treeBranches, setTreeBranches] = useState(undefined);
  // process CSV data

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

  return (
    <>
      <div>
        <h1>Tree</h1>

        <input type="file" accept=".csv,.xlsx,.xls, .txt" />
      </div>
      <div style={{ border: '2px solid red', height: '80vh' }}>
        {treeNodes && <VisNetwork nodes={treeNodes} edges={treeBranches} />}
      </div>
    </>
  );
};

export default TreeScreen;
