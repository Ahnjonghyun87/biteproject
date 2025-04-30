import { Box, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FearAndGreedStick from "../components/chart/FearAndGreedStick";
import { FearAndGreedResponse } from "../types/Fear";

const FearAndGreed = () => {
  const navigate = useNavigate();
  const { data, isPending, error } = useQuery<FearAndGreedResponse>({
    queryKey: ["FearAndGreed"],
    queryFn: async () => {
      const response = await axios.get(
        "https://vimo2l3t6b.execute-api.ap-northeast-1.amazonaws.com/fear-and-greed-api/fear-and-greed/fullday",
      );

      return response.data;
    },
    staleTime: 1000,
  });

  const timeStamp = data?.items?.[data.items.length - 1]?.timestamp ?? 0;

  const date = new Date(timeStamp * 1000);
  const KstTime = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  console.log(KstTime);

  useEffect(() => {
    console.log("공탐지수", data);
  }, [data]);

  if (isPending) return <div>로딩중</div>;

  if (error) return <div>로딩중 에러 발생</div>;

  if (!data || !data.items || data.items.length === 0) return <div>데이터 없음</div>;

  const fearConditionText = data.items[data.items.length - 1].classification;

  const classificationToKorean: { [key: string]: { text: string; color: string } } = {
    "Extreme Fear": { text: "극단적 공포", color: "#d32f2f" },
    Fear: { text: "공포", color: "#f44336" },
    Neutral: { text: "중립", color: "#616161" },
    Greed: { text: "탐욕", color: "#388e3c" },
    "Extreme Greed": { text: "극단적 탐욕", color: "#2e7d32" },
  };

  const translatedText = classificationToKorean[fearConditionText] || fearConditionText;

  const handleClick = () => {
    console.log("클릭됨!");
    navigate("/FearAndGreedDetail", {
      state: {
        data,
        value: data.items[data.items.length - 1].value,
        classification: data.items[data.items.length - 1].classification,
        timestamp: data.items[data.items.length - 1].timestamp,
      },
    });
  };

  return (
    <Tooltip title="자세히보기" arrow>
      <Box
        sx={{
          width: 910,
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          textAlign: "center",
          boxShadow: 2,
          height: 100,
          "&:hover": {
            // 마우스 올렸을 때 색상변화
            cursor: "pointer", // 커서 모양 손가락
          },
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column", // 👈 세로로 쌓이게
            alignItems: "center", // 👈 가운데 정렬
            height: 150, // 👈 전체 높이 강제 지정
            justifyContent: "center", // 👈 세로 가운데
          }}
        >
          <FearAndGreedStick
            data={data.items}
            value={data.items[data.items.length - 1].value}
            classification={data.items[data.items.length - 1].classification}
            timestamp={data.items[data.items.length - 1].timestamp}
          />
          <Box
            sx={{
              mt: -1.5, // ✅ 차트와 텍스트 사이 여백
            }}
          >
            <Typography variant="subtitle1" sx={{ color: translatedText.color, fontSize: 20 }}>
              {/* {data?.items?.[data.items.length - 1]?.classification} */}
              {translatedText.text} {data.items[data.items.length - 1].value}
            </Typography>
          </Box>
        </Box>
        {/* <div>{data?.items?.[data.items.length - 1]?.value}</div>
      <div>{data?.items?.[data.items.length - 1]?.classification}</div> */}
      </Box>
    </Tooltip>
  );
};

export default FearAndGreed;
