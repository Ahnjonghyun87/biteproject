import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { FearAndGreedData } from "../../types/Fear";

interface FnGProps {
  data: FearAndGreedData[];

  value: string;
  classification: string;
  timestamp: string;
}

const FearAndGreedChart: React.FC<FnGProps> = ({ data, value, classification, timestamp }) => {
  const svgForChart = useRef<SVGSVGElement>(null);
  const margin = { top: 20, right: 60, bottom: 30, left: 60 };

  const barWidth = 4;

  const VISIBLE_CANDLE_COUNT = 200;

  const visibleChartWidth = VISIBLE_CANDLE_COUNT * barWidth;
  const totalChartWidth = data.length * barWidth;

  const timeStamp = data?.[data.length - 1]?.timestamp ?? 0;

  const date = new Date(timeStamp * 1000);
  const KstTime = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const svg = d3.select(svgForChart.current);
    svg.selectAll("*").remove();

    const chartHeight = 400 - margin.top - margin.bottom;

    svg
      .attr("width", totalChartWidth + margin.left + margin.right)
      .attr("height", 400)
      .style("border", "1px solid #ccc");

    const chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.timestamp.toString()))
      .range([totalChartWidth, 0])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.value) ?? 0, d3.max(data, (d) => d.value) ?? 100])
      .range([chartHeight, 0]);

    chartGroup
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.timestamp.toString())!)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.value))
      .attr("fill", "orange");

    chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).call(d3.axisBottom(xScale));
    chartGroup.append("g").call(d3.axisLeft(yScale));
  }, [data]);

  return (
    <div style={{ overflowX: "auto", width: "900px", cursor: "grab" }}>
      <div style={{ width: `${totalChartWidth + margin.left + margin.right}px` }}>
        <svg ref={svgForChart}></svg>
      </div>
    </div>
  );
};

export default FearAndGreedChart;
