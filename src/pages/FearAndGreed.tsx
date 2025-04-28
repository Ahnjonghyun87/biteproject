import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import FearAndGreedStick from "../components/chart/FearAndGreedStick";
import { FearAndGreedResponse } from "../types/Fear";

const FearAndGreed = () => {
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
  return (
    <Box
      sx={{
        width: 910,
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: 2,
        textAlign: "center",
        boxShadow: 2,
        height: 50,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <FearAndGreedStick
          data={data.items}
          value={data.items[data.items.length - 1].value}
          classification={data.items[data.items.length - 1].classification}
          timestamp={data.items[data.items.length - 1].timestamp}
        />
      </Box>
      {/* <div>{data?.items?.[data.items.length - 1]?.value}</div>
      <div>{data?.items?.[data.items.length - 1]?.classification}</div> */}
    </Box>
  );
};

export default FearAndGreed;
