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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, error } = useInfiniteQuery<
    UpbitDailyCandle[],
    Error
  >({
    queryKey: ["btcEthCandleApi", whichCrypto, candleLength],
    queryFn: async ({ pageParam }) => {
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
      console.log("🔥 요청 URL:", finalUrl);
      const response = await axios.get(finalUrl);

      const matched = response.data.items
        .filter((item: UpbitDailyCandle) => item.market === whichCrypto)
        .sort(
          (a: UpbitDailyCandle, b: UpbitDailyCandle) =>
            new Date(b.candle_date_time_utc).getTime() - new Date(a.candle_date_time_utc).getTime(),
        );

      return matched;
    },
    // getNextPageParam: (lastPage) => {
    //   const lastItem = lastPage[lastPage.length - 1];
    //   return lastItem?.candle_date_time_utc;
    // },
    // getNextPageParam: (lastPage) => {
    //   if (!lastPage || lastPage.length === 0) return undefined;

    //   const oldest = lastPage.reduce((min, item) => {
    //     return new Date(item.candle_date_time_utc) < new Date(min.candle_date_time_utc) ? item : min;
    //   });

    //   return oldest?.candle_date_time_utc;
    // },
    // getNextPageParam: (lastPage) => {
    //   if (!lastPage || lastPage.length === 0) return undefined;

    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      const oldestCandle = lastPage[lastPage.length - 1];
      return oldestCandle?.candle_date_time_utc;
    },

    //   const oldest = lastPage.reduce((min, item) =>
    //     new Date(item.candle_date_time_utc) < new Date(min.candle_date_time_utc) ? item : min
    //   );

    //   const date = new Date(oldest.candle_date_time_utc);
    //   date.setDate(date.getDate() - 1); // 하루 이전

    //   return date.toISOString().split("T")[0] + "T00:00:00"; // 형식 유지
    // },
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
  });

  // const flatData = data?.pages.flat() || [];
  const flatData = data?.pages.flat().reduce<UpbitDailyCandle[]>((acc, cur) => {
    // if (!acc.some((item) => item.candle_date_time_utc === cur.candle_date_time_utc)) {
    //   acc.push(cur);
    // }
    if (!acc.some((item) => item.candle_date_time_utc === cur.candle_date_time_utc && item.market === cur.market)) {
      acc.push(cur);
    }
    return acc;
  }, []);

  useEffect(() => {
    console.log("flatData length:", flatData?.length);
    console.log("페이지 수:", data?.pages.length);
  }, [flatData, data]);
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

  if (isPending) return <div>데이터 로딩중</div>;
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
          {flatData && (
            <CandleStickChartDemo2
              data={flatData}
              candleLength={candleLength}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              // onLoadMore={() => {
              //   if (hasNextPage && !isFetchingNextPage) {
              //     fetchNextPage();
              //   }
              // }}
            />
          )}
        </>
      ) : (
        <Box>로딩...</Box>
      )}
    </Container>
  );
};

export default CryptoDailyCandle;
