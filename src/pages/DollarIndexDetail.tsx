import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import DollarIndexChart from "../components/chart/DollarIndexChart";

const DollarIndexDetail = () => {
  const location = useLocation();
  const state = location.state;

  if (!state || !Array.isArray(state.data)) {
    return <div>데이터가 없습니다.</div>;
  }

  console.log("달러인덱스차트 테스트");
  const items = state.data;

  const { data } = state;
  return (
    <Box
      sx={{
        width: "100%", // ✅ 전체 너비를 기준으로
        display: "flex", // ✅ flex 정렬
        justifyContent: "center", // ✅ 수평 중앙
        alignItems: "center", // ✅ 수직 중앙 (height가 있을 때)
        height: 400, // ✅ 높이 설정
        marginTop: 35,
      }}
    >
      <Box>
        <DollarIndexChart data={data} />
      </Box>
    </Box>
  );
};

export default DollarIndexDetail;
