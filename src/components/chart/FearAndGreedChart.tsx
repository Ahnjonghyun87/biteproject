import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
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
  const [fndCandleLength, setFndCandleLength] = useState<string>("weekly");
  const [fndBarWidth, setFndfndBarWidth] = useState<number>(25);
  const svgForChart = useRef<SVGSVGElement>(null);
  const margin = { top: 20, right: 60, bottom: 30, left: 60 };

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
  const totalChartWidth = visibleData().length * fndBarWidth;

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
    setFndCandleLength(value);

    switch (value) {
      case "weekly":
        setFndfndBarWidth(40);
        break;
      case "monthly":
        setFndfndBarWidth(25);
        break;
      case "yearly":
        setFndfndBarWidth(4);
        break;
      case "totally":
        setFndfndBarWidth(4);
        break;
      default:
        setFndfndBarWidth(25);
    }
  };

  const totalGreed = () => {
    return visibleData().filter((d) => d.classification.toLowerCase().includes("greed")).length;
  };
  console.log("탐욕수치 합", totalGreed());

  const totalFear = () => {
    return visibleData().filter((d) => d.classification.toLowerCase().includes("fear")).length;
  };
  console.log("탐욕수치 합", totalFear());

  const totalNeutral = () => {
    return visibleData().filter((d) => d.classification.toLowerCase().includes("neutral")).length;
  };
  console.log("탐욕수치 합", totalNeutral()); // 스펠링이 natural이라고 생각하지만 여기서 데이터가 Neutral로 오고 있음.

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

    //날짜 표기

    const formatYear = d3.timeFormat("%Y");
    const formatMonth = d3.timeFormat("%b");
    const formatDay = d3.timeFormat("%d");

    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => {
      const date = new Date(parseInt(d.toString()) * 1000);

      if (fndCandleLength === "yearly" || fndCandleLength === "totally") {
        // 3개월마다 연도+월 표시
        if (i % 90 === 0) {
          return `${formatYear(date)} ${formatMonth(date)}`;
        }
        return "";
      }

      if (fndCandleLength === "weekly" || fndCandleLength === "monthly") {
        // 5일마다 연도+월+일 표시
        if (i % 5 === 0) {
          return `${formatYear(date)} ${formatMonth(date)} ${formatDay(date)}`;
        }
        return "";
      }

      return "";
    });
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

        const index = Math.floor(x / fndBarWidth); // 좌측부터 0, 1, 2...
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
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
        <Box width={100}>
          <Typography>탐욕의 날:{totalGreed()}</Typography>
          <Typography>중립의 날:{totalNeutral()}</Typography>
          <Typography>공포의 날:{totalFear()}</Typography>
        </Box>
      </Box>
      <div style={{ width: "900px", overflowX: "auto", paddingTop: 10 }}>
        <svg
          ref={svgForChart}
          style={{
            display: "block",
            marginLeft: 0,
          }}
        ></svg>
      </div>

      {/* <div style={{ overflowX: "auto", width: "900px", cursor: "grab", placeItems: "center", paddingTop: 10 }}>
        <div style={{ width: `${totalChartWidth + margin.left + margin.right}px` }}>
          <svg ref={svgForChart}></svg>
        </div>
      </div> */}
    </Box>
  );
};

export default FearAndGreedChart;
