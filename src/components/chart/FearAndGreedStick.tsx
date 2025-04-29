import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { FearAndGreedData } from "../../types/Fear";

interface FearAndGreedProps {
  data: FearAndGreedData[];
  value: number;

  timestamp: number;

  classification: string;
}

const FearAndGreedStick: React.FC<FearAndGreedProps> = ({ value, classification, timestamp }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 50;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // ✅ 초기화 (렌더링 다시할 때마다 깨끗이)

    // 전체 배경
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#eee")
      .attr("rx", 10)
      .attr("ry", 10);

    // 막대 (현재 지수)
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", (value / 100) * width)
      .attr("height", height)
      .attr("fill", value < 50 ? "red" : "green") // 50 기준 빨강/초록
      .attr("rx", 10)
      .attr("ry", 10);

    // 텍스트 중앙 표시
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", 32)
      .attr("fill", "black")
      .text(`${value}`);
  }, [value]);
  return (
    <div style={{ paddingBottom: "20px" }}>
      <svg ref={svgRef} width={600} height={50}></svg>
    </div>
  );
};

export default FearAndGreedStick;
