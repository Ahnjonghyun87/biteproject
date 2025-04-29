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

  const divisions = 10;
  const baseR = 255;
  const baseG = 240;
  const minR = 255;
  const maxG = 200;

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 50;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // ✅ 초기화 (렌더링 다시할 때마다 깨끗이)

    // 전체 배경
    // svg
    //   .append("rect")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("fill", "#eee")
    //   .attr("rx", 10)
    //   .attr("ry", 10);

    // 막대 (현재 지수)
    // svg
    //   .append("rect")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("width", (value / 100) * width) //먼저 width를 10등 분 후 값을 화살표로 10등분한 것의 백분율 위치에 표기
    //   //표기하는 숫자와 화살표가 있어야 함

    //   .attr("height", height)
    //   .attr("fill", value < 50 ? "red" : "green") // 50 기준 빨강/초록
    //   .attr("rx", 10)
    //   .attr("ry", 10);

    // svg
    //   .append("rect")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   // .attr("width", (value / 100) * width) //먼저 width를 10등 분 후 값을 화살표로 10등분한 것의 백분율 위치에 표기
    //   //표기하는 숫자와 화살표가 있어야 함

    //   .attr("height", height)
    //   // .attr("fill", "white") // 50 기준 빨강/초록
    //   .attr("rx", 10)
    //   .attr("ry", 10);

    // 텍스트 중앙 표시

    // const divisionWidth = width / divisions;
    // for (let i = 0; i <= divisions; i++) {
    //   svg
    //     .append("line")
    //     .attr("x1", i * divisionWidth)
    //     .attr("y1", 0)
    //     .attr("x2", i * divisionWidth)
    //     .attr("y2", height)
    //     .attr("stroke", "white")
    //     .attr("stroke-width", 1);
    // }

    //  전체 배경
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#ffffff")
      .attr("rx", 10)
      .attr("ry", 10);
    // const divisionWidth = width / divisions;

    // for (let i = 0; i < divisions; i++) {
    //   const r = Math.round(255 - (255 / (divisions - 1)) * i);
    //   const g = Math.round((128 / (divisions - 1)) * i);
    //   const b = 0;
    //   const color = `rgb(${r}, ${g}, ${b})`;

    //   svg
    //     .append("rect")
    //     .attr("x", i * divisionWidth)
    //     .attr("y", 0)
    //     .attr("width", divisionWidth)
    //     .attr("height", height)
    //     .attr("fill", color)
    //     .attr("stroke", "white")
    //     .attr("stroke-width", 1)
    //     .attr("rx", 6) // 👈 둥글게 만들기
    //     .attr("ry", 6); // 👈 위아래 둥글게
    // }

    const divisionWidth = width / divisions;
    const activeDivisions = Math.round((value / 100) * divisions);

    for (let i = 0; i < divisions; i++) {
      const isActive = i < activeDivisions;

      // 채워진 부분일 경우 컬러 계산
      // const r = Math.round(255 - (255 / (divisions - 1)) * i);
      // const g = Math.round((128 / (divisions - 1)) * i);
      // const b = 0;
      const r = Math.round(minR - ((minR - 200) / (divisions - 1)) * i);
      const g = Math.round((maxG / (divisions - 1)) * i + 100); // 시작점 자체가 밝음
      const b = 50; // 살짝 색을 추가
      const color = isActive ? `rgb(${r}, ${g}, ${b})` : "#e0e0e0"; // ❗미채워진 부분은 회색

      svg
        .append("rect")
        .attr("x", i * divisionWidth)
        .attr("y", 0)
        .attr("width", divisionWidth)
        .attr("height", height)
        .attr("fill", color)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("rx", 6)
        .attr("ry", 6);
    }

    // svg
    //   .append("text")
    //   .attr("x", width / 2)
    //   .attr("y", height / 2)
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    //   .attr("font-size", 32)
    //   .attr("fill", "white")
    //   .text(`${value}`);
  }, [value]);

  return (
    <div style={{ paddingBottom: "20px" }}>
      <svg ref={svgRef} width={600} height={50}></svg>
    </div>
  );
};

export default FearAndGreedStick;
