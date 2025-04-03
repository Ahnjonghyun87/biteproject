import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { UpbitDailyCandle } from "../../types/upbitCoin";

interface Props {
  data: UpbitDailyCandle[];
  candleLength: string;
}

const CandleStickChartDemo: React.FC<Props> = ({ data, candleLength }) => {
  const svgForChart = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgForChart.current);
    svg.selectAll("*").remove();

    svg.attr("width", 800).attr("height", 400).style("border", "1px solid #ccc");
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    //x,y축 스케일 설정
    const xScale = d3
      .scaleBand()
      .domain(
        data.map(
          (d) => {
            const time = d.candle_date_time_kst;

            if (candleLength === "daily" || candleLength === "weekly") {
              return time.slice(0, 10);
            } else if (candleLength === "monthly") {
              return time.slice(0, 7);
            } else if (candleLength === "yearly") {
              return time.slice(0, 4);
            } else {
              return time; // fallback
            }
          },

          // candleLength === "daily"
          //   ? d.candle_date_time_kst.slice(0, 10)
          //   : candleLength === "weekly"
          //     ? d.candle_date_time_kst.slice(0, 10)
          //     : candleLength === "monthly"
          //       ? d.candle_date_time_kst.slice(0, 7)
          //       : candleLength === "yearly"
          //         ? d.candle_date_time_kst.slice(0, 4)
        ),
      )

      .range([width, 0])
      .padding(0.3);
    console.log("🔥 x축 검증", candleLength);
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.low_price)!, d3.max(data, (d) => d.high_price)!])
      .range([height, 0]);
    // x,y축 시각화
    // const xAxis = d3.axisBottom(xScale).tickFormat((d,i,ticks)=>{
    //   const curr = d.toString().slice(0,7);
    //   const prev = i > 0 ? ticks[i - 1].toString().slice(0,7) : null;
    //   return curr !== prev ? curr : "";
    // });
    const domain = xScale.domain();

    const formatMonth = d3.timeFormat("%b"); // Jan, Feb, ...
    const formatYear = d3.timeFormat("%Y");
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
      const index = domain.indexOf(d.toString());
      const currDate = new Date(d.toString()); // 문자열 → Date
      const prevDate = index > 0 ? new Date(domain[index - 1]) : null;

      const currYear = formatYear(currDate);
      const prevYear = prevDate ? formatYear(prevDate) : null;

      return currYear !== prevYear
        ? currYear // 연도 바뀜 → 연도 출력
        : formatMonth(currDate); // 아니면 월 약자 출력
    });
    const yAxis = d3.axisLeft(yScale);
    //x,y축 선언
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`) // x축은 아래쪽
      .call(xAxis);

    chartGroup.append("g").call(yAxis); // y축은 왼쪽

    // 캔들 모양 만들기
    data.forEach((d) => {
      const key =
        candleLength === "daily"
          ? d.candle_date_time_kst.slice(0, 10)
          : candleLength === "weekly"
            ? d.candle_date_time_kst.slice(0, 10)
            : candleLength === "monthly"
              ? d.candle_date_time_kst.slice(0, 7)
              : candleLength === "yearly"
                ? d.candle_date_time_kst.slice(0, 4)
                : d.candle_date_time_kst;

      const x = xScale(key);
      if (x === undefined) return;
      const open = yScale(d.opening_price);
      const close = yScale(d.trade_price);
      const candleTop = Math.min(open, close);
      const candleHeight = Math.abs(open - close);
      const color = d.trade_price > d.opening_price ? "#ff0000" : "#0080ff";
      chartGroup
        .append("rect")
        .attr("x", x)
        .attr("y", candleTop)
        .attr("width", xScale.bandwidth())
        .attr("height", candleHeight)
        .attr("fill", color);
    });
    console.log("xScale 도메인", xScale.domain());
  }, [data, candleLength]);

  return <svg ref={svgForChart}></svg>;
};

export default CandleStickChartDemo;
