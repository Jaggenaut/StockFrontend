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

            const fillColor = isClicked
              ? "#ffa500" // Orange for clicked node
              : isHighlighted
              ? "#ff6347" // Red for target nodes
              : "#8884d8"; // Default color

            const textX = isLeftNode ? x - 120 : x + width + 20;

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
                  y={y + height / 2 - 10}
                  width={150}
                  height={20}
                  style={{ overflow: "visible" }}
                >
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "12px",
                      whiteSpace: "wrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      textAlign: isLeftNode ? "right" : "left",
                      width: "100px",
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
