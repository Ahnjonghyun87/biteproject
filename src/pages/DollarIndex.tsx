import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { DollarIndexResponse } from "../types/dollar";

const DollarIndex = () => {
  const { data, isPending, error } = useQuery<DollarIndexResponse>({
    queryKey: ["dollarIndex"],
    queryFn: async () => {
      const response = await axios.get(
        "https://6v6yorliy2.execute-api.ap-northeast-1.amazonaws.com/dollar/supply/daily",
      );

      return response.data;
    },
    staleTime: 1000,
  });

  useEffect(() => {
    console.log("달러인덱스 지수", data);
  }, [data]);

  if (isPending) return <div>로딩중</div>;

  if (error) return <div>로딩중 에러 발생</div>;

  if (!data || !data.items || data.items.length === 0) return <div>데이터 없음</div>;

  const latest = data.items[data.items.length - 1];
  return (
    <Box
      sx={{
        width: 420,
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: 2,
        textAlign: "center",
        boxShadow: 2,
      }}
    >
      <Box
        display="flex"
        flexDirection="column" // 👈 수직 정렬!
        alignItems="center"
        gap={1}
      >
        <img src="/images/dollar.svg" width={100} height={100} alt="M2" />
        <Button variant="contained">자세히보기</Button>
      </Box>

      <Typography variant="h6" color="green" sx={{ mt: 2 }}>
        달러 인덱스 지수
      </Typography>
      <Typography variant="h5" color="green">
        {Number(latest.value).toLocaleString()}
      </Typography>
      <Typography variant="caption" display="block" color="green">
        기준일: {latest.date}
      </Typography>
    </Box>
  );
};

export default DollarIndex;
