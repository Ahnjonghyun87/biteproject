import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { UpbitDailyCandle } from "../../types/upbitCoin";

interface Props {
  data: UpbitDailyCandle[];
  candleLength: string;
  onLoadMore: () => void;
}

const CandleStickChartDemo2: React.FC<Props> = ({ data, candleLength, onLoadMore }) => {
  const svgForChart = useRef<SVGSVGElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const margin = { top: 20, right: 60, bottom: 30, left: 60 };
  const VISIBLE_CANDLE_COUNT = 200;
  const barWidth = 4;
  const totalChartWidth = data.length * barWidth;
  useEffect(() => {
    if (!data || data.length === 0) return;

    console.log("📈 CandleStickChartDemo2 재렌더됨", data.length);

    const svg = d3.select(svgForChart.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 60, bottom: 30, left: 60 };
    const chartHeight = 400 - margin.top - margin.bottom;

    const VISIBLE_CANDLE_COUNT = 200;
    const barWidth = 4;

    const visibleChartWidth = VISIBLE_CANDLE_COUNT * barWidth;
    const totalChartWidth = data.length * barWidth;

    // const candleWidth = 10;
    // const calculatedWidth = data.length * candleWidth;
    // const dynamicChartWidth = Math.min(calculatedWidth, 800);
    // const dynamicChartWidth = Math.max(data.length * candleWidth, 800);
    svg
      // .attr("width", dynamicChartWidth + margin.left + margin.right)
      .attr("width", totalChartWidth + margin.left + margin.right)
      .attr("height", 400)
      .style("border", "1px solid #ccc");

    const chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    //x,y축 스케일 설정
    const xScale = d3
      .scaleBand()
      .domain(
        data.map((d) => {
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
        }),
      )

      .range([totalChartWidth, 0])
      .padding(0.3);
    console.log("🔥 x축 검증", candleLength);
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.low_price)!, d3.max(data, (d) => d.high_price)!])
      .range([chartHeight, 0]);

    const domain = xScale.domain();

    const formatMonth = d3.timeFormat("%b"); // Jan, Feb, ...
    const formatYear = d3.timeFormat("%Y");

    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => {
      const index = domain.indexOf(d.toString());
      const currDate = new Date(d.toString());
      const prevDate = index > 0 ? new Date(domain[index - 1]) : null;

      const currYear = formatYear(currDate);
      const prevYear = prevDate ? formatYear(prevDate) : null;

      const currMonth = formatMonth(currDate);
      const prevMonth = prevDate ? formatMonth(prevDate) : null;

      // 연도 바뀌면 연도 출력
      if (currYear !== prevYear) return currYear;
      // 같은 연도라도 월이 바뀐 경우만 월 출력
      if (currMonth !== prevMonth) return currMonth;
      // 같은 월이면 공백
      return "";
    });
    const yAxis = d3.axisLeft(yScale);
    //x,y축 선언
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`) // x축은 아래쪽
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
  useEffect(() => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollLeft = scrollWrapperRef.current.scrollWidth;
    }
  }, [data.length]);

  return (
    <div ref={scrollWrapperRef} style={{ overflowX: "auto", width: "900px" }}>
      <div style={{ width: `${totalChartWidth + margin.left + margin.right}px` }}>
        <svg ref={svgForChart}></svg>
        {onLoadMore && (
          <button
            onClick={onLoadMore}
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              background: "#007aff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            과거 데이터 불러오기
          </button>
        )}
      </div>
    </div>
  );
};

export default CandleStickChartDemo2;
