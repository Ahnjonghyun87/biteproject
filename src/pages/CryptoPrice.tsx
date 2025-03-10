import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import UpbitCoinPrice from "../types/upbitCoinPrice";
const CryptoPrice = () => {
  const [btcEthPrice, setBtcEthPrice] = useState<UpbitCoinPrice>();
  // const QueryClient = useQuery<>({
  //   queryKey:["coinPrice", ]
  // })
  const GetPrice = async () => {
    try {
      const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");
      setBtcEthPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetPrice();
  }, []);

  const onClickPriceButton = () => {};

  // const image = btcEthPrice?.market?KRW-BTC ?
  return (
    <Container sx={{ height: "75vh" }}>
      <Box>
        {btcEthPrice ? (
          btcEthPrice.map((crypto, image) => {
            return (
              <Box
                display={"inline"}
                justifyContent={"center"}
                padding={5}
                gap={4}
                sx={{ fontSize: 48, width: "100%" }}
                key={crypto.market}
              >
                <img
                  height={100}
                  width={100}
                  key={crypto.market}
                  src={crypto.market === "KRW-BTC" ? "/images/BTC.svg" : "/images/ETH.svg"}
                ></img>
                <Button variant="contained">{crypto.market.substring(4)}</Button>
                <Typography component={"span"} padding={2} sx={{ fontSize: 36 }}>
                  {crypto.trade_price}
                </Typography>
                {/* <Typography>{crypto.change}</Typography> */}
              </Box>
            );
          })
        ) : (
          <div>로딩...</div>
        )}
      </Box>
    </Container>
  );
};

export default CryptoPrice;
