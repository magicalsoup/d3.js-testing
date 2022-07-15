import React, { useRef, useMemo, useState, useEffect } from "react";
import ForceGraph from "./components/forceGraph";
import * as d3 from "d3";
import "./App.css"

export default function App() {
  const [charge, setCharge] = useState(-3);
  // const [width, setWidth] = useState(0);
  // const [height, setHeight] = useState(0);
  // const ref = useRef(null);
  // useEffect(() => {
  //   console.log("width", ref.current.offsetWidth);
  //   setWidth(ref.current.offsetWidth);
  //   setHeight(ref.current.offsetHeight);
  // }, []);
  const nodes = useMemo(
    () => d3.range(5).map((n) => {
      return { 
        id: n, 
        r: 75,
        src: "https://i.scdn.co/image/ab67706f0000000321aab90a9c6d10ccca8d6c78"
      };
    }),[]
  );
  const links = useMemo(
    () => d3.range(5).map((n) => {
      return { 
        id: n,
        source: n,
        target: parseInt(Math.random()*5),
      };
    }),[]
  );

  return (
    <div className="App">
      <header className="App-header">
        Force Graph Example
      </header>
      <h1>React and D3 force graph</h1>
          <p>Current charge: {charge}</p>
          <input
            type="range"
            min="-5000"
            max="30"
            step="1"
            value={charge}
            onChange={(e) => setCharge(e.target.value)}
          />
      {/* <div ref={ref} className="Main">
          <svg width="100%" height="100%"> */}
        
            <ForceGraph nodes={nodes} links={links} charge={charge}/>
          
          {/* </svg>  
      </div> */}
    </div>
  );
}
