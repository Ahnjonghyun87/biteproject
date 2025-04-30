import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import FearAndGreedStick from "../components/chart/FearAndGreedStick";

const FearAndGreedDetail = () => {
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return <div>데이터가 없습니다.</div>;
  }

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
    const classification = data.items[index]?.classification;
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
        height: 150, // ✅ 높이 설정
        marginTop: 55,
      }}
    >
      <Box
        sx={{
          width: 910,
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          textAlign: "center",
          boxShadow: 2,
          height: 400,
          paddingTop: 40,
        }}
      >
        <Box sx={{ marginTop: -35 }}>
          <FearAndGreedStick data={data} value={value} classification={classification} timestamp={timestamp} />

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
            }}
          >
            <Box sx={{ paddingTop: 1 }}>
              오늘
              <Typography variant="subtitle1" sx={{ color: getTranslated(data.items.length - 1).color, fontSize: 20 }}>
                {getTranslated(data.items.length - 1).text} {data.items[data.items.length - 1].value}
              </Typography>
            </Box>

            <Box sx={{ paddingTop: 1 }}>
              어제
              <Typography variant="subtitle1" sx={{ color: getTranslated(data.items.length - 2).color, fontSize: 20 }}>
                {getTranslated(data.items.length - 2).text} {data.items[data.items.length - 2].value}
              </Typography>
            </Box>
            <Box sx={{ paddingTop: 1 }}>
              일주일 전
              <Typography variant="subtitle1" sx={{ color: getTranslated(data.items.length - 8).color, fontSize: 20 }}>
                {getTranslated(data.items.length - 8).text} {data.items[data.items.length - 8].value}
              </Typography>
            </Box>
            <Box sx={{ paddingTop: 1 }}>
              한달 전
              <Typography variant="subtitle1" sx={{ color: getTranslated(data.items.length - 31).color, fontSize: 20 }}>
                {getTranslated(data.items.length - 31).text} {data.items[data.items.length - 31].value}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FearAndGreedDetail;
