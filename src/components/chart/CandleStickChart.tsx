import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { UpbitDailyCandle } from "../../types/upbitCoin";

interface Props {
  data: UpbitDailyCandle[];
}

const CandlestickChart: React.FC<Props> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 10, right: 20, bottom: 30, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .html("") // 초기화
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S");
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.candle_date_time_kst))
      .range([0, width])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.low_price)! * 0.95, d3.max(data, (d) => d.high_price)! * 1.05])
      .range([height, 0]);

    // X 축
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat((d: string) => d.slice(5, 10)));

    // Y 축
    svg.append("g").call(d3.axisLeft(yScale));

    // 캔들 그리기
    svg
      .selectAll("g.candle")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "candle")
      .each(function (d) {
        const g = d3.select(this);
        const x = xScale(d.candle_date_time_kst)!;
        const color = d.trade_price > d.opening_price ? "#4caf50" : "#f44336";

        // 위아래 선 (고가 ~ 저가)
        g.append("line")
          .attr("x1", x + xScale.bandwidth() / 2)
          .attr("x2", x + xScale.bandwidth() / 2)
          .attr("y1", yScale(d.high_price))
          .attr("y2", yScale(d.low_price))
          .attr("stroke", color)
          .attr("stroke-width", 1);

        // 시가 ~ 종가 박스
        g.append("rect")
          .attr("x", x)
          .attr("y", yScale(Math.max(d.opening_price, d.trade_price)))
          .attr("width", xScale.bandwidth())
          .attr("height", Math.abs(yScale(d.opening_price) - yScale(d.trade_price)))
          .attr("fill", color);
      });
  }, [data]);

  return <svg ref={ref} width={500} height={300}></svg>;
};

export default CandlestickChart;
