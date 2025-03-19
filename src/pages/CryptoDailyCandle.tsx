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
  const { data, isPending, error } = useQuery<UpbitDailyCandle>({
    queryKey: ["btcEthDailyCandleApi"],
    queryFn: async () => {
      const response = await axios.get("https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle");
      // const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");

      return whichCrypto === "KRW-BTC" ? response.data.items[0] : response.data.items[1];
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
          key={data.market}
        >
          <Typography>{data.trade_price}</Typography>
        </Box>
      ) : (
        <Box>로딩...</Box>
      )}
    </Container>
  );
};

export default CryptoDailyCandle;
