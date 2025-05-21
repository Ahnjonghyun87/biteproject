import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import FearAndGreedChart from "../components/chart/FearAndGreedChart";
import FearAndGreedStick from "../components/chart/FearAndGreedStick";

const FearAndGreedDetail = () => {
  const location = useLocation();
  const state = location.state;

  if (!state || !Array.isArray(state.data)) {
    return <div>데이터가 없습니다.</div>;
  }

  const items = state.data;

  const { data, value, classification, timestamp } = state;

  const classificationToKorean: { [key: string]: { text: string; color: string } } = {
    "Extreme Fear": { text: "극단적 공포", color: "#d32f2f" },
    Fear: { text: "공포", color: "#f44336" },
    Neutral: { text: "중립", color: "#616161" },
    Greed: { text: "탐욕", color: "#388e3c" },
    "Extreme Greed": { text: "극단적 탐욕", color: "#2e7d32" },
  };

  const translatedText = classificationToKorean[classification] || { text: classification, color: "#000" };

  const getTranslated = (index: number) => {
    const classification = items[index]?.classification;
    return classificationToKorean[classification] || { text: classification, color: "#000" };
  };
  console.log(location);

  return (
    <Box
      sx={{
        width: "100%", // ✅ 전체 너비를 기준으로
        display: "flex", // ✅ flex 정렬
        justifyContent: "center", // ✅ 수평 중앙
        alignItems: "center", // ✅ 수직 중앙 (height가 있을 때)
        height: 400, // ✅ 높이 설정
        marginTop: 65,
      }}
    >
      <Box
        sx={{
          width: 960,
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          textAlign: "center",
          boxShadow: 2,
          height: 800,
          paddingTop: 40,
        }}
      >
        <Box sx={{ marginTop: -35 }}>
          <FearAndGreedStick data={items} value={value} classification={classification} timestamp={timestamp} />

          <Box
            sx={{
              width: 400,
              border: "1px solid #ccc",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // ← 수직 축 중앙
              justifyContent: "center", // ← 수평 축 중앙
              margin: "0 auto",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontSize: 20 }}>
              지난 한달간 공포 탐욕 지수는..
            </Typography>
          </Box>
          <Box
            sx={{
              width: 400,
              border: "1px solid #ccc",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // ← 수직 축 중앙
              justifyContent: "center", // ← 수평 축 중앙
              margin: "0 auto",
              marginTop: 1,
              height: 350,
            }}
          >
            <Box sx={{ width: 300 }}>
              오늘
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center", // 세로 중앙 정렬 (필요하면)
                  width: "100%", // 부모 너비 기준으로 정렬
                  color: getTranslated(items.length - 1).color,
                  fontSize: 20,
                }}
              >
                <span style={{ color: getTranslated(items.length - 1).color }}>
                  {getTranslated(items.length - 1).text}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    color: "white",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    backgroundColor: getTranslated(items.length - 1).color,
                  }}
                >
                  {items[items.length - 1].value}
                </span>
              </Typography>
            </Box>

            <Box sx={{ paddingTop: 2, width: 300 }}>
              어제
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center", // 세로 중앙 정렬 (필요하면)
                  width: "100%", // 부모 너비 기준으로 정렬

                  color: getTranslated(items.length - 2).color,
                  fontSize: 20,
                }}
              >
                <span style={{ color: getTranslated(items.length - 2).color }}>
                  {getTranslated(items.length - 2).text}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    color: "white",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    backgroundColor: getTranslated(items.length - 2).color,
                  }}
                >
                  {items[items.length - 2].value}
                </span>
              </Typography>
            </Box>
            <Box sx={{ paddingTop: 2, width: 300 }}>
              일주일 전
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center", // 세로 중앙 정렬 (필요하면)
                  width: "100%", // 부모 너비 기준으로 정렬

                  color: getTranslated(items.length - 8).color,
                  fontSize: 20,
                }}
              >
                <span style={{ color: getTranslated(items.length - 8).color }}>
                  {getTranslated(items.length - 8).text}
                </span>

                <span
                  style={{
                    display: "inline-block",
                    color: "white",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    backgroundColor: getTranslated(items.length - 8).color,
                  }}
                >
                  {items[items.length - 8].value}
                </span>
              </Typography>
            </Box>
            <Box sx={{ paddingTop: 2, width: 300 }}>
              한달 전
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center", // 세로 중앙 정렬 (필요하면)
                  width: "100%", // 부모 너비 기준으로 정렬
                  color: getTranslated(items.length - 31).color,
                  fontSize: 20,
                }}
              >
                <span style={{ color: getTranslated(items.length - 31).color }}>
                  {getTranslated(items.length - 31).text}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    color: "white",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    backgroundColor: getTranslated(items.length - 31).color,
                  }}
                >
                  {items[items.length - 31].value}
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ paddingTop: 5 }}>
          차트
          <FearAndGreedChart data={items} value={value} classification={classification} timestamp={timestamp} />
        </Box>
      </Box>
    </Box>
  );
};

export default FearAndGreedDetail;
