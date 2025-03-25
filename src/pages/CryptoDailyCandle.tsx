import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { UpbitDailyCandle } from "../types/upbitCoin";

interface CryptoDetailPopUpStatus {
  whichCrypto: string;
  // setWhichCrypto: React.Dispatch<React.SetStateAction<string>>;
}

const CryptoDailyCandle: React.FC<CryptoDetailPopUpStatus> = ({ whichCrypto }) => {
  const [candleLength, setCandleLength] = useState<string>("daily");
  // const { data, isPending, error } = useQuery<UpbitDailyCandle>({
  //   queryKey: ["btcEthDailyCandleApi"],
  //   queryFn: async () => {
  //     const response = await axios.get("https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle");
  //     // const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");

  //     return whichCrypto === "KRW-BTC" ? response.data.items[0] : response.data.items[1];
  //   },
  //   staleTime: 500,
  // });
  // const { data, isPending, error } = useQuery<UpbitDailyCandle[]>({
  //   queryKey: ["btcEthDailyCandleApi", whichCrypto],
  //   queryFn: async () => {
  //     const response = await axios.get("https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle");

  //     const matched = response.data.items
  //       .filter((item: UpbitDailyCandle) => item.market === whichCrypto)
  //       .sort(
  //         (a: { candle_date_time_utc: string | number | Date }, b: { candle_date_time_utc: string | number | Date }) =>
  //           new Date(b.candle_date_time_utc).getTime() - new Date(a.candle_date_time_utc).getTime(),
  //       );

  //     return matched.slice(0, 25); // 가장 최근의 데이터 반환
  //   },
  //   staleTime: 500,
  // });

  const { data, isPending, error } = useQuery<UpbitDailyCandle[]>({
    queryKey: ["btcEthCandleApi", whichCrypto, candleLength],
    queryFn: async () => {
      let url = "";

      // ✅ 조건에 따라 URL 설정
      switch (candleLength) {
        case "daily":
          url = "https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle/daily";
          break;
        case "weekly":
          url = "https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle/weekly";
          break;
        case "monthly":
          url = "https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle/monthly";
          break;
        case "yearly":
          url = "https://your-api.com/yearly";
          break;
        default:
          throw new Error("지원하지 않는 캔들 길이입니다.");
      }

      const response = await axios.get(url);

      // 🎯 필터링 및 정렬은 공통 처리 가능
      const matched = response.data.items
        .filter((item: UpbitDailyCandle) => item.market === whichCrypto)
        .sort(
          (a: { candle_date_time_utc: string | number | Date }, b: { candle_date_time_utc: string | number | Date }) =>
            new Date(b.candle_date_time_utc).getTime() - new Date(a.candle_date_time_utc).getTime(),
        );

      return matched.slice(0, 25);
    },
    staleTime: 500,
  });

  useEffect(() => {
    console.log("일봉 응답 데이터:", data);
  }, [data]);

  const handleChangeCandle = (event: SelectChangeEvent) => {
    const value = event.target.value;
    console.log("🔥 선택된 값:", value);
    setCandleLength(event.target.value);
  };
  console.log("🚀 ~ handleChangeCandle ~ setCandleLength:", setCandleLength);
  return (
    <Container sx={{ position: "relative", zIndex: 1500 }}>
      <FormControl fullWidth>
        <InputLabel id="candle-label">캔들선택</InputLabel>
        <Select
          labelId="candle-label"
          id="candle-select"
          value={candleLength}
          label="캔들선택"
          onChange={handleChangeCandle}
          onOpen={() => console.log("드롭다운 열림")}
          onClose={() => console.log("드롭다운 닫힘")}
        >
          <MenuItem value="daily">일봉</MenuItem>
          <MenuItem value="weekly">주봉</MenuItem>
          <MenuItem value="monthly">월봉</MenuItem>
          <MenuItem value="yearly">연봉</MenuItem>
        </Select>
      </FormControl>

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
