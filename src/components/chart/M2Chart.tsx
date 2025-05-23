import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

import { M2Supply } from "../../types/m2";

interface M2Props {
  data: M2Supply[];
}

const M2Chart = ({ data }: M2Props) => {
  const [m2CandleLength, setM2CandleLength] = useState<string>("monthly");
  const [m2BarWidth, setM2BarWidth] = useState<number>(25);
  const svgForChart = useRef<SVGSVGElement>(null);
  const margin = { top: 20, right: 60, bottom: 30, left: 60 };

  const visibleData = () => {
    switch (m2CandleLength) {
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

  const totalChartWidth = visibleData().length * m2BarWidth;

  const handleChangeDiCandle = (event: SelectChangeEvent) => {
    const value = event.target.value;
    console.log("🔥 선택된 값:", value);
    setM2CandleLength(value);

    switch (value) {
      case "monthly":
        setM2BarWidth(25);
        break;
      case "yearly":
        setM2BarWidth(4);
        break;
      case "totally":
        setM2BarWidth(4);
        break;
      default:
        setM2BarWidth(25);
    }
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
      .domain(visibleData().map((d) => d.date.toString()))
      .range([0, totalChartWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear().domain([0, 30000]).range([chartHeight, 0]);

    //날짜 표기

    const formatYear = d3.timeFormat("%Y");
    const formatMonth = d3.timeFormat("%b");
    const formatDay = d3.timeFormat("%d");

    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => {
      const date = new Date(d as string); //공탐지수랑은 다르게 fed 데이터는 date가 숫자임. 변환을 toString으로 안해줘도 됨. 하게되면 표기잘못됨

      if (m2CandleLength === "yearly" || m2CandleLength === "totally") {
        // 3개월마다 연도+월 표시
        if (i % 90 === 0) {
          return `${formatYear(date)} ${formatMonth(date)}`;
        }
        return "";
      }

      if (m2CandleLength === "weekly" || m2CandleLength === "monthly") {
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
      .attr("x", (d) => xScale(d.date.toString())!)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => {
        const h = chartHeight - yScale(d.value);
        return h > 0 ? h : 0; // ✅ 음수 방지
      })
      .attr("fill", (d) => {
        return "green";
      });

    chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).call(xAxis);

    // ✅ Y축
    chartGroup.append("g").call(d3.axisLeft(yScale));

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

        const index = Math.floor(x / m2BarWidth); // 좌측부터 0, 1, 2...
        const candle = visibleData()[index];
        if (!candle) return;

        tooltip
          .style("visibility", "visible")
          .style("top", `${event.pageY - 50}px`)
          .style("left", `${event.pageX + 15}px`).html(`
            <strong>날짜:</strong> ${candle.date}<br/>
            <strong>m2 지수:</strong> ${candle.value}<br/>

          `);
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  }, [data, visibleData]);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <FormControl fullWidth>
          <InputLabel id="candle-label">캔들선택</InputLabel>
          <Select
            labelId="candle-label"
            id="candle-select"
            value={m2CandleLength}
            label="캔들선택"
            onChange={handleChangeDiCandle}
            onOpen={() => console.log("드롭다운 열림")}
            onClose={() => console.log("드롭다운 닫힘")}
            size="small"
            sx={{ width: 120 }}
          >
            <MenuItem value="monthly">한달간</MenuItem>
            <MenuItem value="yearly">일년간</MenuItem>
            <MenuItem value="totally">전부</MenuItem>
          </Select>
        </FormControl>
        <Box width={300}></Box>
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
    </Box>
  );
};

export default M2Chart;
