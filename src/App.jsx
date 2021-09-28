import React, { useState } from 'react'
import Tree from "react-d3-tree";
import './App.css'
const tree = {
      name: "Argentina?",
      attributes: {
        department: "8/10",
      },
      children: [
        {
          name: `Resistencia?`,
          attributes: {
            atributo: "",
          },
          children: [
            {
              name: "Facha = si",
            },
          ],
        },
        {
          name: "Corrientes?",
          attributes: {
            atributo: "",
          },
          children: [
            {
              name: "Facha = no",
            },
          ],
        },
      ],
    }

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Tree data={orgChart} orientation='vertical' />
    </div>
  );
}

export default App
