import React, { useState } from "react";
import { Sankey, Tooltip, ResponsiveContainer } from "recharts";

interface Node {
  name: string;
}

interface Link {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: Node[];
  links: Link[];
}

interface SankeyChartProps {
  data: SankeyData;
}

const getColor = (index: number) => {
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ];
  return colors[index % colors.length];
};

const SankeyChart: React.FC<SankeyChartProps> = ({ data }) => {
  const [highlightedTargets, setHighlightedTargets] = useState<number[]>([]);
  const [clickedNode, setClickedNode] = useState<number | null>(null);

  if (!data || !data.nodes || !data.links) {
    return <p>No data available</p>;
  }

  const handleNodeClick = (index: number | null) => {
    if (index !== null) {
      const targets = data.links
        .filter((link) => link.source === index)
        .map((link) => link.target);

      setClickedNode(index);
      setHighlightedTargets(targets);
    }
  };

  return (
    <div className="w-full h-[500px] overflow-visible">
      <ResponsiveContainer>
        <Sankey
          key={`${clickedNode}-${highlightedTargets.join("-")}`}
          style={{ overflow: "visible" }}
          data={data}
          nodePadding={20}
          linkCurvature={0.5}
          margin={{ top: 20, bottom: 20, left: 150, right: 150 }}
          node={({ x, y, width, height, payload, index }) => {
            const isLeftNode = payload.depth === 0;
            const isHighlighted = highlightedTargets.includes(index);
            const isClicked = clickedNode === index;
            const nodeColor = getColor(index);

            const fillColor = isClicked
              ? "#ffffff" // Orange for clicked node
              : isHighlighted
              ? "#ffffff" // Red for highlighted nodes
              : nodeColor;

            const textX = isLeftNode ? x - 130 : x + width + 20;

            return (
              <g
                style={{
                  overflow: "visible",
                  cursor: isLeftNode ? "pointer" : "default",
                }}
                onClick={() => handleNodeClick(index)}
              >
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fillColor}
                />
                <foreignObject
                  x={textX}
                  y={y + height / 2 - 28}
                  width={150}
                  height={20}
                  style={{ overflow: "visible" }}
                >
                  <div
                    style={{
                      backgroundColor: isLeftNode ? nodeColor : "",
                      fontSize: "12px",
                      whiteSpace: "wrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      textAlign: isLeftNode ? "right" : "left",
                      width: "110px",
                      padding: isLeftNode ? "10px" : "0px",
                      borderRadius: "5px",
                    }}
                  >
                    {payload.name}
                  </div>
                </foreignObject>
              </g>
            );
          }}
          link={{ stroke: "white", opacity: 1 }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
};

export default SankeyChart;
