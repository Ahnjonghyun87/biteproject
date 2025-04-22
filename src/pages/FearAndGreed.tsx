import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
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

  useEffect(() => {
    console.log("공탐지수", data);
  }, [data]);

  if (isPending) return <div>로딩중</div>;

  if (error) return <div>로딩중 에러 발생</div>;

  if (!data || !data.items || data.items.length === 0) return <div>데이터 없음</div>;
  return <div>FearAndGreed</div>;
};

export default FearAndGreed;
