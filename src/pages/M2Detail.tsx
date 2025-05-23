import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import M2Chart from "../components/chart/M2Chart";

const M2Detail = () => {
  const location = useLocation();
  const state = location.state;

  if (!state || !Array.isArray(state)) {
    return <div>데이터가 없습니다.</div>;
  }

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
        <M2Chart data={state} />
      </Box>
    </Box>
  );
};

export default M2Detail;
