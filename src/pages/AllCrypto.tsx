import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface CoinTickerData {
  type: "ticker";
  code: string; // 마켓 코드 (e.g., KRW-BTC)

  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;

  change: "RISE" | "EVEN" | "FALL";
  change_price: number;
  signed_change_price: number;
  change_rate: number;
  signed_change_rate: number;

  trade_volume: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;

  trade_date: string; // yyyyMMdd
  trade_time: string; // HHmmss
  trade_timestamp: number;

  ask_bid: "ASK" | "BID";

  acc_ask_volume: number;
  acc_bid_volume: number;

  highest_52_week_price: number;
  highest_52_week_date: string; // yyyy-MM-dd
  lowest_52_week_price: number;
  lowest_52_week_date: string; // yyyy-MM-dd

  trade_status?: string; // deprecated
  market_state: "PREVIEW" | "ACTIVE" | "DELISTED";
  market_state_for_ios?: string; // deprecated
  is_trading_suspended?: boolean; // deprecated
  delisting_date?: string; // optional

  market_warning: "NONE" | "CAUTION";

  timestamp: number;
  stream_type: "SNAPSHOT" | "REALTIME";
}

const AllCrypto = () => {
  const [price, setPrice] = useState<Record<string, CoinTickerData>>({});
  useEffect(() => {
    let socket: WebSocket;

    const fetchAndSubscribe = async () => {
      // 1. 전체 마켓 목록 가져오기
      const res = await fetch("https://api.upbit.com/v1/market/all");
      const data = await res.json();

      // 2. KRW- 마켓만 필터링
      const krwMarkets = data
        .filter((m: { market: string }) => m.market.startsWith("KRW-"))
        .map((m: { market: string }) => m.market);

      // 3. WebSocket 연결
      socket = new WebSocket("wss://api.upbit.com/websocket/v1");

      socket.onopen = () => {
        socket.send(JSON.stringify([{ ticket: "all-krw-tickers" }, { type: "ticker", codes: krwMarkets }]));
      };

      socket.onmessage = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
          const json = JSON.parse(reader.result as string);
          setPrice((prev) => ({
            ...prev,
            [json.code]: json,
          }));
        };
        reader.readAsText(event.data);
      };
    };

    fetchAndSubscribe();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "14vh",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        거래소
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          color: "gray",
          border: 1,
          display: "grid",
          placeItems: "center",
        }}
      >
        {Object.entries(price)
          // .slice(0, 5)
          .map(([code, value]) => (
            <Box sx={{ display: "flex", placeItems: "center", gap: 5, color: "black" }}>
              <Typography key={code}>
                {code}: {value.trade_price.toLocaleString()} 원
              </Typography>
              <Typography key={code}>
                <span
                  style={{
                    color:
                      value.change === "RISE"
                        ? "red"
                        : value.change === "FALL"
                          ? "blue"
                          : value.change === "EVEN"
                            ? "gray"
                            : "black",
                  }}
                >
                  {value.change_price.toLocaleString()} 원
                </span>
              </Typography>

              <Typography key={code}>{value.acc_trade_price_24h.toLocaleString()} 원</Typography>
            </Box>
          ))}
      </Box>
    </Container>
  );
};

export default AllCrypto;
