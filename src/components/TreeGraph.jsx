import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

const VisNetwork = ({nodes, edges}) => {
  // A reference to the div rendered by this component
  const domNode = useRef(null);

  // A reference to the vis network instance
  const network = useRef(null);

  const data = {
    nodes,
    edges,
  };

  const options = {};

  useEffect(() => {
    network.current = new Network(domNode.current, data, options);
  }, [domNode, network, data, options]);

  return <div style={{height: '80vh'}} ref={domNode} />;
};

export default VisNetwork;
