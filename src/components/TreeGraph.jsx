import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import Spinner from '../components/Layouts/Body/Load/Spinner/Spinner';

const VisNetwork = ({nodes, edges}) => {
  const [showSpinner, setShowSpinner] = useState(true);
  // A reference to the div rendered by this component
  const domNode = useRef(null);

  // A reference to the vis network instance
  const network = useRef(null);

  const data = {
    nodes,
    edges,
  };

  const options = {
    layout: {
      hierarchical: {
        direction: "UD",
        sortMethod: "directed",
        shakeTowards: "roots"
      },
    },
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
    network.current.on("stabilizationIterationsDone", function () {
      setShowSpinner(false)
    });
  }, [domNode, network, data, options]);

  return (
    <>
      {showSpinner && 
        <div className="d-flex justify-content-center">
          <Spinner />
        </div>
      }
      <div style={{height: '70vh'}} ref={domNode} /> 
    </>
  );
};

export default VisNetwork;
