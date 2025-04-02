import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { UpbitDailyCandle } from "../../types/upbitCoin";

interface Props {
  data: UpbitDailyCandle[];
}

const LineChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    svg.selectAll("*").remove(); // 초기화

    // x, y 스케일 설정
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.candle_date_time_kst)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.trade_price) as number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // 선 생성
    const line = d3
      .line<UpbitDailyCandle>()
      .x((d) => x(new Date(d.candle_date_time_kst)))
      .y((d) => y(d.trade_price));

    // 축 그리기
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5));

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

    // 라인 추가
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return <svg ref={svgRef} width={500} height={300}></svg>;
};

export default LineChart;
