import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const AllCrypto = () => {
  const [price, setPrice] = useState<Record<string, number>>({});

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
            [json.code]: json.trade_price,
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
        paddingTop: "10vh",
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
            <Typography key={code}>
              {code}: {value.toLocaleString()} 원
            </Typography>
          ))}
      </Box>
    </Container>
  );
};

export default AllCrypto;
