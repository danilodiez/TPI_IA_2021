import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import main from "../../../../scripts/tree.js";
// import Graph from "react-graph-vis";
import VisNetwork from "../../../TreeGraph.jsx";

const TreeScreen = () => {
  const [file, setFile] = useState(undefined);
  const [csvFile, setCsvFile] = useState(undefined);
  const [treeNodes, setTreeNodes] = useState(undefined);
  const [treeBranches, setTreeBranches] = useState(undefined);
  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    setFile(list);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };
  const generateNodes = (tree) => {
    const nodes = [];
    tree.map((node) => {
      nodes.push({
        id: node.id,
        label: node.node === "" ? node.classValue : node.node,
      });
    });
    return nodes;
  };

  // { from: 1, to: 2, label: "arrow1-2" },

  const generateBranches = (tree) => {
    const branches = [];
    (tree.reverse()).map((node) => {
      if (node.father !== '' ) {
        let father = tree.filter((n, index) => n.id === node.father)
        const label = father[0]?.branches.shift()
        branches.push({
          from: node.father,
          to: node.id,
          label,
        })
      }
    });
    return branches;
  };
  useEffect(() => {
    if (file !== undefined) {
      const resultTree = main(file);
      setTreeNodes(generateNodes(resultTree));
      setTreeBranches(generateBranches(resultTree));
    }
  }, [file]);

  return (
    <>
      <div>
        <h1>Tree</h1>
        <input
          type="file"
          accept=".csv,.xlsx,.xls, .txt"
          onChange={handleFileUpload}
        />
      </div>
      <div style={{ border: "2px solid red", height: "80vh" }}>
        {treeNodes && <VisNetwork nodes={treeNodes} edges={treeBranches} />}
      </div>
    </>
  );
};

export default TreeScreen;
