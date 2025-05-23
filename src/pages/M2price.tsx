import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { M2SupplyResponse } from "../types/m2";

const M2price = () => {
  const navigate = useNavigate();
  const { data, isPending, error } = useQuery<M2SupplyResponse>({
    queryKey: ["m2monthlySupply"],
    queryFn: async () => {
      const response = await axios.get(
        "https://3z1bd0vvra.execute-api.ap-northeast-1.amazonaws.com/fred-m2-api/m2data/monthly",
      );

      return response.data;
    },
    staleTime: 1000,
  });

  useEffect(() => {
    console.log("m2통화량 데이터", data);
  }, [data]);

  if (isPending) return <div>로딩중</div>;

  if (error) return <div>로딩중 에러 발생</div>;

  if (!data || !data.items || data.items.length === 0) return <div>데이터 없음</div>;

  const latest = data.items[data.items.length - 1];

  const handleClick = () => {
    console.log("클릭됨!");
    navigate("/m2Detail", {
      state: data.items,
    });
  };
  return (
    <Box
      sx={{
        width: 420,
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: 2,
        textAlign: "center",
        boxShadow: 2,
        "&:hover": {
          // 마우스 올렸을 때 색상변화
          cursor: "pointer", // 커서 모양 손가락
        },
      }}
      onClick={handleClick}
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
        최신 M2 공급량
      </Typography>
      <Typography variant="h5" color="green">
        {Number(latest.value).toLocaleString()} (억 달러)
      </Typography>
      <Typography variant="caption" display="block" color="green">
        기준일: {latest.date}
      </Typography>
    </Box>
  );
};

export default M2price;
