import { Box, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { UpbitDailyCandle } from "../types/upbitCoin";
import CandleStickChartDemo2 from "./../components/chart/CandleStickChartDemo2";

interface CryptoDetailPopUpStatus {
  whichCrypto: string;
}

const CryptoDailyCandle: React.FC<CryptoDetailPopUpStatus> = ({ whichCrypto }) => {
  const [candleLength, setCandleLength] = useState<string>("daily");
  const LIMIT = 100; //btc와 eth 단 두 데이터를 하나의 다이나모DB에서 받아오기 때문에, 10개 데이터를 가져오면 이더5개 비트5개 가져옴. 즉, 원하는 캔들 갯수 x 2 분량으로 해야함

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery<
    UpbitDailyCandle[],
    Error
  >({
    queryKey: ["btcEthCandleApi", whichCrypto, candleLength],
    queryFn: async ({ pageParam = null }) => {
      let url = "";
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
          url = "https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle/yearly";
          break;
        default:
          throw new Error("지원하지 않는 캔들 길이입니다.");
      }
      const finalUrl = pageParam ? `${url}?limit=${LIMIT}&before=${pageParam}` : `${url}?limit=${LIMIT}`;
      const response = await axios.get(finalUrl);

      const matched = response.data.items
        .filter((item: UpbitDailyCandle) => item.market === whichCrypto)
        .sort(
          (a: UpbitDailyCandle, b: UpbitDailyCandle) =>
            new Date(b.candle_date_time_utc).getTime() - new Date(a.candle_date_time_utc).getTime(),
        );

      return matched;
    },
    getNextPageParam: (lastPage) => {
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.candle_date_time_utc;
    },
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
  });

  const flatData = data?.pages.flat() || [];

  // const { data, isPending, error } = useQuery<UpbitDailyCandle[]>({
  //   queryKey: ["btcEthCandleApi", whichCrypto, candleLength, limit],
  //   queryFn: async () => {
  //     let url = "";

  //     // ✅ 조건에 따라 URL 설정
  //     switch (candleLength) {
  //       case "daily":
  //         url = "https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle/daily";
  //         break;
  //       case "weekly":
  //         url = "https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle/weekly";
  //         break;
  //       case "monthly":
  //         url = "https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle/monthly";
  //         break;
  //       case "yearly":
  //         url = "https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/candle/yearly";
  //         break;
  //       default:
  //         throw new Error("지원하지 않는 캔들 길이입니다.");
  //     }

  //     // limit 값을 쿼리스트링으로 전달 (예: ?limit=300)
  //     const finalUrl = `${url}?limit=${limit}`;
  //     const response = await axios.get(finalUrl);

  //     // const response = await axios.get(url);

  //     // 🎯 필터링 및 정렬은 공통 처리 가능
  //     const matched = response.data.items
  //       .filter((item: UpbitDailyCandle) => item.market === whichCrypto)

  //       .sort(
  //         (a: UpbitDailyCandle, b: UpbitDailyCandle) =>
  //           new Date(b.candle_date_time_utc).getTime() - new Date(a.candle_date_time_utc).getTime(),
  //       );

  //     return matched.slice(0, limit);
  //   },
  //   staleTime: 500,
  // });

  // useEffect(() => {
  //   console.log("일봉 응답 데이터:", data);
  // }, [data]);

  // useEffect(() => {
  //   if (data) {
  //     console.table(
  //       data.map((item) => ({
  //         date: item.candle_date_time_utc,
  //         parsed: new Date(item.candle_date_time_utc).toISOString(),
  //       })),
  //     );
  //   }
  // }, [data]);

  useEffect(() => {
    console.log("일봉 응답 데이터:", flatData);
  }, [flatData]);

  useEffect(() => {
    if (flatData) {
      console.table(
        flatData.map((item) => ({
          date: item.candle_date_time_utc,
          parsed: new Date(item.candle_date_time_utc).toISOString(),
        })),
      );
    }
  }, [flatData]);

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
          size="small"
          sx={{ width: 80 }}
        >
          <MenuItem value="daily">일봉</MenuItem>
          <MenuItem value="weekly">주봉</MenuItem>
          <MenuItem value="monthly">월봉</MenuItem>
          <MenuItem value="yearly">연봉</MenuItem>
        </Select>
      </FormControl>

      {data ? (
        <>
          <CandleStickChartDemo2 data={flatData} candleLength={candleLength} />
          {isFetchingNextPage && <Box></Box>}
        </>
      ) : (
        <Box>로딩...</Box>
      )}
    </Container>
  );
};

export default CryptoDailyCandle;
