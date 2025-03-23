import { Box, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { UpbitDailyCandle } from "../types/upbitCoin";

interface CryptoDetailPopUpStatus {
  whichCrypto: string;
  // setWhichCrypto: React.Dispatch<React.SetStateAction<string>>;
}

const CryptoDailyCandle: React.FC<CryptoDetailPopUpStatus> = ({ whichCrypto }) => {
  // const { data, isPending, error } = useQuery<UpbitDailyCandle>({
  //   queryKey: ["btcEthDailyCandleApi"],
  //   queryFn: async () => {
  //     const response = await axios.get("https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle");
  //     // const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");

  //     return whichCrypto === "KRW-BTC" ? response.data.items[0] : response.data.items[1];
  //   },
  //   staleTime: 500,
  // });
  const { data, isPending, error } = useQuery<UpbitDailyCandle[]>({
    queryKey: ["btcEthDailyCandleApi", whichCrypto],
    queryFn: async () => {
      const response = await axios.get("https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle");

      const matched = response.data.items
        .filter((item: UpbitDailyCandle) => item.market === whichCrypto)
        .sort(
          (a: { candle_date_time_utc: string | number | Date }, b: { candle_date_time_utc: string | number | Date }) =>
            new Date(b.candle_date_time_utc).getTime() - new Date(a.candle_date_time_utc).getTime(),
        );

      return matched.slice(0, 5); // 가장 최근의 데이터 반환
    },
    staleTime: 500,
  });
  useEffect(() => {
    console.log("일봉 응답 데이터:", data);
  }, [data]);

  return (
    <Container>
      일봉캔들
      {data ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="left" // 수직 중앙 정렬
          justifyContent="center" // 화면 중앙 정렬
          textAlign="left"
          padding={3}
          gap={1}
          sx={{ fontSize: 24, width: "100%" }}
          key={data[0].market}
        >
          {data.map((candle, index) => (
            <Typography key={index} sx={{ fontSize: 12 }}>
              {candle.candle_date_time_kst} - {candle.trade_price.toLocaleString()}원
            </Typography>
          ))}
        </Box>
      ) : (
        <Box>로딩...</Box>
      )}
    </Container>
  );
};

export default CryptoDailyCandle;
