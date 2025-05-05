import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { FearAndGreedData } from "../../types/Fear";

interface FnGProps {
  data: FearAndGreedData[];

  value: string;
  classification: string;
  timestamp: string;
}

const FearAndGreedChart: React.FC<FnGProps> = ({ data, value, classification, timestamp }) => {
  const [fndCandleLength, setfndCandleLength] = useState<string>("weekly");
  const svgForChart = useRef<SVGSVGElement>(null);
  const margin = { top: 20, right: 60, bottom: 30, left: 60 };

  const barWidth = 25;

  // const visibleData = (setfndCandleLength: FearAndGreedData) => {
  //   data.slice(-30);
  // };

  // const visibleData = data.slice(-30);

  const visibleData = () => {
    switch (fndCandleLength) {
      case "weekly":
        return data.slice(-7);

      case "monthly":
        return data.slice(-30);

      case "yearly":
        return data.slice(-365);

      case "totally":
        return data; //전부 다

      default:
        return data.slice(-30); // fallback
    }
  };
  const totalChartWidth = visibleData().length * barWidth;

  const timeStamp = data?.[data.length - 1]?.timestamp ?? 0;

  const date = new Date(timeStamp * 1000);
  const KstTime = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  const classificationToKorean: { [key: string]: string } = {
    "Extreme Fear": "극단적 공포",
    Fear: "공포",
    Neutral: "중립",
    Greed: "탐욕",
    "Extreme Greed": "극단적 탐욕",
  };

  const handleChangefndCandle = (event: SelectChangeEvent) => {
    const value = event.target.value;
    console.log("🔥 선택된 값:", value);
    setfndCandleLength(event.target.value);
  };

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
      .domain(visibleData().map((d) => d.timestamp.toString()))
      .range([0, totalChartWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);

    // ✅ X축 포맷: 첫 번째만 "YYYY Mon" 형식으로 표시
    const formatMonth = d3.timeFormat("%b"); // 예: Apr
    const formatYear = d3.timeFormat("%Y"); // 예: 2025
    const formatDay = d3.timeFormat("%d"); // ✅ 일(day)을 숫자로 (01~31)

    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => {
      const date = new Date(parseInt(d.toString()) * 1000);
      if (i % 5 === 0) {
        return `${formatYear(date)} ${formatMonth(date)} ${formatDay(date)}`;
      }
      return "";
    }); //5일 단위만 출력하고 나머지는 x 를 빈 값으로 return

    chartGroup

      .selectAll("rect")
      .data(visibleData)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.timestamp.toString())!)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => {
        const h = chartHeight - yScale(d.value);
        return h > 0 ? h : 0; // ✅ 음수 방지
      })
      .attr("fill", (d) => {
        const classification = d.classification.toLowerCase(); // 예: "greed"
        if (classification.includes("extreme fear")) return "#d32f2f";
        if (classification.includes("fear")) return "#f44336";
        if (classification.includes("neutral")) return "#616161";
        if (classification.includes("greed")) return "#388e3c";
        if (classification.includes("extreme greed")) return "#2e7d32";
        return "#ccc"; // 기본값
      });

    chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).call(xAxis);

    // ✅ Y축
    chartGroup.append("g").call(d3.axisLeft(yScale));

    // chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).call(d3.axisBottom(xScale));
    // chartGroup.append("g").call(d3.axisLeft(yScale));

    //툴팁
    let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = d3.select(".d3-tooltip");

    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("position", "fixed")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "6px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "99999")
        .style("box-shadow", "0px 2px 10px rgba(0, 0, 0, 0.2)");
    }

    chartGroup
      .append("rect")
      .attr("width", totalChartWidth)
      .attr("height", chartHeight)
      .attr("fill", "transparent")
      .on("mousemove", function (event: MouseEvent) {
        const [x] = d3.pointer(event);

        const index = Math.floor(x / barWidth); // 좌측부터 0, 1, 2...
        const candle = visibleData()[index];
        if (!candle) return;
        const koreanText = classificationToKorean[candle.classification] || candle.classification;

        tooltip
          .style("visibility", "visible")
          .style("top", `${event.pageY - 50}px`)
          .style("left", `${event.pageX + 15}px`).html(`
        <strong>날짜:</strong> ${new Date(candle.timestamp * 1000).toLocaleDateString("ko-KR")}<br/>
        <strong>공탐지수:</strong> ${candle.value}<br/>
        <strong>공탐척도:</strong> ${koreanText}
      `);
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  }, [data, fndCandleLength]);

  return (
    <div style={{ overflowX: "auto", width: "900px", cursor: "grab", placeItems: "center", paddingTop: 10 }}>
      <FormControl fullWidth>
        <InputLabel id="candle-label">캔들선택</InputLabel>
        <Select
          labelId="candle-label"
          id="candle-select"
          value={fndCandleLength}
          label="캔들선택"
          onChange={handleChangefndCandle}
          onOpen={() => console.log("드롭다운 열림")}
          onClose={() => console.log("드롭다운 닫힘")}
          size="small"
          sx={{ width: 120 }}
        >
          <MenuItem value="weekly">일주일</MenuItem>
          <MenuItem value="monthly">한달간</MenuItem>
          <MenuItem value="yearly">일년간</MenuItem>
          <MenuItem value="totally">전부</MenuItem>
        </Select>
      </FormControl>
      <div style={{ width: `${totalChartWidth + margin.left + margin.right}px` }}>
        <svg ref={svgForChart}></svg>
      </div>
    </div>
  );
};

export default FearAndGreedChart;
