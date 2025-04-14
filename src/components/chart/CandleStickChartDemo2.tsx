import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { UpbitDailyCandle } from "../../types/upbitCoin";

interface Props {
  data: UpbitDailyCandle[];
  candleLength: string;
  // onLoadMore: () => void;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const CandleStickChartDemo2: React.FC<Props> = ({
  data,
  candleLength,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const svgForChart = useRef<SVGSVGElement>(null);
  // const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollRef = useRef({ scrollLeft: 0, scrollWidth: 0 });
  const margin = { top: 20, right: 60, bottom: 30, left: 60 };
  const VISIBLE_CANDLE_COUNT = 200;
  const barWidth = 4;
  // const barWidth = candleLength === "daily" ? 4 : candleLength === "weekly?" ? 10 : 20;

  const totalChartWidth = data.length * barWidth;

  useEffect(() => {
    if (!data || data.length === 0) return;

    console.log("📈 CandleStickChartDemo2 재렌더됨", data.length);

    const svg = d3.select(svgForChart.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 60, bottom: 30, left: 60 };
    const chartHeight = 400 - margin.top - margin.bottom;

    const VISIBLE_CANDLE_COUNT = 200;
    const barWidth =
      candleLength === "weekly" ? 10 : candleLength === "monthly" ? 20 : candleLength === "yearly" ? 30 : 4; // 일봉 기본값

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
      .style("border", "1px solid #ccc")
      .style("cursor", "crosshair"); //크로스헤어 추가하면 마우스 스크롤시 grabbing 모양 안나옴

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

    //마우스 오버시 가격 툴팁

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

    // 캔들 모양 만들기
    data.forEach((d, i) => {
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

      chartGroup
        .append("rect")
        .attr("width", totalChartWidth)
        .attr("height", chartHeight)
        .attr("fill", "transparent")

        .on("mousemove", function (event: MouseEvent) {
          const [x] = d3.pointer(event);
          const index = data.length - 1 - Math.floor(x / barWidth); // barWidth 기반으로 인덱스 추정
          const candle = data[index];
          if (!candle) return;

          const key = candle.candle_date_time_kst.slice(0, 10);
          console.log("🔥 mouseover 발생"); // ← 이거 추가해봐
          tooltip
            .style("visibility", "visible")
            .style("top", `${event.pageY - 50}px`)
            .style("left", `${event.pageX + 15}px`).html(`
              <strong>날짜:</strong> ${key}<br/>
           <strong>시가:</strong> ${candle.opening_price}<br/>
  <strong>종가:</strong> ${candle.trade_price}<br/>
  <strong>고가:</strong> ${candle.high_price}<br/>
  <strong>저가:</strong> ${candle.low_price}
            `);
        })
        // .on("mousemove", function (event: MouseEvent) {
        //   tooltip.style("top", `${event.pageY - 50}px`).style("left", `${event.pageX + 15}px`);
        // })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
        });
    });
    console.log("xScale 도메인", xScale.domain());
  }, [data, candleLength]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft } = scrollContainerRef.current;
    if (scrollLeft < 30 && hasNextPage && !isFetchingNextPage) {
      console.log("왼쪽 끝 감지됨, 다음 페이지 로딩");
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
  }, [data]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = x - startX; //drag 이동거리
      container.scrollLeft = scrollLeft - walk;

      // 왼쪽 끝 근처면 데이터 요청
      if (container.scrollLeft < 30 && hasNextPage && !isFetchingNextPage) {
        console.log("왼쪽 끝 도달 → 데이터 불러오기");
        fetchNextPage();
      }
    };
    const onMouseUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };
    // 이벤트 등록
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseUp);

    // 초기 커서 스타일
    container.style.cursor = "grab";
    // 정리
    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseUp);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div
      // ref={scrollWrapperRef}
      ref={scrollContainerRef}
      onScroll={handleScroll}
      style={{ overflowX: "auto", width: "900px", cursor: "grab" }}
    >
      <div style={{ width: `${totalChartWidth + margin.left + margin.right}px` }}>
        <svg ref={svgForChart}></svg>
        {/* {onLoadMore && (
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
        )} */}
      </div>
    </div>
  );
};

export default CandleStickChartDemo2;
