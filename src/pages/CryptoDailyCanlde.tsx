import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { UpbitDailyCandle } from "../types/upbitCoin";

const CryptoDailyCanlde = () => {
  const { data, isPending, error } = useQuery<UpbitDailyCandle>({
    queryKey: ["btcEthApi"],
    queryFn: async () => {
      const response = await axios.get("https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle");
      // const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");

      return response.data;
    },
    staleTime: 500,
  });

  useEffect(() => {
    console.log("일봉 응답 데이터:", data);
  }, [data]);

  return <div>캔들캔들</div>;
};

export default CryptoDailyCanlde;
