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

  const options = {// esto le da la direccion de arriba a abajo para que tenga la forma de arbol
        layout: {
          hierarchical: {
            direction: "UD",
            sortMethod: "directed",
            shakeTowards: "roots" //esto es para que cada nodo se ubique en el nivel correcto
          },
        },
        // randomSeed: undefined, // esto le da la forma redonda
        nodes: {
          shape: "dot",
          size: 10,
          shadow: true,
          borderWidth: 1,
          font: {
            size: 18,
            face: "verdana"
          },
          color: "#3CDDC5",
        },
        edges: {
          // arrow: "to",
          shadow: true,
          color: "grey",
        }
      };

  useEffect(() => {
    network.current = new Network(domNode.current, data, options);
  }, [domNode, network, data, options]);

  return <div style={{height: '80vh'}} ref={domNode} />;
};

export default VisNetwork;
