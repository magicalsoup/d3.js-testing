import React, { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import * as d3 from "d3";
import { select } from "d3";


// https://reactfordataviz.com/articles/force-directed-graphs-with-react-and-d3v7/
export default function ForceGraph({ nodes, links, charge}) {
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);


  // re-create animation every time nodes change
  useEffect(() => {
    const svg = select(svgRef.current);
    const {width, height} = wrapperRef.current.getBoundingClientRect();

    const simulation = d3
      .forceSimulation(nodes)
      .force("x", d3.forceX(400))
      .force("y", d3.forceY(300))
      .force("charge", d3.forceManyBody().strength(charge).theta(0.5).distanceMax(1500))
      .force("collision", d3.forceCollide(75)) // so nodes don't overlap
      .force('link', d3.forceLink(links).id(d => d.id).distance(300));

    
    // update state on every frame
    simulation.on("tick", () => {
      // to make sure the node stays within the svg box
      // https://bl.ocks.org/augmt/bff681e44e80f435e068817047923fbb
      simulation.nodes().forEach((d) => {
          d.x = Math.max(d.r, Math.min(width - d.r, d.x)); 
          d.y = Math.max(d.r, Math.min(height - d.r, d.y));
      });
      setAnimatedNodes([...simulation.nodes()]);
      // uhhhh idk how to get the nodes so uh this graph is gonna be static until page is refreshed oops
    });

    // copy nodes and links into simulation
    setAnimatedNodes([...nodes]);
    setAnimatedLinks([...links]);
    // slow down with a small alpha
    simulation.alpha(0.1).restart();

    // stop simulation on unmount
    return () => simulation.stop();
  }, [nodes, links, charge]);

  return (
    <div ref={wrapperRef} className="graph">
      <svg ref={svgRef} width="100%" height="100%">
        <g>
        {animatedLinks.map((node) => (
            <line 
              x1={node.source.x}
              y1={node.source.y}
              x2={node.target.x}
              y2={node.target.y}
              key={node.id}
              stroke="black"
              strokeWidth="2px"
            />
          ))}
          {animatedNodes.map((node) => (
            <g>     
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                key={node.id}
                strokeWidth="1px"
                className=""
              />
              <Modal node={node}></Modal>
            </g>
          ))}
          
        </g>
      </svg>
    </div>
  );
}
